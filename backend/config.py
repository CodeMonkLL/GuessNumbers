import os

DB_HOST = os.environ.get("DB_HOST", "mysql_db")
DB_PORT = int(os.environ.get("DB_PORT", "3306"))
DB_NAME = os.environ.get("DB_NAME", "number_guessing")
DB_USER = os.environ.get("DB_USER", "number_guessing")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")

# Connection string for SQLAlchemy. "mysql+pymysql"
DATABASE_URI = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

SECRET_KEY = os.environ.get("SECRET_KEY", "localhost")

