import persistence.gameSessionRepository as gameSessionRepository
import persistence.userRepository as userRepository
import backend.model.DTO.highScoreResponse as highScoreResponse

def getHighScore():
    gameSessions = gameSessionRepository.getSessionByLessTrys()
    highScoreResponses = []

    for index, gameSession in enumerate(gameSessions, start=1):
        user = userRepository.findById(gameSession.userId)
        
        username = user.username if user else "Unknown"
        trys = gameSession.attemptCount

        highScoreResponses.append({
            "place": index,
            "attempts": trys,
            "userName": username
        })

    return highScoreResponses