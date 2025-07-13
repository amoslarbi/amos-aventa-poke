# Pokémon Explorer
A full-stack application to fetch, store, and display Pokémon data from PokeAPI. The backend is built with FastAPI (Python) and SQLite, and the frontend is built with Next.js (TypeScript) and Tailwind CSS. The app is dockerized for easy deployment.


# Prerequisites
- Docker and Docker Compose
- Node.js 20 (for local frontend development)
- Python 3.11 (for local backend development)


# Build and Run Docker:
- Ensure ports 3000 and 8000 are free
- Run this command in the terminal of the root directory (amos-aventa-poke-master)
    - docker-compose up --build
- Access Frontend via
    - http://localhost:3000/pokemon
- Access Backend via
    - http://localhost:8000


# Usage
Frontend:
- Visit http://localhost:3000/pokemon.
- Use the search bar to filter Pokémons (3+ characters).
- Use the Fetch More Pokémon feature to add more Pokémons
- Adjust items per page with the dropdown (5, 10, 15, 20).
- Navigate pages with Previous/Next buttons.


Backend:
- Trigger data fetch: curl -X POST http://localhost:8000/pokemon/fetch?limit=10&offset=0.
- List Pokémons: curl http://localhost:8000/pokemon/graphql?limit=10&offset=0.
- Get Metadata details: curl http://localhost:8000/pokemon/metadata.


# Stop Services:
- docker-compose down  # or docker-compose down -v to remove pokemon.db


# Design Decisions
- Modular Architecture: Frontend uses Next.js App Router with components and API utilities separated. Backend is well organized for scalability.
- Database Schema: SQLite with two tables: pokemon (id, pokemon_id, name, api_url, created_at, updated_at) and api_metadata (id, total_count, created_at). Indexes on pokemon(id and name) for performance.
- Data Pipeline: PokeAPI data is fetched in batches (max 20 per request) to respect rate limits, transformed into Pydantic models, and stored in SQLite. Background tasks prevent blocking.
- Caching: Backend stores data in SQLite to avoid repeated PokeAPI calls. Frontend uses Next.js fetch caching with a 1-hour revalidation period.
- CORS: Configured to allow requests from http://localhost:3000 (local) and http://frontend:3000 (Docker).
- Error Handling: Robust handling for API failures, database errors, and invalid requests with meaningful HTTP responses.
- Dockerization: Lightweight images (python:3.11-slim, node:20-alpine) for efficiency. SQLite database is mounted as a volume for persistence.


# Features
Frontend:
- Lists Pokémon with pagination (default 5 per page) and a limit dropdown (5, 10, 15, 20) to adjust limit per page.
- Real-time search (triggers after 3+ characters).
- Fetch more Pokémons feature: Allows fetching additional Pokémon with a specified limit, showing prompts for success, failure, or exceeding the maximum Pokémon count (from PokeAPI).
- Styled with Tailwind CSS for a responsive UI.

Backend:
- Fetches Pokémon data from PokeAPI and stores it in an SQLite database.
- Exposes REST endpoints:
    - /pokemon/fetch?limit={value}&offset{value} (fetch Pokémons from poke api).
    - /pokemon/graphql (fetch Pokémons from sqlite database).
    - /pokemon/metadata (fetch metadata from sqlite database).
- Uses SQLAlchemy for database operations and Pydantic for data validation.
- Handles CORS for frontend compatibility.


# Database Schema
pokemon table:
- id: Integer, primary key, autoincrement, indexed, not null
- pokemon_id: Integer, unique, not null
- name: String, unique, indexed, not null
- api_url: String, not null
- created_at: DateTime, not null
- updated_at: DateTime, not null

metadata table:
- id: Integer, primary key, autoincrement, indexed, not null
- total_count: Integer, not null
- created_at: DateTime, not null


# Docker:
- Separate containers for backend (Python) and frontend (Node.js).
- Docker Compose orchestrates services with a shared network and persistent database.


# Setup
- Clone the Repository:
- cd aventa-poke


# Directory Structure:
- backend/: FastAPI application and dependencies.
- frontend/: Next.js application and dependencies.
- pokemon.db: SQLite database (generated at runtime).
- docker-compose.yml: Orchestrates services.


# Local Development (Optional):
Backend:cd backend
- python -m venv venv
- source venv/bin/activate  # or venv\Scripts\activate on Windows
- pip install -r requirements.txt
- uvicorn main:app --reload

Frontend:
- cd frontend
- npm install
- npm run dev


Set NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/pokemon in frontend/.env.


# Troubleshooting
- In the event where subsequent docker rebuilds causes a malfunction, clear the local storage value: “hasFetchedPokemon” and run this command in the root directory:
    - docker-compose down && cd backend && rm -rf pokemon.db && cd .. && docker-compose up --build
- CORS Errors: Ensure allow_origins in backend/main.py includes your frontend URL.
- 500 Errors: Check backend logs (docker-compose logs backend) for PokeAPI or database issues. Test PokeAPI: curl https://pokeapi.co/api/v2/pokemon?limit=20.
- Frontend Fails to Load: Verify NEXT_PUBLIC_API_BASE_URL and backend availability. Check frontend logs: docker-compose logs frontend.
- Database Issues: Ensure pokemon.db is writable. Delete and restart to recreate: cd backend && rm -rf pokemon.db && cd .. && docker-compose up --build.

# Limitations
- The SQLite file is being saved inside the container, so it is deleted when the container stops or rebuilds. The solution would be to ensure SQLite persistence by using a volume or bind mount, this would prevent it from being wiped after docker rebuilds.
- Error Feedback: Basic error logging in frontend; will consider adding user-facing notifications.
- Backend Startup: depends_on in Docker Compose doesn't guarantee backend readiness. Add a health check for production.
- Adding new Pokémons by name
- Pokémon details page
- Writing more test cases
