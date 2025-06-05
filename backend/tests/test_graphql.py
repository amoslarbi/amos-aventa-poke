import pytest
from src.models.pokemon import Pokemon
from src.services.crud import create_pokemon
from src.schemas.pokemon import PokemonCreate
from fastapi.testclient import TestClient
from src.core.config import settings

def test_get_pokemon(client: TestClient, db_session):
    # Seed database with test data
    pokemon = PokemonCreate(id=1, name="bulbasaur", api_url=f"{settings.pokeapi_base_url}/pokemon/1/")
    create_pokemon(db_session, pokemon)
    db_session.commit()
    
    # Verify database state
    pokemon_count = db_session.query(Pokemon).count()
    assert pokemon_count == 1, f"Expected 1 Pokémon in database, found {pokemon_count}"
    
    query = """
        query {
            pokemon(limit: 10, offset: 0) {
                id
                pokemon_id
                name
                api_url
                created_at
                updated_at
            }
            metadata {
                id
                total_count
                created_at
            }
        }
    """
    
    response = client.post("/pokemon/graphql", json={"query": query})
    
    assert response.status_code == 200
    data = response.json()
    assert "errors" not in data
    assert len(data["data"]["pokemon"]) == 1, f"Expected 1 Pokémon, got {len(data['data']['pokemon'])}"
    assert data["data"]["pokemon"][0] == {
        "id": 1,
        "name": "bulbasaur",
        "api_url": f"{settings.pokeapi_base_url}/pokemon/1/"
    }