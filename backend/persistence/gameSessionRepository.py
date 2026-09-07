"""Database access for game sessions."""

from sqlalchemy import select

from model.gameSession import GameSession
from persistence.database import db


def loadSession(sessionId):
    """Returns one session, or None if the id does not exist."""
    return db.session.get(GameSession, sessionId)

def createSession(userId, numberComputer):
    """Creates a new session and returns the object. Does not commit."""
    gameSession = GameSession(userId=userId, numberComputer=numberComputer)
    db.session.add(gameSession)
    db.session.flush()
    return gameSession

def findRunningSession(userId):
    """The open session of that user, or None."""
    return db.session.scalar(
        select(GameSession)
        .where(GameSession.userId == userId, GameSession.isWinner.is_(False))
        .order_by(GameSession.id.desc())
    )

def loadSessionsOfUser(userId):
    """All sessions of one user, newest first."""
    return db.session.scalars(
        select(GameSession)
        .where(GameSession.userId == userId)
        .order_by(GameSession.id.desc())
    ).all()

def markFinished(gameSession, isWinner):
    """Ends a session. Does not commit."""
    gameSession.isWinner = isWinner


def getSessionByLessTrys() -> list[GameSession]:
    return db.session.scalars(
        select(GameSession)
        .order_by(GameSession.attemptCount.asc())
        .limit(10)
    ).all()