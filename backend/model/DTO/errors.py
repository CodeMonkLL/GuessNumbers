class SessionNotFoundError(Exception):
    pass

class SessionMismatchError(Exception):
    pass

class SessionAlreadyFinishedError(Exception):
    pass

class UserAlreadyExsistError(Exception):
    pass