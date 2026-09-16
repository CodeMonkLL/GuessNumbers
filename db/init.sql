-- Testdaten.


-- Schema

CREATE TABLE user (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    username     VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    recoveryCode VARCHAR(255) NOT NULL
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

-- password = 'changeme123', recoveryCode = '12345678'
INSERT INTO user (id, username, password, recoveryCode) VALUES
    (1, 'David', 'scrypt:32768:8:1$7xGUqUznCEuHz8Me$ed34e525d34eb6c68e23ef122c5f9948c2835aef23e598666c1032de182c2281e65dc5f9907dec1c376a36ff950b1bbd776075a6c20466c32bdfe3ab3b64d7c7', 'scrypt:32768:8:1$U4ysmuZzpp345jR3$0284e19e699f704efcb36cfcdf3ef8dbe462b2dedb1eed83c1161e7847825b04594e82a95bdc8b088ba419834a4fc0a2afccca5423e68452f8b12d998008e92b'),
    (2, 'Lukas', 'scrypt:32768:8:1$7xGUqUznCEuHz8Me$ed34e525d34eb6c68e23ef122c5f9948c2835aef23e598666c1032de182c2281e65dc5f9907dec1c376a36ff950b1bbd776075a6c20466c32bdfe3ab3b64d7c7', 'scrypt:32768:8:1$U4ysmuZzpp345jR3$0284e19e699f704efcb36cfcdf3ef8dbe462b2dedb1eed83c1161e7847825b04594e82a95bdc8b088ba419834a4fc0a2afccca5423e68452f8b12d998008e92b'),
    (3, 'Leander', 'scrypt:32768:8:1$7xGUqUznCEuHz8Me$ed34e525d34eb6c68e23ef122c5f9948c2835aef23e598666c1032de182c2281e65dc5f9907dec1c376a36ff950b1bbd776075a6c20466c32bdfe3ab3b64d7c7', 'scrypt:32768:8:1$U4ysmuZzpp345jR3$0284e19e699f704efcb36cfcdf3ef8dbe462b2dedb1eed83c1161e7847825b04594e82a95bdc8b088ba419834a4fc0a2afccca5423e68452f8b12d998008e92b'),
    (4, 'Eliza', 'scrypt:32768:8:1$7xGUqUznCEuHz8Me$ed34e525d34eb6c68e23ef122c5f9948c2835aef23e598666c1032de182c2281e65dc5f9907dec1c376a36ff950b1bbd776075a6c20466c32bdfe3ab3b64d7c7', 'scrypt:32768:8:1$U4ysmuZzpp345jR3$0284e19e699f704efcb36cfcdf3ef8dbe462b2dedb1eed83c1161e7847825b04594e82a95bdc8b088ba419834a4fc0a2afccca5423e68452f8b12d998008e92b');

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
