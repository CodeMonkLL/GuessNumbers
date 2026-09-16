class SessionNotFoundError(Exception):
    pass

class SessionMismatchError(Exception):
    pass

class SessionAlreadyFinishedError(Exception):
    pass

class UserAlreadyExistError(Exception):
    pass

class InvalidRecoveryCodeError(Exception):
    pass

class InvalidCredentialsError(Exception):
    pass