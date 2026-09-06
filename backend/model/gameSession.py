"""One round of the game"""

from sqlalchemy import CheckConstraint, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from persistence.database import db

class GameSession(db.Model):
    __tablename__ = "gamesession"

    __table_args__ = (
        CheckConstraint(
            "numberComputer BETWEEN 0 AND 100",
            name="ck_gamesession_number_range",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    numberComputer: Mapped[int]

    attemptCount: Mapped[int] = mapped_column(default=0, server_default="0")

    userId: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))

    #   None → Spiel läuft noch
    #   True → gewonnen
    #   False → verloren
    isWinner: Mapped[bool | None]
