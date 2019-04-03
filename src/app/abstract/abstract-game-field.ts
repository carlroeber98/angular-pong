import { GameField } from "../model/game-field";
import { AbstractBall } from "./abstract-ball";
import { AbstractBat } from "./abstract-bat";

export class AbstractGameField extends GameField {
  private _leftBat: AbstractBat;
  private _rightBat: AbstractBat;
  private _ball: AbstractBall;

  constructor(size: { height: number; width: number }) {
    super(size);
  }

  // Calcualte the inital gamefield:
  //  GameField width/height in relation to the window width/height
  //  Bats and ball width/height/diameter in relation to the gameField width/height
  //  Bat and ball position (x, y) that they are centered and at their correct positions
  // ATTENTION(!): The border size 5px has to be added to the calcualted positions
  public setInitialGamefield(): void {
    this.ball = new AbstractBall("", 0);
    this.leftBat = new AbstractBat(false, false);
    this.rightBat = new AbstractBat(false, false);

    this.leftBat.size = { height: 150, width: 10 };
    this.leftBat.position = {
      x: 60,
      y: this.size.height / 2 - this.leftBat.size.height / 2 + 5
    };

    this.rightBat.size = { height: 150, width: 10 };
    this.rightBat.position = {
      x: this.size.width - 60 - this.rightBat.size.width + 5,
      y: this.size.height / 2 - this.rightBat.size.height / 2 + 5
    };

    this.ball.diameter = 30;
    this.ball.position = {
      x: this.size.width / 2 - this.ball.diameter / 2 + 5,
      y: this.size.height / 2 - this.ball.diameter / 2 + 5
    };
  }

  public calculateBatPositions() {
    this.leftBat.calculatePosition(this.size.height);
    this.rightBat.calculatePosition(this.size.height);
  }

  public isTopOrBottomEvent(): boolean {
    if (
      this.ball.upperLineFunction(
        this.ball.inversUpperLineFunction(-this.ball.diameter / 2 + 5)
      ) ||
      this.ball.underLineFunction(
        this.ball.inversUnderLineFunction(
          this.size.height - this.ball.diameter / 2 + 5
        )
      )
    ) {
      return true;
    }
    return false;
  }

  public isLeftGoalEvent(): boolean {
    if (
      this.leftBat.size.height <= this.ball.diameter * 2 ||
      (this.ball.upperLineFunction(-this.ball.diameter / 2 + 5) >
        this.size.height / 2 + 10 - this.size.height * 0.21 &&
        this.ball.upperLineFunction(-this.ball.diameter / 2 + 5) <
          this.size.height / 2 +
            10 -
            this.size.height * 0.21 +
            this.size.height * 0.42)
    ) {
      this.leftGoalEvent = true;
      return true;
    } else {
      this.leftBat.onHeightEvent();
      return false;
    }
  }

  public isRightGoalEvent() {
    if (
      this.rightBat.size.height <= this.ball.diameter * 2 ||
      (this.ball.upperLineFunction(
        this.size.width - this.ball.diameter / 2 + 5
      ) >
        this.size.height / 2 + 10 - this.size.height * 0.21 &&
        this.ball.upperLineFunction(
          this.size.width - this.ball.diameter / 2 + 5
        ) <
          this.size.height / 2 +
            10 -
            this.size.height * 0.21 +
            this.size.height * 0.42)
    ) {
      this.rightGoalEvent = true;
      return true;
    } else {
      this.rightBat.onHeightEvent();
      return false;
    }
  }

  public isLeftBatHitEvent(): any {
    if (
      (this.ball.upperLineFunction(
        this.leftBat.position.x +
          this.leftBat.size.width -
          this.ball.diameter / 2
      ) >= this.leftBat.position.y ||
        this.ball.upperLineFunction(
          this.leftBat.position.x - this.ball.diameter / 2
        ) >= this.leftBat.position.y) &&
      (this.ball.upperLineFunction(
        this.leftBat.position.x +
          this.leftBat.size.width -
          this.ball.diameter / 2
      ) <=
        this.leftBat.position.y + this.leftBat.size.height ||
        this.ball.upperLineFunction(
          this.leftBat.position.x - this.ball.diameter / 2
        ) <=
          this.leftBat.position.y + this.leftBat.size.height)
    ) {
      this.leftBat.onHitEvent();
      return { leftRightHitEvent: true, topBottomHitEvent: false };
    }
    if (
      (this.ball.inversUnderLineFunction(
        this.leftBat.position.y - this.ball.diameter / 2 + 5
      ) >=
        this.leftBat.position.x - this.ball.diameter / 2 &&
        this.ball.inversUnderLineFunction(
          this.leftBat.position.y - this.ball.diameter / 2 + 5
        ) <=
          this.leftBat.position.x +
            this.leftBat.size.width -
            this.ball.diameter / 2) ||
      (this.ball.upperLineFunction(
        this.leftBat.position.y +
          this.leftBat.size.height -
          this.ball.diameter / 2 +
          5
      ) >=
        this.leftBat.position.x - this.ball.diameter / 2 &&
        this.ball.upperLineFunction(
          this.leftBat.position.y +
            this.leftBat.size.height -
            this.ball.diameter / 2 +
            5
        ) <=
          this.leftBat.position.x +
            this.leftBat.size.width -
            this.ball.diameter / 2)
    ) {
      return { leftRightHitEvent: false, topBottomHitEvent: true };
    }
    return { leftRightHitEvent: false, topBottomHitEvent: false };
  }

  public isRightBatHitEvent(): any {
    if (
      (this.ball.upperLineFunction(
        this.rightBat.position.x +
          this.rightBat.size.width -
          this.ball.diameter / 2
      ) >= this.rightBat.position.y ||
        this.ball.upperLineFunction(
          this.rightBat.position.x - this.ball.diameter / 2
        ) >= this.rightBat.position.y) &&
      (this.ball.upperLineFunction(
        this.rightBat.position.x +
          this.rightBat.size.width -
          this.ball.diameter / 2
      ) <=
        this.rightBat.position.y + this.rightBat.size.height ||
        this.ball.upperLineFunction(
          this.rightBat.position.x - this.ball.diameter / 2
        ) <=
          this.rightBat.position.y + this.rightBat.size.height)
    ) {
      this.rightBat.onHitEvent();
      return { leftRightHitEvent: true, topBottomHitEvent: false };
    }
    if (
      (this.ball.inversUnderLineFunction(
        this.rightBat.position.y - this.ball.diameter / 2 + 5
      ) >=
        this.rightBat.position.x - this.ball.diameter / 2 &&
        this.ball.inversUnderLineFunction(
          this.rightBat.position.y - this.ball.diameter / 2 + 5
        ) <=
          this.rightBat.position.x +
            this.rightBat.size.width -
            this.ball.diameter / 2) ||
      (this.ball.upperLineFunction(
        this.rightBat.position.y +
          this.rightBat.size.height -
          this.ball.diameter / 2 +
          5
      ) >=
        this.rightBat.position.x - this.ball.diameter / 2 &&
        this.ball.upperLineFunction(
          this.rightBat.position.y +
            this.rightBat.size.height -
            this.ball.diameter / 2 +
            5
        ) <=
          this.rightBat.position.x +
            this.rightBat.size.width -
            this.ball.diameter / 2)
    ) {
      return { leftRightHitEvent: false, topBottomHitEvent: true };
    }
    return { leftRightHitEvent: false, topBottomHitEvent: false };
  }

  public get leftBat() {
    return this._leftBat;
  }

  public set leftBat(bat: AbstractBat) {
    this._leftBat = bat;
  }

  public get rightBat() {
    return this._rightBat;
  }

  public set rightBat(bat: AbstractBat) {
    this._rightBat = bat;
  }

  public get ball() {
    return this._ball;
  }

  public set ball(ball: AbstractBall) {
    this._ball = ball;
  }
}
