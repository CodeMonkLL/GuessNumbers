from dataclasses import dataclass

@dataclass
class StartRoundResponseDto:
    userId: str
    sessionId: int
    message: str