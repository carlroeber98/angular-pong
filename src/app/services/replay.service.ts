import { Injectable } from "@angular/core";
import { GameCalculationService } from "./game-calculation.service";
import { GameFieldState } from "../model/game-field-state";
import { Array } from "core-js";
import { Bat } from "../model/bat";
import { Subject } from "rxjs";
import { Ball } from "../model/ball";

@Injectable({
  providedIn: "root"
})
export class ReplayService {
  private _replayMode: boolean;
  private _gameStates: GameFieldState[];
  private _batStates: GameFieldState[];
  private _movement: {
    gameSpeed: number;
    batSpeed: number;
    direction: {
      x: number;
      y: number;
    };
  };

  constructor() {
    this.replayMode = false;
  }

  public setGameTicker(gameTicker: Subject<GameFieldState>): void {
    gameTicker.subscribe(gameFieldState => {
      if (gameFieldState == null || this._replayMode) {
        return;
      }
      if (gameFieldState.ball != null) {
        this._gameStates.push(
          new GameFieldState(
            null,
            null,
            new Ball(
              gameFieldState.ball.rotation,
              gameFieldState.ball.rotationDuration + 5,

              {
                x: gameFieldState.ball.position.x,
                y: gameFieldState.ball.position.y
              },
              gameFieldState.ball.diameter
            )
          )
        );
      }
      if (gameFieldState.leftBat != null && gameFieldState.rightBat != null) {
        this._batStates.push(
          new GameFieldState(
            new Bat(
              gameFieldState.leftBat.hitEvent,
              gameFieldState.leftBat.heightEvent,
              {
                x: gameFieldState.leftBat.position.x,
                y: gameFieldState.leftBat.position.y
              },
              {
                height: gameFieldState.leftBat.size.height,
                width: gameFieldState.leftBat.size.width
              }
            ),
            new Bat(
              gameFieldState.rightBat.hitEvent,
              gameFieldState.rightBat.heightEvent,
              {
                x: gameFieldState.rightBat.position.x,
                y: gameFieldState.rightBat.position.y
              },
              {
                height: gameFieldState.rightBat.size.height,
                width: gameFieldState.rightBat.size.width
              }
            )
          )
        );
      }
    });
  }

  public getNextGameState(): GameFieldState {
    return this._gameStates.shift();
  }

  public getNextBatState(): GameFieldState {
    return this._batStates.shift();
  }

  public set replayMode(replayMode: boolean) {
    this._replayMode = replayMode;
    if (!this._replayMode) {
      this._batStates = [];
      this._gameStates = [];
    }
  }

  public get replayMode() {
    return this._replayMode;
  }

  public set movement(movement: any) {
    this._movement = movement;
  }

  public get movement() {
    return this._movement;
  }
}
