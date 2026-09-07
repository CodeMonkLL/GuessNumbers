from flask import Blueprint, request, jsonify
import model.DTO.errors as errors
import service.userService as userService
import model.user as user
userBp = Blueprint("user", __name__)


@userBp.route("/user", methods=["POST"])
def register_user():
    """
    Registriert einen neuen Benutzer
    ---
    tags:
      - User
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        description: Der zu registrierende Benutzername
        schema:
          type: object
          required:
            - username
          properties:
            username:
              type: string
              description: Der eindeutige Name des neuen Benutzers
              example: max_mustermann
    responses:
      201:
        description: Benutzer wurde erfolgreich erstellt
        schema:
          type: object
          properties:
            message:
              type: string
              example: User created successfully
      400:
        description: Ein Benutzer mit diesem Namen existiert bereits
        schema:
          type: object
          properties:
            error:
              type: string
              example: User already exists
      500:
        description: Interner Serverfehler bei der Erstellung des Benutzers
        schema:
          type: object
          properties:
            error:
              type: string
              example: Internal server error
    """
    username = request.json.get("username")
    
    result = userService.createUser(username)
    
    if result == errors.UserAlreadyExsistError:
        return jsonify({"error": "User already exists"}), 400

    if isinstance(result, user.User):
        return jsonify({"message": "User created successfully"}), 201

    return jsonify({"error": "Internal server error"}), 500