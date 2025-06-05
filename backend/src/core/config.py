from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # env variables
    sqlalchemy_database_url: str
    pokeapi_base_url: str
    api_base_url: str
    ui_base_url: str

    class Config:
        env_file = ".env"

settings = Settings()