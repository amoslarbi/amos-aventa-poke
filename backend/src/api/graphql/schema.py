from ariadne import QueryType, gql, make_executable_schema
from ...database.db import SessionLocal
from ...services.crud import get_pokemon, get_metadata
from ...utils.logging_helper import setup_logging

# Setup logging
logger = setup_logging()

# GraphQL Schema
type_defs = gql("""
    type Pokemon {
        id: Int!
        pokemon_id: Int!
        name: String!
        api_url: String!
        created_at: String
        updated_at: String
    }
                
    type Metadata {
        id: Int!
        total_count: Int
        created_at: String!
    }

    type Query {
        pokemon(limit: Int!, offset: Int!): [Pokemon!]!
        metadata: [Metadata]
    }
""")

query = QueryType()

# Pokemon query
@query.field("pokemon")
def resolve_pokemon(_, info, limit, offset):
    db = SessionLocal()
    # Log call start
    logger.info(f"Called resolve_pokemon with limit={limit} and offset={offset}")
    try:
        # Validate limit
        if limit <= 0:
            raise ValueError("Limit must be positive")
        # Validate offset
        if offset < 0:
            raise ValueError("Offset cannot be negative")
        result = get_pokemon(db, limit, offset)
        logger.info(f"resolve_pokemon succeeded with {len(result)} records")
        return get_pokemon(db, limit, offset)
    except Exception as e:
        # Log error at ERROR level
        logger.error(f"resolve_pokemon failed: {e}")
        raise
    finally:
        db.close()

# Metadata query
@query.field("metadata")
def resolve_metadata(_, info):
    db = SessionLocal()
    # Log call start
    logger.info(f"Called resolve_metadata")
    try:
        result = get_metadata(db)
        logger.info(f"resolve_metadata succeeded with {len(result)} records")
        return get_metadata(db)
    except Exception as e:
        # Log error at ERROR level
        logger.error(f"resolve_metadata failed: {e}")
        raise
    finally:
        db.close()

schema = make_executable_schema(type_defs, query)