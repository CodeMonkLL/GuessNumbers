from dataclasses import asdict, dataclass

@dataclass
class PlayRoundRequestDto():
    userId:str
    sessionId: int
    attemptNumber: int