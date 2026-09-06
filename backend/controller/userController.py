from flask import Blueprint, request, jsonify
import model.DTO.errors as errors
import service.userService as userService
import model.user as user
userBp = Blueprint("user", __name__)


@userBp.route("/user", methods=["POST"])
def register_user():
    username = request.json.get("username")
    
    result = userService.createUser(username)
    
    if result == errors.UserAlreadyExsistError:
        return jsonify({"error": "User already exists"}), 400

    if isinstance(result, user.User):
        return jsonify({"message": "User created successfully"}), 201
        
    return jsonify({"error": "Internal server error"}), 500