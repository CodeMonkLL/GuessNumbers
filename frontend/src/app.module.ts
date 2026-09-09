import { Module } from "@nestjs/common";
import { HighscoreController } from "./highscore.controller";

@Module({
  controllers: [HighscoreController],
})
export class AppModule {}
