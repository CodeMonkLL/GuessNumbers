"""Routes for the Highscore API"""

from flask import Blueprint, jsonify
from service import highScoreService

highscoreBp = Blueprint("highscore", __name__)

@highscoreBp.get("/")
def get_highscores():
    """Gibt die Top 1-10 Highscores als JSON zurück."""
    
    score = highScoreService.getHighScore() 


    if score is None:
        return jsonify({"error": "Highscore not found"}), 404
    
    return jsonify(score), 200