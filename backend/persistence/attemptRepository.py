"""Database access for attempts."""

from sqlalchemy import func, select

from model.attempt import Attempt
from persistence.database import db

def loadAttempts(gameSessionId):
    """All guesses of a session, oldest first."""
    return db.session.scalars(
        select(Attempt)
        .where(Attempt.gameSessionId == gameSessionId)
        .order_by(Attempt.roundNumber)
    ).all()

def countAttempts(gameSessionId):
    """Number of guesses made so far."""
    return db.session.scalar(
        select(func.count())
        .select_from(Attempt)
        .where(Attempt.gameSessionId == gameSessionId)
    )

def saveAttempt(gameSession, enteredNumber):
    """Records one guess, saves it directly to the database and returns it."""
    gameSession.attemptCount += 1

    attempt = Attempt(
        gameSessionId=gameSession.id,
        roundNumber=gameSession.attemptCount,
        enteredNumber=enteredNumber,
    )
    db.session.add(attempt)
    db.session.commit()
    return attempt


def getAttemptsByGameSessionId(gameSessionId):
    return db.session.scalars(
        select(Attempt)
        .where(Attempt.gameSessionId == gameSessionId)
    ).all()