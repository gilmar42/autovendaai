from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "VendAI"
    API_V1_STR: str = "/api/v1"
    MONGO_URI: str = "mongodb://localhost:27017/vendai"
    SECRET_KEY: str = "supersecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    PORT: int = 8000

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }


settings = Settings()

if not settings.MONGO_URI:
    print("CRITICAL: MONGO_URI not found!")
