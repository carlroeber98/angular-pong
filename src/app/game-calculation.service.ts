import { Injectable, Input } from "@angular/core";
import { GameControlService } from "./game-control.service";
import { Subject, Observable } from "rxjs";
import { GameState } from "./game-state.enum";
import { KEY_CODE } from "./key-code.enum";
import { GameFieldState } from "./game-field-state";

@Injectable({
  providedIn: "root"
})
export class GameCalculationService {
  private gameTicker: Subject<GameFieldState>;

  private gameInterval: any;
  private batInterval: any;

  private movement: {
    gameSpeed: number;
    batSpeed: number;
    direction: {
      x: number;
      y: number;
    };
  };

  // Gamefield values
  private gameFieldSize: { height: number; width: number };

  // Left bat values
  private leftBatHit: boolean;
  private leftBatPosition: { x: number; y: number };
  private leftBatSize: { height: number; width: number };
  private leftBatKey: KEY_CODE;

  // Right bat values
  private rightBatHit: boolean;
  private rightBatPosition: { x: number; y: number };
  private rightBatSize: { height: number; width: number };
  private rightBatKey: KEY_CODE;

  // Ball values
  private ballRotation: string;
  private ballRotationDuration: number;
  private ballPosition: { x: number; y: number };
  private ballDiameter: number;

  private leftGoalEvent: boolean;
  private rightGoalEvent: boolean;

  constructor(private gameControlService: GameControlService) {
    this.gameTicker = new Subject<GameFieldState>();
    this.gameControlService.getGameHandler.subscribe(gameState => {
      switch (gameState) {
        case GameState.INITIAL:
          this.movement = {
            gameSpeed: 0,
            batSpeed: 220,
            direction: { x: 0, y: 0 }
          };
          this.leftGoalEvent = false;
          this.rightGoalEvent = false;
          this.leftBatHit = false;
          this.rightBatHit = false;
          this.ballRotationDuration = 0;
          this.ballRotation = "";
          this.calculateRandomMovement();
          this.calculateInitialGamefield();
          this.gameTicker.next(
            new GameFieldState(
              this.leftBatPosition,
              this.rightBatPosition,
              this.ballPosition,
              this.ballDiameter,
              this.gameFieldSize,
              this.leftBatSize,
              this.rightBatSize,
              this.leftBatHit,
              this.rightBatHit,
              this.ballRotation,
              this.ballRotationDuration
            )
          );
          break;
        case GameState.BATS_RUNNING:
          if (!this.batInterval) {
            this.setBatCalculationInterval();
          }
          break;
        case GameState.GAME_RUNNING:
          if (!this.batInterval) {
            this.setBatCalculationInterval();
          }
          if (!this.gameInterval) {
            this.setGameCalculationInterval();
          }
          break;
        case GameState.PAUSED:
          // NOT IMPLEMENTED YET
          break;
        case GameState.STOPPED:
          clearInterval(this.batInterval);
          clearInterval(this.gameInterval);
          this.batInterval = null;
          this.gameInterval = null;
          break;
      }
    });
  }

  private setGameCalculationInterval(): void {
    this.gameInterval = setInterval(() => {
      this.calculateGame();
      this.gameTicker.next(
        new GameFieldState(
          this.leftBatPosition,
          this.rightBatPosition,
          this.ballPosition,
          null,
          null,
          this.leftBatSize,
          this.rightBatSize,
          this.leftBatHit,
          this.rightBatHit,
          this.ballRotation,
          this.ballRotationDuration,
          this.leftGoalEvent,
          this.rightGoalEvent
        )
      );
    }, 1000 / this.movement.gameSpeed);
  }

  private setBatCalculationInterval(): void {
    this.batInterval = setInterval(() => {
      this.calculateBatPositions();
      this.gameTicker.next(
        new GameFieldState(this.leftBatPosition, this.rightBatPosition)
      );
    }, 1000 / this.movement.batSpeed);
  }

  public get getGameTicker(): Observable<GameFieldState> {
    return this.gameTicker;
  }

  // Calcualte the inital gamefield:
  //  GameField width/height in relation to the window width/height
  //  Bats and ball width/height/diameter in relation to the gameField width/height
  //  Bat and ball position (x, y) that they are centered and at their correct positions
  // ATTENTION(!): The border size 5px has to be added to the calcualted positions
  private calculateInitialGamefield(): void {
    this.gameFieldSize = {
      height: window.innerHeight * 0.8,
      width: window.innerWidth * 0.85
    };

    this.leftBatSize = { height: 150, width: 10 };
    this.leftBatPosition = {
      x: 20 + 5,
      y: this.gameFieldSize.height / 2 - this.leftBatSize.height / 2 + 5
    };

    this.rightBatSize = { height: 150, width: 10 };
    this.rightBatPosition = {
      x: this.gameFieldSize.width - 20 - this.rightBatSize.width + 5,
      y: this.gameFieldSize.height / 2 - this.rightBatSize.height / 2 + 5
    };

    this.ballDiameter = 25;
    this.ballPosition = {
      x: this.gameFieldSize.width / 2 - this.ballDiameter / 2 + 5,
      y: this.gameFieldSize.height / 2 - this.ballDiameter / 2 + 5
    };
  }

  private calculateBatPositions(): void {
    if (
      this.leftBatKey &&
      this.leftBatPosition.y + (this.leftBatKey === KEY_CODE.W_KEY ? -1 : 1) >=
        5 &&
      this.leftBatPosition.y + (this.leftBatKey === KEY_CODE.W_KEY ? -1 : 1) <=
        this.gameFieldSize.height - this.leftBatSize.height + 5
    ) {
      this.leftBatPosition.y += this.leftBatKey === KEY_CODE.W_KEY ? -1 : 1;
    } else if (this.leftBatKey) {
      this.leftBatKey = null;
    }
    if (
      this.rightBatKey &&
      this.rightBatPosition.y +
        (this.rightBatKey === KEY_CODE.UP_ARROW ? -1 : 1) >=
        5 &&
      this.rightBatPosition.y +
        (this.rightBatKey === KEY_CODE.UP_ARROW ? -1 : 1) <=
        this.gameFieldSize.height - this.rightBatSize.height + 5
    ) {
      this.rightBatPosition.y +=
        this.rightBatKey === KEY_CODE.UP_ARROW ? -1 : 1;
    } else {
      this.rightBatKey = null;
    }
  }

  // Calculate a random movement:
  //  GameSpeed should be between 35 (slow) and 70 (very fast)
  //  BatSpeed should be between 180 (slow) and 250 (fast)
  //  X should be between -4 and 4
  //  Y should be between -4 and 4, but at the start a higher value is better
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
    this.movement.gameSpeed = Math.floor(Math.random() * 60) + 50;
  }

  private calculateGame(): void {
    let x = this.movement.direction.x;
    let y = this.movement.direction.y;

    // Calculate new x, y value smaller than 1 so that the ball movement can adjusted before hitting something
    let loopEntries = 1;
    while (Math.abs(x) >= 1 || Math.abs(y) >= 1) {
      x = x / 2;
      y = y / 2;
      loopEntries = loopEntries * 2;
    }

    let topBottomEvent = false;
    let leftRightBatEvent = false;
    let plusTwirlEvent = false;
    let minusTwirlEvent = false;
    for (let l = 0; l < loopEntries; l++) {
      this.ballPosition.x += x;
      this.ballPosition.y += y;

      if (this.checkHitTopOrBottom()) {
        this.ballRotation = x > 0 ? "clockwise" : "counter-clockwise";
        this.ballRotationDuration = 0.7;
        this.calculateDuration(3000);
        y = y * -1;
        topBottomEvent = true;
      }

      if (this.ballPosition.x <= 5) {
        if (
          this.leftBatSize.height <= this.ballDiameter ||
          (this.ballPosition.y >
            (this.gameFieldSize.height - this.gameFieldSize.height * 0.336) /
              2 &&
            this.ballPosition.y + this.ballDiameter <
              this.gameFieldSize.height -
                (this.gameFieldSize.height -
                  this.gameFieldSize.height * 0.336) /
                  2)
        ) {
          this.leftGoalEvent = true;
          return;
        } else {
          x = x * -1;
          this.leftBatSize.height -= 20;
          this.leftBatPosition.y += 10;
          leftRightBatEvent = true;
        }
      }
      if (this.ballPosition.x >= this.gameFieldSize.width - this.ballDiameter) {
        if (
          this.rightBatSize.height <= this.ballDiameter ||
          (this.ballPosition.y >
            (this.gameFieldSize.height - this.gameFieldSize.height * 0.336) /
              2 &&
            this.ballPosition.y + this.ballDiameter <
              this.gameFieldSize.height -
                (this.gameFieldSize.height -
                  this.gameFieldSize.height * 0.336) /
                  2)
        ) {
          this.rightGoalEvent = true;
          return;
        } else {
          x = x * -1;
          this.rightBatSize.height -= 20;
          this.rightBatPosition.y += 10;
          leftRightBatEvent = true;
        }
      }

      const leftBatHit = this.checkHitLeftBat();
      const rightBatHit = this.checkHitRightBat();
      const leftBatTopBottomHit = this.checkHitTopOrBottomLeftBat();
      const rightBatTopBottomHit = this.checkHitTopOrBottomRightBat();
      if (leftBatTopBottomHit || rightBatTopBottomHit) {
        y = y * -1;
        topBottomEvent = true;
      }
      if (leftBatHit || rightBatHit) {
        x = x * -1;
        leftRightBatEvent = true;
        if (leftBatHit || rightBatHit) {
          if (
            (this.leftBatKey != null && this.leftBatKey === KEY_CODE.W_KEY) ||
            (this.rightBatKey != null && this.rightBatKey === KEY_CODE.UP_ARROW)
          ) {
            minusTwirlEvent = true;
            this.ballRotation = "clockwise";
            this.ballRotationDuration = 0.2;
            this.calculateDuration(5000);
          } else if (
            (this.leftBatKey != null && this.leftBatKey === KEY_CODE.S_KEY) ||
            (this.rightBatKey != null &&
              this.rightBatKey === KEY_CODE.DOWN_ARROW)
          ) {
            plusTwirlEvent = true;
            this.ballRotation = "counter-clockwise";
            this.ballRotationDuration = 0.2;
            this.calculateDuration(5000);
          }
        } else {
          this.ballRotationDuration = 0.6;
        }
      }
    }

    if (topBottomEvent) {
      this.movement.direction.y = this.movement.direction.y * -1;
    }
    if (leftRightBatEvent) {
      this.movement.direction.x = this.movement.direction.x * -1;
    }
    if (plusTwirlEvent) {
      this.movement.direction.y += 3;
    }
    if (minusTwirlEvent) {
      this.movement.direction.y -= 3;
    }
  }

  private checkHitTopOrBottom(): boolean {
    if (
      this.ballPosition.y <= 0 ||
      this.ballPosition.y >= this.gameFieldSize.height - this.ballDiameter
    ) {
      return true;
    }
    return false;
  }

  private checkHitLeftBat(): boolean {
    if (
      this.ballPosition.x <= this.leftBatPosition.x + this.leftBatSize.width &&
      this.ballPosition.y >= this.leftBatPosition.y &&
      this.ballPosition.y + this.ballDiameter <=
        this.leftBatPosition.y + this.leftBatSize.height
    ) {
      this.leftBatHit = true;
      setTimeout(() => {
        this.leftBatHit = false;
      }, 200);
      return true;
    }
    return false;
  }

  private checkHitTopOrBottomLeftBat(): boolean {
    // TODO: correct this
    if (
      this.ballPosition.x <= 30 &&
      this.ballPosition.x >= 10 &&
      this.ballPosition.y >= this.leftBatPosition.y &&
      this.ballPosition.y + this.ballDiameter <=
        this.leftBatPosition.y + this.leftBatSize.height
    ) {
      return true;
    }
    return false;
  }

  private checkHitTopOrBottomRightBat(): boolean {
    return false; // TODO:
  }

  private checkHitRightBat(): boolean {
    if (
      this.ballPosition.x + this.ballDiameter >=
        this.gameFieldSize.width -
          (this.gameFieldSize.width - this.rightBatPosition.x) &&
      this.ballPosition.y >= this.rightBatPosition.y &&
      this.ballPosition.y + this.ballDiameter <=
        this.rightBatPosition.y + this.rightBatSize.height
    ) {
      this.rightBatHit = true;
      setTimeout(() => {
        this.rightBatHit = false;
      }, 200);
      return true;
    }
    return false;
  }

  private calculateDuration(milliSeconds: number) {
    setTimeout(() => {
      if (this.ballRotationDuration < 2) {
        this.ballRotationDuration += 0.1;
        this.calculateDuration(milliSeconds);
      } else {
        this.ballRotation = null;
        this.ballRotationDuration = 0;
      }
    }, milliSeconds);
  }

  // Setting the bat keys from the gamefield event callback
  public setLeftBatKey(key: KEY_CODE) {
    this.leftBatKey = key;
  }

  public setRightBatKey(key: KEY_CODE) {
    this.rightBatKey = key;
  }
}
