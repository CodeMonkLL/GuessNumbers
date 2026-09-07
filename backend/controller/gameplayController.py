"""Routes for the HTML pages"""
import service.gameService as gameService
from flask import Blueprint, jsonify, request
from model.DTO.startRoundRequestDto import StartRoundRequestDto
from model.DTO.playRoundRequestDto import PlayRoundRequestDto
from model.DTO.errors import (
    SessionNotFoundError,
    SessionMismatchError,
    SessionAlreadyFinishedError
)
gameBp = Blueprint("gameplay", __name__)

@gameBp.post("/startRound")
def startRound():
    """
    Startet eine neue Spielrunde für einen Benutzer
    ---
    tags:
      - Gameplay
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        description: Die ID des Benutzers, für den die Runde gestartet werden soll
        schema:
          type: object
          required:
            - userId
          properties:
            userId:
              type: string
              description: Die eindeutige ID des Benutzers
              example: "1"
    responses:
      200:
        description: Runde wurde erfolgreich gestartet
        schema:
          type: object
          properties:
            userId:
              type: string
              example: "1"
            sessionId:
              type: integer
              description: Die ID der neu erstellten Spiel-Session
              example: 42
            message:
              type: string
              example: Round started successfully
      400:
        description: Die Session passt nicht zum Benutzer oder ist bereits beendet
        schema:
          type: object
          properties:
            error:
              type: string
              example: userId is required
      404:
        description: Es wurde keine passende Session gefunden
        schema:
          type: object
          properties:
            error:
              type: string
              example: Session not found
      500:
        description: Interner Serverfehler
        schema:
          type: object
          properties:
            error:
              type: string
              example: Internal server error
    """
    data = request.get_json() or {}
    user_id = data.get("userId")

    if not user_id:
        return jsonify({"error": "userId is required"}), 400

    request_dto = StartRoundRequestDto(userId=user_id)

    try:
        response_dto = gameService.startRoundService(request_dto)
        
        return jsonify(response_dto.__dict__), 200

    except (SessionMismatchError, SessionAlreadyFinishedError) as e:
        return jsonify({"error": str(e)}), 400
    except SessionNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


@gameBp.post("/playRound")
def playRound():
    """
    Führt einen Rateversuch in einer laufenden Spielrunde aus
    ---
    tags:
      - Gameplay
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        description: Die Daten des Rateversuchs
        schema:
          type: object
          required:
            - userId
            - sessionId
            - atemptNumber
          properties:
            userId:
              type: string
              description: Die eindeutige ID des Benutzers
              example: "1"
            sessionId:
              type: integer
              description: Die ID der laufenden Spiel-Session
              example: 42
            atemptNumber:
              type: integer
              description: Die geratene Zahl für diesen Versuch
              example: 50
    responses:
      200:
        description: Versuch wurde erfolgreich ausgewertet
        schema:
          type: object
          properties:
            userId:
              type: string
              example: "1"
            sessionId:
              type: integer
              example: 42
            attemptNumber:
              type: integer
              example: 50
            isAttemptSuccessful:
              type: boolean
              description: Ob der Versuch die richtige Zahl getroffen hat
              example: false
            responseMessage:
              type: string
              description: Hinweis, ob höher oder niedriger geraten werden muss
              example: Higher
            winningNumber:
              type: integer
              description: Die gesuchte Zahl, nur gesetzt wenn die Runde beendet ist
              example: null
      400:
        description: Die Session passt nicht zum Benutzer oder ist bereits beendet
        schema:
          type: object
          properties:
            error:
              type: string
              example: Session already finished
      404:
        description: Es wurde keine passende Session gefunden
        schema:
          type: object
          properties:
            error:
              type: string
              example: Session not found
      500:
        description: Interner Serverfehler
        schema:
          type: object
          properties:
            error:
              type: string
              example: Internal server error
    """
    data = request.get_json() or {}
    user_id = data.get("userId")
    sessionId = data.get("sessionId")
    attemptNumber = data.get("atemptNumber")

    request_dto = PlayRoundRequestDto(userId=user_id, sessionId= sessionId,attemptNumber= attemptNumber)
    try:
        response_dto = gameService.playRound(request_dto)

        return jsonify(response_dto.__dict__), 200
    except (SessionMismatchError, SessionAlreadyFinishedError) as e:
        return jsonify({"error": str(e)}), 400
    except SessionNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500