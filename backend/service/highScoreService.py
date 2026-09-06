import persistence.gameSessionRepository as gameSessionRepository
import persistence.userRepository as userRepository
import model.highScoreResponse as highScoreResponse

def getHighScore():
    gameSessions = gameSessionRepository.getSessionByLessTrys()
    highScoreResponses = []

    for index,gameSession in enumerate(gameSessions, start=1):
        user = userRepository.findById(gameSession.userId)
        username = user.username
        trys = gameSession.attemptCount
        newHighScore = highScoreResponse(
            place=index,
            attempts=trys,
            userName=username
        )
        highScoreResponses.append(newHighScore)

    return highScoreResponses