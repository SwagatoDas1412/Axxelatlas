import os
from dotenv import load_dotenv
from urllib.parse import quote_plus
load_dotenv()


class Settings:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    ENCODED_PASS = quote_plus(DB_PASSWORD)
    DB_NAME = os.getenv("DB_NAME", "axxelatlas")

    DATABASE_URL = (
        f"mysql+pymysql://{DB_USER}:{ENCODED_PASS}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

    SECRET_KEY = os.getenv("SECRET_KEY", "change_me")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
    )


settings = Settings()