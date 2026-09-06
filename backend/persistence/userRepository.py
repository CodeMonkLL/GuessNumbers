"""Database access for users."""

from sqlalchemy import select

from model.user import User
from persistence.database import db


def findByUsername(username):
    """Returns the user with that name, or None."""
    return db.session.scalar(select(User).where(User.username == username))

def createUser(username):
    """Creates a user and returns the object. Does not commit."""
    user = User(username=username)
    db.session.add(user)
    db.session.flush()
    return user

def findOrCreate(username):
    """Returns the existing user or creates one. Does not commit."""
    return findByUsername(username) or createUser(username)
