"""SQLAlchemy instance.

Flask-SQLAlchemy handles one session per request and closes it after the
response.
"""

from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()
