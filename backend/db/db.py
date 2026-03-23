from dotenv import load_dotenv
import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


load_dotenv() # Reads the .env file

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    pool_recycle=3600
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    # Creating a DB session and closing it once done.
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from models.models import Posts, Users, Comments, Reactions
    Base.metadata.create_all(bind=engine)
    