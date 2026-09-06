import persistence.userRepository as userRepository


def findUserName(userName: String) -> String | none:
    return userRepository.findByUsername()