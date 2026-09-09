export type User = {
  id: number;
  username: string;
};

export type StartRoundResponse = {
  userId: number;
  sessionId: number;
  message: string;
};

export type PlayRoundResponse = {
  userId: number;
  sessionId: number;
  attemptNumber: number;
  isAttemptSuccessful: boolean;
  responseMessage: string;
  winningNumber: number | null;
};

export type HighScoreEntry = {
  place: number;
  attempts: number;
  userName: string;
};

export type ApiError = {
  error: string;
};
