# # from sqlalchemy import create_engine
# # from sqlalchemy.orm import sessionmaker, declarative_base


# # SQLite local: file holidays.db in backend/ folder
# SQLALCHEMY_DATABASE_URL = "sqlite:///./holidays.db"

# # check_same_thread=False is necessary for SQLite works with mutiples threads (uvicorn)
# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# # SessionLocal: factory for creating sessions to communicate with the database
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # Base: base class for mapping ORM models
# Base = declarative_base()

# # engine keep conecction with SQLite.
# # SessionLocal() create objects section by requisition.
# # Base is SQLAlchemy's base for declaring tables (ORM).

from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL ="mongodb+srv://kevin:FLxjLq9uEHt2ZRmO@cluster0.ujf3fpl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = AsyncIOMotorClient(MONGO_URL)
db = client["holiday_planner"]
holidays_collection = db["holidays"]