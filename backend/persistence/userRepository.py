"""Database access for users."""
from sqlalchemy import select

from model.user import User
from persistence.database import db


def findByUsername(username):
    """Returns the user with that name, or None."""
    return db.session.scalar(select(User).where(User.username == username))

def createUser(username, passwordHash, recoveryCodeHash):
    """Creates a user and returns the object. Commits the transaction."""
    user = User(username=username, passwordHash=passwordHash, recoveryCodeHash=recoveryCodeHash)
    db.session.add(user)
    db.session.commit()
    return user

def updatePasswordAndRecoveryCode(user, passwordHash, recoveryCodeHash):
    """Overwrites password and recovery code hashes on an existing user."""
    user.passwordHash = passwordHash
    user.recoveryCodeHash = recoveryCodeHash
    db.session.commit()
    return user


def findById(userId):
    """Returns the user via Id or None."""
    return db.session.scalar(select(User).where(User.id == userId))