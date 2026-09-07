from dataclasses import asdict, dataclass

@dataclass
class PlayRoundRequestDto():
    userId:int
    sessionId: int
    attemptNumber: int