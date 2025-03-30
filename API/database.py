from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

MONGO_DETAILS = "mongodb+srv://riotg249:L0E2JML5jfAWyCIB@realitext.99x5t.mongodb.net/?retryWrites=true&w=majority&appName=RealiText"
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.auth_database
users_collection = database.get_collection("users")

# Create unique index for username and email
async def create_indexes():
    sync_client = MongoClient(MONGO_DETAILS)
    db = sync_client["auth_database"]
    db.users.create_index("username", unique=False)
    db.users.create_index("email", unique=True)

# Create indexes when app starts
async def startup_db():
    await create_indexes()