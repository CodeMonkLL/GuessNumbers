"""Routes for the Highscore API"""

from flask import Blueprint, jsonify
from service import highScoreService

highscoreBp = Blueprint("highscore", __name__)

@highscoreBp.get("/")
def get_highscores():
    """
    Gibt die Top 1-10 Highscores zurück
    ---
    tags:
      - Highscore
    responses:
      200:
        description: Liste der Top 1-10 Highscores
        schema:
          type: array
          items:
            type: object
            properties:
              place:
                type: integer
                description: Platzierung in der Rangliste
                example: 1
              attempts:
                type: integer
                description: Anzahl der benötigten Versuche
                example: 3
              userName:
                type: string
                description: Name des Benutzers
                example: max_mustermann
      404:
        description: Es sind keine Highscores vorhanden
        schema:
          type: object
          properties:
            error:
              type: string
              example: Highscore not found
    """
    
    score = highScoreService.getHighScore() 


    if score is None:
        return jsonify({"error": "Highscore not found"}), 404
    
    return jsonify(score), 200