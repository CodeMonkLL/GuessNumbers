"""Game rules"""
import persistence.gameSessionRepository as gameSessionRepository
import persistence.attemptRepository as attemptRepository
import math
import logging
from backend.model.DTO.errors import SessionMismatchError,SessionNotFoundError
logger = logging.getLogger(__name__)
from backend.model.DTO.attemptRequestDto import attemptRequestDto
from backend.model.DTO.attemptResponseDto import attemptResponseDto

def createGameSession(userId):
    randomNumber = math.random
    newgamesession = gameSessionRepository.createSession(userId,randomNumber);
    logger.info(f"Creating new GameSession for User{userId}")
    return newgamesession


def returnActualSession(userId):
    runningSession = gameSessionRepository.findRunningSession(userId= userId)

    if runningSession is None:
        logger.error(f"No running Gamesession found for User{userId}. Creating ")
        errorMessage = "User has no running Sessions, creating new gameSession"
        runningSession = createGameSession()

    return runningSession
        
def playRound(attemptRequest:attemptRequestDto):
    userId = attemptRequest.userId

    actualSession = returnActualSession(userId)
    if(actualSession is None):
        logger.error(f"Error while getting actual Session for {userId}, does not exsist ")
        return SessionNotFoundError

    if(actualSession.id != attemptRequest.sessionId):
        logger.error(f"ActualSession for UserId{userId} is not the same as commited gameSessionId. ")
        return SessionMismatchError

    response = attemptResponseDto()
    response.userId = attemptRequest.userId

    attemptNumber = attemptRequest.attemptNumber
    winningNumber = actualSession.numberComputer
    comparision = CompareNumberToWinningNumber(attemptNumber,winningNumber)
    attemptRepository.saveAttempt(actualSession,attemptNumber)
    if(comparision == True):
            logger.info(f"UserId{userId} guessed the right Number, changing status session.iswinner")
            gameSessionRepository.markFinished(gameSession= actualSession,isWinner=True)
            response.isAttemptSuccessful = True
    else:
            logger.info(f"UserId{userId} did not guess the right Number")
            response.isAttemptSuccessful = False
    response.responseMessage = ReturnAnswerMessage(attemptNumber,winningNumber)
    return response
         

    

def ReturnAnswerMessage(number:int, winningNumber:int):
    returnMessage = ""
    if(number > winningNumber):
        returnMessage = "Number is to high"
    if(number <  winningNumber):
        returnMessage = "Number is to low"
    if(number == winningNumber):
        returnMessage = "Number is correct!"

    return returnMessage

def CompareNumberToWinningNumber(number: int, winningNumber: int):
    if(number == winningNumber):
        return True
    else:
        return False
