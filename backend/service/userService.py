import persistence.userRepository as userRepository
import logging
import model.DTO.errors as errors
logger = logging.getLogger(__name__)

def createUser(username:str):
    exsistingUser = userRepository.findByUsername(username)
    if(exsistingUser is not None):
        logger.info("User with Username {username} already exsists.")
        return errors.UserAlreadyExsistError
    if(exsistingUser is None):
        newUser = userRepository.createUser(username)
        return newUser