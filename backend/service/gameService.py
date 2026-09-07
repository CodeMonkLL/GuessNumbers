"""Game Service with Functions for playing the Game"""
import persistence.gameSessionRepository as gameSessionRepository
import persistence.attemptRepository as attemptRepository
import random
import logging
from model.DTO.errors import SessionMismatchError,SessionNotFoundError,SessionAlreadyFinishedError
from model.DTO.startRoundRequestDto import StartRoundRequestDto
from model.DTO.startRoundResponseDto import StartRoundResponseDto
from model.DTO.playRoundRequestDto import PlayRoundRequestDto
from model.DTO.playRoundResponseDto import PlayRoundResponseDto
from persistence.database import db
logger = logging.getLogger(__name__)

def playRound(playRoundRequest:PlayRoundRequestDto):
    """Function for playing one round"""
    userId = playRoundRequest.userId

    actualSession = gameSessionRepository.loadSession(playRoundRequest.sessionId)
    if actualSession is None:
        logger.error(f"Session {playRoundRequest.sessionId} was not found")
        raise SessionNotFoundError(f"Session {playRoundRequest.sessionId} not found")

    if actualSession.userId != userId:
        logger.error(f"Session mismatch for UserId {userId}")
        raise SessionMismatchError("Session ID does not match the active session")

    if actualSession.isWinner:
        logger.error("Session already finished")
        raise SessionAlreadyFinishedError("Game session has already been completed")

    attemptNumber = playRoundRequest.attemptNumber
    winningNumber = actualSession.numberComputer

    response = PlayRoundResponseDto(
        userId=playRoundRequest.userId,
        sessionId=actualSession.id,
        attemptNumber=attemptNumber,
        isAttemptSuccessful=False,
        responseMessage=ReturnAnswerMessage(attemptNumber, winningNumber),
    )

    attemptRepository.saveAttempt(actualSession,attemptNumber)

    comparision = CompareNumberToWinningNumber(attemptNumber,winningNumber)
    if(comparision == True):
            logger.info(f"UserId{userId} guessed the right Number, changing status session.iswinner")
            gameSessionRepository.markFinished(gameSession= actualSession,isWinner=True)
            db.session.commit()
            response.isAttemptSuccessful = True
            response.winningNumber = winningNumber
    else:
            logger.info(f"UserId{userId} did not guess the right Number")
            response.isAttemptSuccessful = False

    return response
         

def startRoundService(requestDto: StartRoundRequestDto) -> StartRoundResponseDto:
    # returnActualSession liefert die aktive Session oder erstellt eine neue
    session = returnActualSession(requestDto.userId)
    db.session.commit()
    
    response = StartRoundResponseDto(
        userId=requestDto.userId,
        sessionId=session.id,
        message="Session active and ready"
    )
    return response


def returnActualSession(userId:int):
    runningSession = gameSessionRepository.findRunningSession(userId= userId)

    if runningSession is None:
        logger.warning(f"No running Gamesession found for User{userId}. Creating new Session")
        runningSession = createGameSession(userId)

    return runningSession    

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

def createGameSession(userId):
    randomNumber = random.randint(1, 100)
    newgamesession = gameSessionRepository.createSession(userId,randomNumber);
    logger.info(f"Creating new GameSession for User{userId}")
    return newgamesession