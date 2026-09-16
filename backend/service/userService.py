import logging
import secrets
import string

from werkzeug.security import generate_password_hash, check_password_hash

import model.DTO.errors as errors
import persistence.userRepository as userRepository

logger = logging.getLogger(__name__)

def createUser(username: str, password: str):
    """Legt einen neuen User an.
    Gibt (User, recoveryCode) zurück, oder errors.UserAlreadyExsistError,
    falls der Username schon existiert.
    """
    existingUser = userRepository.findByUsername(username)
    if existingUser is not None:
        logger.info(f"User with Username {username} already exsists.")
        return errors.UserAlreadyExistError

    passwordHash = hashSecret(password)
    recoveryCode = generateRecoveryCode()
    recoveryCodeHash = hashSecret(recoveryCode)
    newUser = userRepository.createUser(username, passwordHash, recoveryCodeHash)
    return newUser, recoveryCode


def loginUser(username: str, password: str):
    user = userRepository.findByUsername(username)

    if user is None or not verifySecret(password, user.passwordHash):
        return errors.InvalidCredentialsError

    return user


def generateRecoveryCode() -> str:
    """Erzeugt einen 8-stelligen, zufälligen Recovery-Code."""
    return "".join(secrets.choice(string.digits) for _ in range(8))


def hashSecret(secret: str) -> str:
    """Hasht Passwort oder Recovery-Code sicher mit Salt."""
    return generate_password_hash(secret)


def verifySecret(secret: str, secretHash: str) -> bool:
    """Prüft ein Klartext (secret) gegen einen gespeicherten Hash."""
    return check_password_hash(secretHash, secret)


def resetPassword(username: str, recoveryCode: str, newPassword: str):
    """Setzt das Passwort zurück, wenn der Recovery-Code stimmt.
    Gibt bei Erfolg den neuen Recovery-Code (Klartext) zurück
    """
    user = userRepository.findByUsername(username)

    if user is None or not verifySecret(recoveryCode, user.recoveryCodeHash):
        return errors.InvalidRecoveryCodeError

    newPasswordHash = hashSecret(newPassword)
    newRecoveryCode = generateRecoveryCode()
    newRecoveryCodeHash = hashSecret(newRecoveryCode)
    userRepository.updatePasswordAndRecoveryCode(user, newPasswordHash, newRecoveryCodeHash)
    return newRecoveryCode
