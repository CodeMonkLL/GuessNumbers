from dataclasses import dataclass

@dataclass
class StartRoundResponseDto:
    userId: int
    sessionId: int
    message: str