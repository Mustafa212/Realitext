from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from transformers import AutoTokenizer, TFElectraModel
from arabert.preprocess import ArabertPreprocessor
from huggingface_hub import hf_hub_download
import tensorflow as tf
import re
import logging
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pymongo import MongoClient
from bson import ObjectId
from typing import Optional
import os
import PyPDF2
import docx

app = FastAPI(swagger_ui_parameters={"defaultModelsExpandDepth": -1})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB Setup
client = MongoClient("mongodb+srv://nadaa:mypass@cluster0.wjfbz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["text_classification"]
users_collection = db["users"]

# JWT & Security Settings
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Token data model
class ClassificationResponse(BaseModel):
    classification: str
    confidence: float

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    username: str
    password: str

class FeedbackRequest(BaseModel):
    feedback: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=30))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Login route to get token
@app.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user["username"]})
    return {"access_token": token, "token_type": "bearer"}

# Authentication Helper Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return users_collection.find_one({"username": username})
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Arabic Text Classifier
class ArabicTextClassifier:
    def __init__(self):
        try:
            self.REPO_ID = "nadddaaa/AI_Arabic_Text_Detector"
            self.MODEL_FILENAME = "NadaFinal.h5"

            logger.info("Downloading model...")
            self.model_path = hf_hub_download(repo_id=self.REPO_ID, filename=self.MODEL_FILENAME)
            tf.keras.utils.get_custom_objects()['TFElectraModel'] = TFElectraModel

            logger.info("Loading tokenizer...")
            self.tokenizer = AutoTokenizer.from_pretrained("aubmindlab/araelectra-base-discriminator")
            
            logger.info("Loading model...")
            self.model = tf.keras.models.load_model(self.model_path, compile=False)
            
            logger.info("Initializing preprocessor...")
            self.preprocessor = ArabertPreprocessor("aubmindlab/araelectra-base-discriminator")

        except Exception as e:
            logger.error(f"Initialization failed: {str(e)}")
            raise

    def preprocess_text(self, text):
        try:
            text = self.preprocessor.preprocess(text)
            text = re.sub(r'[^\u0600-\u06FF\s]', '', text).strip()
            return text
        except Exception as e:
            logger.error(f"Preprocessing error: {str(e)}")
            raise

    def predict(self, text):
        try:
            clean_text = self.preprocess_text(text)
            inputs = self.tokenizer(clean_text, padding="max_length", truncation=True, max_length=128, return_tensors="tf")
            prediction = self.model.predict({'input_ids': inputs['input_ids'], 'attention_mask': inputs['attention_mask']}, verbose=0)
            return float(prediction[0][0])
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            return 0.0  # Defaulting to Human Generated

classifier = ArabicTextClassifier()

# Define the TextRequest Pydantic model
class TextRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the Arabic Text Classification API!"}

# ✅ Registration & Login
@app.post("/register")
def register(username: str, password: str):
    if users_collection.find_one({"username": username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = get_password_hash(password)
    user_id = users_collection.insert_one({"username": username, "password": hashed_password}).inserted_id
    return {"message": "User registered successfully", "user_id": str(user_id)}

@app.post("/login", response_model=Token)
async def login(request: LoginRequest):
    user = users_collection.find_one({"username": request.username})
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/classify", response_model=ClassificationResponse)
async def classify_text(request: TextRequest):
    try:
        # Perform classification
        probability = classifier.predict(request.text)
        if probability is None:
            raise HTTPException(status_code=500, detail="Prediction failed")

        # Determine the classification based on probability
        classification = "AI Generated" if probability >= 0.5 else "Human Generated"
        confidence = float(probability if probability >= 0.5 else 1 - probability)

        # Create feedback document with classification result
        feedback_document = {
            "text": request.text,  # The text being classified
            "classification": classification,
            "confidence": confidence,
            "date": datetime.utcnow(),  # Current date and time
            "feedback": request.text  # Store the input text as feedback
        }

        # Insert feedback document into the 'feedbacks' collection (or user feedback collection)
        # Since we are not using authorization, this could be a general collection or feedback storage
        feedback_collection = db["users"]  # Assuming you have a separate 'feedbacks' collection
        feedback_collection.insert_one(feedback_document)

        return ClassificationResponse(
            classification=classification,
            confidence=confidence
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing classification: {str(e)}")


# ✅ New File Extraction Endpoint
@app.post("/extract")
async def extract_text(file: UploadFile = File(...)):
    try:
        if file.filename.endswith(".txt"):
            text = await file.read()
            extracted_text = text.decode("utf-8")

        elif file.filename.endswith(".pdf"):
            pdf_reader = PyPDF2.PdfReader(file.file)
            extracted_text = "".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])

        elif file.filename.endswith(".docx"):
            doc = docx.Document(file.file)
            extracted_text = "\n".join([paragraph.text for paragraph in doc.paragraphs])

        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Upload .txt, .pdf, or .docx")

        return {"filename": file.filename, "extracted_text": extracted_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting text: {str(e)}")

@app.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    try:
        # Find the latest user in the database (last registered user)
        user = users_collection.find_one({}, sort=[("_id", -1)])  # Gets the most recent user

        if not user:
            raise HTTPException(status_code=404, detail="No users found in the database")

  

        return {"message": "Feedback submitted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error submitting feedback: {str(e)}")



