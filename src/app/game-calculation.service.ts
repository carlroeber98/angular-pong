import { Injectable } from "@angular/core";
import { GameControlService } from "./game-control.service";
import { Subject, Observable } from "rxjs";
import { GameState } from "./enum/game-state.enum";
import { KEY_CODE } from "./enum/key-code.enum";
import { GameFieldState } from "./game-field-state";
import { AbstractBall } from "./abstract/abstract-ball";
import { AbstractBat } from "./abstract/abstract-bat";
import { AbstractGameField } from "./abstract/abstract-game-field";

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

  private gamefield: AbstractGameField;

  constructor(private gameControlService: GameControlService) {
    this.gameTicker = new Subject<GameFieldState>();
    this.gameControlService.getGameHandler.subscribe(gameState => {
      switch (gameState) {
        case GameState.INITIAL:
          this.movement = {
            gameSpeed: 0,
            batSpeed: 80,
            direction: { x: -3, y: 2 }
          };
          this.calculateRandomMovement();
          this.gamefield = new AbstractGameField({
            height: window.innerHeight * 0.8,
            width: window.innerWidth * 0.85
          });
          this.gamefield.setInitialGamefield();
          this.gameTicker.next(
            // how to cast classes ?
            new GameFieldState(
              this.gamefield.leftBat,
              this.gamefield.rightBat,
              this.gamefield.ball,
              this.gamefield
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
          clearInterval(this.gameInterval);
          this.gameInterval = null;
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
          this.gamefield.leftBat,
          this.gamefield.rightBat,
          this.gamefield.ball,
          this.gamefield
        )
      );
    }, 1000 / this.movement.gameSpeed);
  }

  private setBatCalculationInterval(): void {
    this.batInterval = setInterval(() => {
      //this.calculateBatPositions();
      this.gamefield.calculateBatPositions();
      this.gameTicker.next(
        new GameFieldState(this.gamefield.leftBat, this.gamefield.rightBat)
      );
    }, 1000 / this.movement.batSpeed);
  }

  public get getGameTicker(): Observable<GameFieldState> {
    return this.gameTicker;
  }

  // Calculate a random movement:
  //  GameSpeed should be between 35 (slow) and 70 (very fast)
  //  BatSpeed should be between 100 (slow) and 180 (fast)
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
    this.movement.gameSpeed = Math.floor(Math.random() * 80) + 50;
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

    let topBottomHitEvent = false;
    let leftRightHitEvent = false;
    let plusTwirlEvent = false;
    let minusTwirlEvent = false;
    for (let l = 0; l < loopEntries; l++) {
      this.gamefield.ball.position.x += x;
      this.gamefield.ball.position.y += y;

      if (this.gamefield.isTopOrBottomEvent()) {
        y = y * -1;
        this.gamefield.ball.setRoationAnimation(
          x > 0 ? "clockwise" : "counter-clockwise",
          0.7
        );
        topBottomHitEvent = true;
      }

      if (
        this.gamefield.ball.position.x <= 5 ||
        this.gamefield.ball.position.x >=
          this.gamefield.size.width - this.gamefield.ball.diameter + 5
      ) {
        if (
          this.gamefield.isLeftGoalEvent() ||
          this.gamefield.isRightGoalEvent()
        ) {
          break;
        } else {
          x = x * -1;
          leftRightHitEvent = true;
        }
      }

      const leftBatHit = this.gamefield.isLeftBatHitEvent();
      const rightBatHit = this.gamefield.isRightBatHitEvent();

      if (leftBatHit.topBottomHitEvent || rightBatHit.topBottomHitEvent) {
        //this.gameControlService.pauseGame();
        y = y * -1;
        topBottomHitEvent = true;
      } else if (
        leftBatHit.leftRightHitEvent ||
        rightBatHit.leftRightHitEvent
      ) {
        //this.gameControlService.pauseGame();
        x = x * -1;
        leftRightHitEvent = true;
        if (
          (leftBatHit.leftRightHitEvent &&
            this.gamefield.leftBat.isUpKeyPressed()) ||
          (rightBatHit.leftRightHitEvent &&
            this.gamefield.rightBat.isUpKeyPressed())
        ) {
          minusTwirlEvent = true;
          this.gamefield.ball.setRoationAnimation("clockwise", 0.2);
        } else if (
          (leftBatHit.leftRightHitEvent &&
            this.gamefield.leftBat.isDownKeyPressed()) ||
          (rightBatHit.leftRightHitEvent &&
            this.gamefield.rightBat.isDownKeyPressed())
        ) {
          plusTwirlEvent = true;
          this.gamefield.ball.setRoationAnimation("counter-clockwise", 0.2);
        }
      } else {
        this.gamefield.ball.rotationDuration = 0.6;
      }
    }

    if (topBottomHitEvent) {
      this.movement.direction.y = this.movement.direction.y * -1;
    }
    if (leftRightHitEvent) {
      this.movement.direction.x = this.movement.direction.x * -1;
    }
    if (plusTwirlEvent) {
      this.movement.direction.y += 3;
    }
    if (minusTwirlEvent) {
      this.movement.direction.y -= 3;
    }
  }

  // Setting the bat keys from the gamefield event callback
  public setLeftBatKey(key: KEY_CODE) {
    this.gamefield.leftBat.key = key;
  }

  public setRightBatKey(key: KEY_CODE) {
    this.gamefield.rightBat.key = key;
  }

  private calculateBearing(): void {
    console.log(this.movement.direction);
    const alpha =
      Math.acos(
        this.movement.direction.y /
          Math.sqrt(
            Math.pow(this.movement.direction.x, 2) +
              Math.pow(this.movement.direction.y, 2)
          )
      ) *
      (180 / Math.PI);
    const width = this.gamefield.size.width;
    const height = this.gamefield.size.height;
    const ballX = this.gamefield.ball.position.x;
    const ballY = this.gamefield.ball.position.y;

    const hitLeft = {
      x: 0,
      y:
        (-Math.cos((alpha / 180) * Math.PI + Math.PI) /
          -Math.sin((alpha / 180) * Math.PI + Math.PI)) *
          Math.PI *
          (0 - ballX) +
        ballY
    };
    const hitRight = {
      x: width,
      y:
        (-Math.cos((alpha / 180) * Math.PI + Math.PI) /
          -Math.sin((alpha / 180) * Math.PI + Math.PI)) *
          Math.PI *
          (width - ballX) +
        ballY
    };

    const hitTop =
      (height +
        (Math.cos((alpha / 180) * Math.PI + Math.PI) /
          Math.sin((alpha / 180) * Math.PI + Math.PI)) *
          Math.PI *
          ballX -
        ballY) /
      ((Math.cos((alpha / 180) * Math.PI + Math.PI) /
        Math.sin((alpha / 180) * Math.PI + Math.PI)) *
        Math.PI);

    const hitBottom =
      (0 +
        (Math.cos((alpha / 180) * Math.PI + Math.PI) /
          Math.sin((alpha / 180) * Math.PI + Math.PI)) *
          Math.PI *
          ballX -
        ballY) /
      ((Math.cos((alpha / 180) * Math.PI + Math.PI) /
        Math.sin((alpha / 180) * Math.PI + Math.PI)) *
        Math.PI);

    const top = ballY < 0 && hitTop >= 0 && hitTop <= width;
    const right = ballX > 0 && hitRight.y >= 0 && hitRight.y <= height;
    const bottom = ballY < 0 && hitBottom >= 0 && hitBottom <= width;
    const left = ballX < 0 && hitLeft.y >= 0 && hitRight.y <= height;
    console.log(top, right, bottom, left);

    if (!bottom) {
    } else {
    }
  }
}
