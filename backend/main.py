from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.endpoints.pokemon import router as pokemon_router
from src.api.graphql.schema import schema
from src.database.db import engine
from src.models.pokemon import Base
from ariadne.asgi import GraphQL
from contextlib import asynccontextmanager
from src.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="Pokémon API", lifespan=lifespan)

# Add CORS middleware to access frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"{settings.ui_base_url}"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pokemon_router, prefix="/pokemon", tags=["pokemon"])
# Mount graphql
app.mount("/pokemon/graphql", GraphQL(schema, debug=True))