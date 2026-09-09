import { Controller, Get, HttpException } from "@nestjs/common";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://backend:5000";

@Controller("api")
export class HighscoreController {
  @Get("highscores")
  async getHighscores() {
    const response = await fetch(`${BACKEND_URL}/`);

    if (!response.ok) {
      throw new HttpException("Backend nicht erreichbar", response.status);
    }

    return response.json();
  }
}
