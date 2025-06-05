import pytest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.database.db import Base, SessionLocal
from main import app
from src.models.pokemon import Pokemon, Metadata  # Explicitly import models

@pytest.fixture(scope="function")  # Changed to function scope for fresh database per test
def db_engine():
    # Use an in-memory SQLite database for tests
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session(db_engine):
    connection = db_engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection)()
    yield session
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db_session):
    def override_session():
        try:
            yield db_session
        finally:
            db_session.close()
    
    app.dependency_overrides[SessionLocal] = override_session
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()