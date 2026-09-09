from dataclasses import dataclass

@dataclass
class SessionStatusResponseDto:
    sessionId: int
    sessionStatus: str