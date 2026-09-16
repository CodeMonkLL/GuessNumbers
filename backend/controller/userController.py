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
            password:
              type: string
              description: Das Passwort des Benutzers
    responses:
      201:
        description: Benutzer wurde erfolgreich erstellt und wird zurueckgegeben
        schema:
          type: object
          required:
            - id
            - username
            - recoveryCode
          properties:
            id:
              type: integer
              description: Eindeutige ID des angelegten Benutzers
              example: 1
            username:
              type: string
              description: Benutzername des angelegten Benutzers
              example: max_mustermann
            recoveryCode:
              type: string
              description: Recovery-Code im Klartext bei der Registrierung, für den Passwortreset
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
    password = request.json.get("password")

    result = userService.createUser(username, password)

    if result == errors.UserAlreadyExistError:
        return jsonify({"error": "User already exists"}), 400

    if isinstance(result, tuple):
        newUser, recoveryCode = result
        return jsonify({
            "id": newUser.id,
            "username": newUser.username,
            "recoveryCode": recoveryCode
        }), 201

    return jsonify({"error": "Internal server error"}), 500


@userBp.route("/login", methods=["POST"])
def login_user():
    """
    Meldet einen Benutzer an
    ---
    tags:
      - User
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        description: Username und Passwort
        schema:
          type: object
          required:
            - username
            - password
          properties:
            username:
              type: string
              example: max_mustermann
            password:
              type: string
              example: geheim123
    responses:
      200:
        description: Login erfolgreich
        schema:
          type: object
          properties:
            id:
              type: integer
              example: 1
            username:
              type: string
              example: max_mustermann
      401:
        description: Username oder Passwort falsch
        schema:
          type: object
          properties:
            error:
              type: string
              example: Invalid username or password
      500:
        description: Interner Serverfehler beim Login
        schema:
          type: object
          properties:
            error:
              type: string
              example: Internal server error
    """
    username = request.json.get("username")
    password = request.json.get("password")

    result = userService.loginUser(username, password)

    if result == errors.InvalidCredentialsError:
        return jsonify({"error": "Invalid username or password"}), 401

    if isinstance(result, user.User):
        return jsonify({
            "id": result.id,
            "username": result.username
        }), 200

    return jsonify({"error": "Internal server error"}), 500


@userBp.route("/reset-password", methods=["POST"])
def reset_password():
    """
    Setzt das Passwort über den Recovery-Code zurück
    ---
    tags:
      - User
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        description: Username, aktueller Recovery-Code und neues Passwort
        schema:
          type: object
          required:
            - username
            - recoveryCode
            - newPassword
          properties:
            username:
              type: string
              example: max_mustermann
            recoveryCode:
              type: string
              example: "12345678"
            newPassword:
              type: string
              example: neuesGeheim456
    responses:
      200:
        description: Passwort wurde zurückgesetzt, neuer Recovery-Code wird zurückgegeben
        schema:
          type: object
          properties:
            recoveryCode:
              type: string
              example: "87654321"
      400:
        description: Username oder Recovery-Code ungültig
        schema:
          type: object
          properties:
            error:
              type: string
              example: Invalid username or recovery code
      500:
        description: Interner Serverfehler beim Zurücksetzen des Passworts
        schema:
          type: object
          properties:
            error:
              type: string
              example: Internal server error
    """
    username = request.json.get("username")
    recoveryCode = request.json.get("recoveryCode")
    newPassword = request.json.get("newPassword")

    result = userService.resetPassword(username, recoveryCode, newPassword)

    if result == errors.InvalidRecoveryCodeError:
        return jsonify({"error": "Invalid username or recovery code"}), 400

    if isinstance(result, str):
        return jsonify({"recoveryCode": result}), 200

    return jsonify({"error": "Internal server error"}), 500