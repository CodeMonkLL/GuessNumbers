from dataclasses import dataclass
from typing import Optional

@dataclass
class PlayRoundResponseDto():
    userId:str
    sessionId: int
    attemptNumber: int
    isAttemptSuccessful: bool
    responseMessage: str
    winningNumber: Optional[int] = None