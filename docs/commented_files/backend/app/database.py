"""
MongoDB database wiring for the Holiday Planner backend.

This module exposes:
- `client`: a shared AsyncIOMotorClient instance
- `db`: a database handle for "holiday_planner"
- `holidays_collection`: the collection where holiday documents are stored

IMPORTANT:
- Credentials are currently hard-coded for simplicity. In production, always
  read secrets from environment variables or a secrets manager.
"""

# Import the async MongoDB driver (Motor) to talk to MongoDB using await/async.
from motor.motor_asyncio import AsyncIOMotorClient

# Connection string for MongoDB.
# NOTE: For production, move this to an environment variable (e.g., os.environ["MONGO_URL"]).
MONGO_URL = "mongodb+srv://kevin:FLxjLq9uEHt2ZRmO@cluster0.ujf3fpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a single, shared async client for the whole app lifetime.
# Motor manages connection pooling under the hood.
client: AsyncIOMotorClient = AsyncIOMotorClient(MONGO_URL)

# Get a reference to the logical database named "holiday_planner".
# MongoDB will create it lazily on first write if it does not exist.
db = client["holiday_planner"]

# Get a handle to the "holidays" collection within that database.
# Collections are also created on first write.
holidays_collection = db["holidays"]
