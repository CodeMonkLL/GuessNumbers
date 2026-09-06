"""Routes for the HTML pages"""

from flask import Blueprint, redirect, render_template, url_for

gameBp = Blueprint("game", __name__)

@gameBp.get("/")
def index():
    """Startseite"""
    return render_template(
        "index.html",
        attempts=[],
        message=None,
    )

@gameBp.post("/start")
def start():
    return redirect(url_for("game.index"))

@gameBp.post("/guess")
def guess():
    return redirect(url_for("game.index"))
