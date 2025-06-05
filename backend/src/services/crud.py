from sqlalchemy.orm import Session
from ..models.pokemon import Pokemon, Metadata
from ..schemas.pokemon import PokemonCreate
from typing import List
from datetime import datetime
from ..utils.logging_helper import setup_logging

# Setup logging
logger = setup_logging()

def create_pokemon(db: Session, pokemon: PokemonCreate):
    db_pokemon = db.query(Pokemon).filter(Pokemon.pokemon_id == pokemon.pokemon_id).first()
    if not db_pokemon:
        db_pokemon = Pokemon(
            pokemon_id = pokemon.pokemon_id,
            name = pokemon.name,
            api_url = pokemon.api_url,
            created_at = pokemon.created_at,
            updated_at = pokemon.updated_at
        )
        db.add(db_pokemon)
    else:
        db_pokemon.name = pokemon.name
        db_pokemon.api_url = pokemon.api_url
        db_pokemon.updated_at = pokemon.updated_at
        db.add(db_pokemon)

def create_metadata(db: Session, total_count: int):
    db_metadata = Metadata(total_count=total_count)
    db.add(db_metadata)

def get_pokemon(db: Session, limit: int = 20, offset: int = 0) -> List[Pokemon]:
    return db.query(Pokemon).offset(offset).limit(limit).all()

def get_metadata(db: Session) -> List[Metadata]:
    return db.query(Metadata).all()

def get_pokemon_count(db: Session) -> int:
    count = db.query(Pokemon).count()
    return count