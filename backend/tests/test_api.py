import pytest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from unittest.mock import patch
from src.schemas.pokemon import Pokemon, PokemonCreate
from src.services.crud import create_pokemon
from src.api.endpoints.pokemon import fetch_and_store_pokemon
from fastapi.testclient import TestClient
from src.core.config import settings

@pytest.mark.parametrize("mock_response", [
    {
        "count": 1302,
        "next": None,
        "previous": None,
        "results": [
            {"name": "bulbasaur", "url": f"{settings.pokeapi_base_url}/pokemon/1/"}
        ]
    }
])
def test_fetch_pokemon(client: TestClient, db_session, mock_response):
    with patch("src.api.endpoints.pokemon.requests.get") as mock_get:
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response
        
        # Call the fetch function directly to avoid background task issues
        fetch_and_store_pokemon()
    
    # Verify data was inserted
    pokemon = db_session.query(Pokemon).filter(Pokemon.id == 1).first()
    assert pokemon is not None
    assert pokemon.name == "bulbasaur"
    assert pokemon.api_url == f"{settings.pokeapi_base_url}/pokemon/1/"

@pytest.mark.parametrize("mock_response", [
    {
        "count": 1302,
        "next": None,
        "previous": None,
        "results": [
            {"name": "bulbasaur", "url": f"{settings.pokeapi_base_url}/pokemon/1/"}
        ]
    }
])
def test_fetch_pokemon_api_failure(client: TestClient, db_session, mock_response):
    with patch("src.api.endpoints.pokemon.requests.get") as mock_get:
        mock_get.return_value.status_code = 500
        mock_get.return_value.raise_for_status.side_effect = Exception("API Error")
        
        try:
            fetch_and_store_pokemon()
        except Exception as e:
            assert str(e) == "API request failed: API Error"
        
        # Verify no data was inserted
        pokemon = db_session.query(Pokemon).filter(Pokemon.id == 1).first()
        assert pokemon is None