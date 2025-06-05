from pydantic import BaseModel
from datetime import datetime

class PokemonBase(BaseModel):
    pokemon_id: int
    name: str
    api_url: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

class PokemonCreate(PokemonBase):
    pass

class Pokemon(PokemonBase):
    class Config:
        from_attributes = True

class Metadata(BaseModel):
    total_count: int
    created_at: datetime | None = None
    
    class Config:
        from_attributes = True

class PokemonFetchResponse(BaseModel):
    message: str