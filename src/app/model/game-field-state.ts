import { Bat } from "./bat";
import { Ball } from "./ball";
import { GameField } from "./game-field";
import { stringify } from '@angular/compiler/src/util';

export class GameFieldState {
  constructor(
    private _leftBat: Bat,
    private _rightBat: Bat,
    private _ball?: Ball,
    private _gamefield?: GameField
  ) {}

  public get ball(): Ball {
    return this._ball;
  }

  public get leftBat(): Bat {
    return this._leftBat;
  }

  public get rightBat(): Bat {
    return this._rightBat;
  }

  public get gameField(): any {
    return this._gamefield;
  }

  test(str?: string) {
    if (str) {
      return str
    }
    return '';
  }
}
