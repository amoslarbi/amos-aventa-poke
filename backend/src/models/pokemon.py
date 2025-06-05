from sqlalchemy import Column, Integer, String, DateTime
from ..database.db import Base
from datetime import datetime

# Model for pokemon table
class Pokemon(Base):
    __tablename__ = "pokemon"
    
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    pokemon_id = Column(Integer, unique=True, nullable=False, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    api_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, nullable=False, onupdate=datetime.now)

# Model for metadata table
class Metadata(Base):
    __tablename__ = "metadata"
    
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    total_count = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)