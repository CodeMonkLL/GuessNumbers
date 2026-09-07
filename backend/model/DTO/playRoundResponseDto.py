from dataclasses import dataclass
from typing import Optional

@dataclass
class PlayRoundResponseDto():
    userId:int
    sessionId: int
    attemptNumber: int
    isAttemptSuccessful: bool
    responseMessage: str
    winningNumber: Optional[int] = None