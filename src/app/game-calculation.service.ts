import { Injectable, Input } from "@angular/core";
import { GameControlService } from "./game-control.service";
import { Subject, Observable } from "rxjs";
import { GameState } from "./game-state.enum";

@Injectable({
  providedIn: "root"
})
export class GameCalculationService {
  private gameTicker: Subject<{ gameState: GameState; direction?: any }>;
  private interval: any;

  private movement: {
    speed: number;
    direction: {
      x: number;
      y: number;
    };
  };

  constructor(private gameControlService: GameControlService) {
    this.gameTicker = new Subject<{ gameState: GameState; direction: any }>();
    this.gameControlService.getGameHandler.subscribe(gameState => {
      switch (gameState) {
        case GameState.INITIAL:
          this.movement = { speed: 0, direction: { x: 0, y: 0 } };
          this.calculateRandomMovement();
          this.setInitialField();
          break;
        case GameState.RUNNING:
          if (!this.interval) {
            this.setCalculationInterval();
          }
          break;
        case GameState.STOPPED:
          clearInterval(this.interval);
          this.interval = null;
          break;
      }
    });
  }

  private setCalculationInterval(): void {
    this.interval = setInterval(() => {
      this.gameTicker.next({
        gameState: GameState.RUNNING,
        direction: this.movement.direction
      });
    }, 1000 / this.movement.speed);
  }

  private setInitialField(): void {
    this.gameTicker.next({ gameState: GameState.INITIAL });
  }

  public get getGameTicker(): Observable<{
    gameState: GameState;
    direction?: any;
  }> {
    return this.gameTicker;
  }

  private calculateRandomMovement() {
    let randomNumber = Math.round((Math.random() * 4 - 2) * 100000) / 100000;
    while (this.movement.direction.x === 0 || this.movement.direction.y === 0) {
      this.movement.direction.y =
        (Math.floor(Math.random() * 8) - 4) * randomNumber;
      while (
        (randomNumber < 0 && randomNumber > -1) ||
        (randomNumber > 0 && randomNumber < 1)
      ) {
        randomNumber = Math.round((Math.random() * 4 - 2) * 100000) / 100000;
      }
      this.movement.direction.x = this.movement.direction.y * randomNumber;
    }
    this.movement.speed = Math.floor(Math.random() * 35) + 25;
  }

  public setStopAndInitState(): void {
    this.gameControlService.stopGame();
    this.gameControlService.setInitialGameField();
  }
}
