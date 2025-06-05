from fastapi import APIRouter, HTTPException, BackgroundTasks
from ...database.db import SessionLocal
from ...schemas.pokemon import PokemonCreate
from ...services.crud import create_pokemon, create_metadata, get_pokemon_count, get_metadata
from ...core.config import settings
import requests
from typing import List
from ...utils.logging_helper import setup_logging
from datetime import datetime

# Setup logging
logger = setup_logging()

# Setup routing
router = APIRouter()

# Fetch pokemon data from poke api
def fetch_pokemon_page(url: str) -> dict:
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        # Log poke api
        logger.info(f"Data fetched from poke api with {len(data)} records")
        return data
    except requests.RequestException as e:
        # Log error at ERROR level
        logger.error(f"API error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"API request failed: {str(e)}")

@router.post("/fetch")
# Fetch pokemons and insert into database
async def fetch_and_store_pokemon(limit: int, offset: int):
    db = SessionLocal()
    # Log call start
    logger.info(f"Called fetch_and_store_pokemon with limit={limit} and offset={offset}")
    # Use the total number of rows from the pokemon table for the offset value
    offset = get_pokemon_count(db)
    try:
        # Validate limit
        if limit <= 0:
            raise ValueError("Limit must be positive")
        # Validate offset
        if offset < 0:
            raise ValueError("Offset cannot be negative")
        url = f"{settings.pokeapi_base_url}/pokemon?limit={limit}&offset={offset}"
        data = fetch_pokemon_page(url)
        numberOfRecords = len(data["results"]);
        
        # Generate pokemon list and insert into pokemon table
        pokemon_list = [
            PokemonCreate(
                pokemon_id=int(pokemon["url"].split("/")[-2]),
                name=pokemon["name"],
                api_url=pokemon["url"],
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            for pokemon in data["results"]
        ]
        
        for pokemon in pokemon_list:
            create_pokemon(db, pokemon)
        
        # Generate metadata and insert into metadata table
        create_metadata(db, numberOfRecords)
        db.commit()
        response = {
            "message": "Pokemons fetched and inserted into pokemon table",
            "data": pokemon_list
        }
        # Log success at INFO level
        logger.info(f"Pokemons inserted into pokemon table with {numberOfRecords} records")
        return response
    except Exception as e:
        db.rollback()
        # Log error at ERROR level
        logger.error(f"fetch_and_store_pokemon failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@router.get("/count")
# Count number of rows in pokemon table
async def get_pokemon_count_endpoint():
    db = SessionLocal()
    # Log call start
    logger.info(f"Called get_pokemon_count_endpoint")
    try:
        count = get_pokemon_count(db)
        response = {
            "message": "Success",
            "data": {
                "count": count
            }
        }
        # Log success at INFO level
        logger.info(f"get_pokemon_count_endpoint succeeded with count: {count}")
        return response
    except Exception as e:
        # Log error at ERROR level
        logger.error(f"get_pokemon_count_endpoint failed: {e}")
        raise
    finally:
        db.close()

@router.get("/metadata")
# Get metadata from metadata table
def get_metadata_endpoint():
    db = SessionLocal()
    # Log call start
    logger.info(f"Called resolve_latest_metadata")
    try:
        metadata = get_metadata(db)
        # Log success at INFO level
        logger.info(f"get_metadata_endpoint succeeded with {len(metadata)} records")
        return metadata
    except Exception as e:
        # Log error at ERROR level
        logger.error(f"resolve_latest_metadata failed: {e}")
        raise
    finally:
        db.close()