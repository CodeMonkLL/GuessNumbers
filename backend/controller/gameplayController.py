"""Routes for the HTML pages"""
import service.gameService as gameService
from flask import Blueprint, jsonify, request
from backend.model.DTO.startRoundRequestDto import StartRoundRequestDto
from backend.model.DTO.playRoundRequestDto import PlayRoundRequestDto
from backend.model.DTO.errors import (
    SessionNotFoundError,
    SessionMismatchError,
    SessionAlreadyFinishedError
)
gameBp = Blueprint("gameplay", __name__)

@gameBp.post("/startRound")
def startRound():
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