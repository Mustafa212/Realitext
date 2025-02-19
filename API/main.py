from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from jose import JWTError, jwt
from database import users_collection, startup_db
from schemas import UserCreate, UserResponse, Token, PyObjectId
from utils import *
from bson import ObjectId
from pymongo.errors import DuplicateKeyError
import uvicorn


app = FastAPI()

@app.get("/")
def index():
    return {"message": "Hello, World!"}



# Add startup event to create indexes
@app.on_event("startup")
async def startup_event():
    await startup_db()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --------------------------
# Helper Functions
# --------------------------
async def get_user(username: str):
    return await users_collection.find_one({"username": username})

async def create_user(user_data: dict):
    try:
        user_data["hashed_password"] = get_password_hash(user_data.pop("password"))
        result = await users_collection.insert_one(user_data)
        new_user = await users_collection.find_one({"_id": result.inserted_id})
        return new_user
    except DuplicateKeyError as e:
        raise HTTPException(
            status_code=400,
            detail="Username or email already exists"
        )

# --------------------------
# Routes
# --------------------------
@app.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    existing_user = await users_collection.find_one({
        "$or": [
            {"username": user.username},
            {"email": user.email}
        ]
    })
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already registered"
        )
    
    created_user = await create_user(user.model_dump())
    return created_user

@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = await get_user(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await get_user(username)
    if user is None:
        raise credentials_exception
    return user

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
