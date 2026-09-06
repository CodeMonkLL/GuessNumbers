-- Testdaten.


-- Schema

CREATE TABLE user (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE gamesession (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    numberComputer INT NOT NULL,
    attemptCount   INT NOT NULL DEFAULT 0,
    userId         INT NOT NULL,
    isWinner       BOOLEAN NULL,
    CONSTRAINT fk_gamesession_user
        FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE,
    CONSTRAINT ck_gamesession_number_range
        CHECK (numberComputer BETWEEN 0 AND 100)
);

CREATE TABLE attempt (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    roundNumber   INT NOT NULL,
    enteredNumber INT NOT NULL,
    gameSessionId INT NOT NULL,
    CONSTRAINT fk_attempt_gamesession
        FOREIGN KEY (gameSessionId) REFERENCES gamesession (id) ON DELETE CASCADE
);

INSERT INTO user (id, username) VALUES
    (1, 'David'),
    (2, 'Lukas'),
    (3, 'Leander'),
    (4, 'Eliza');

INSERT INTO gamesession (id, numberComputer, attemptCount, userId, isWinner) VALUES
    (1,  42, 4, 1, TRUE),
    (2, 100, 7, 2, FALSE),
    (3,   0, 7, 3, FALSE),
    (4,  63, 2, 3, NULL);

INSERT INTO attempt (roundNumber, enteredNumber, gameSessionId) VALUES
    (1, 10, 1), (2, 70, 1), (3, 55, 1), (4, 42, 1),
    (1, 50, 2), (2, 75, 2), (3, 88, 2), (4, 94, 2), (5, 97, 2), (6, 99, 2), (7, 98, 2),
    (1, 50, 3), (2, 25, 3), (3, 12, 3), (4,  6, 3), (5,  3, 3), (6,  1, 3), (7,  2, 3),
    (1, 50, 4), (2, 80, 4);
