"""One guess inside a game session"""

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from persistence.database import db


class Attempt(db.Model):
    __tablename__ = "attempt"

    id: Mapped[int] = mapped_column(primary_key=True)

    roundNumber: Mapped[int]

    enteredNumber: Mapped[int]

    gameSessionId: Mapped[int] = mapped_column(
        ForeignKey("gamesession.id", ondelete="CASCADE")
    )
