from dataclasses import asdict, dataclass

@dataclass
class highScoreResponse:
    place: int
    attempts: int
    userName: str