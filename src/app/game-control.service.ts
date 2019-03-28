import { Injectable } from "@angular/core";
import { Observable, Subject, TimeInterval } from "rxjs";
import { GameCalculationService } from "./game-calculation.service";
import { GameState } from "./game-state.enum";

@Injectable({
  providedIn: "root"
})
export class GameControlService {
  private gameHandler: Subject<GameState>;
  private interval: any;

  private framesPerSecond = 50;

  constructor() {
    this.gameHandler = new Subject<GameState>();
  }

  public startGame(): void {
    this.interval = setInterval(() => {
      this.gameHandler.next(GameState.RUNNING);
    }, 1000 / this.framesPerSecond);
  }

  public stopGame(): void {
    clearInterval(this.interval);
    this.gameHandler.next(GameState.STOPPED);
  }

  public setInitialGameField(): void {
    this.gameHandler.next(GameState.INITIAL);
  }

  public get getGameHandler(): Observable<GameState> {
    return this.gameHandler;
  }
}
