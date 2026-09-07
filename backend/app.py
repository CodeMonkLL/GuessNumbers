from pathlib import Path

from flask import Flask
from flasgger import Swagger

import config
from controller.highScoreController import highscoreBp
from controller.gameplayController import gameBp
from controller.userController import userBp
from persistence.database import db

FRONTEND = Path(__file__).resolve().parent.parent / "frontend"

def createApp():
    app = Flask(
        __name__,
        template_folder=str(FRONTEND / "templates"),
        static_folder=str(FRONTEND / "static"),
    )
    app.secret_key = config.SECRET_KEY
    app.config["SQLALCHEMY_DATABASE_URI"] = config.DATABASE_URI

    Swagger(app)
    db.init_app(app)
    app.register_blueprint(gameBp)
    app.register_blueprint(highscoreBp)
    app.register_blueprint(userBp)
    return app


if __name__ == "__main__":
    createApp().run(host="0.0.0.0", port=5000)
