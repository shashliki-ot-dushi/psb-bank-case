from os import environ

from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


DATABASE_URL = environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise KeyError("Environment variable DATABASE_URL is not specified")


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_db():
    with SessionLocal() as session:
        try:
            session.execute(text("SELECT 1"))
        except Exception as e:
            raise ConnectionError(e)