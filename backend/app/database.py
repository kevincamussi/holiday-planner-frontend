from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite local: file holidays.db in backend/ folder
SQLALCHEMY_DATABASE_URL = "sqlite:///./holidays.db"

# check_same_thread=False is necessary for SQLite works with mutiples threads (uvicorn)
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# SessionLocal: factory for creating sessions to communicate with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base: base class for mapping ORM models
Base = declarative_base()

# engine keep conecction with SQLite.
# SessionLocal() create objects section by requisition.
# Base is SQLAlchemy's base for declaring tables (ORM).