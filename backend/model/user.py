"""Player"""

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from persistence.database import db


class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)

    username: Mapped[str] = mapped_column(String(255), unique=True)
