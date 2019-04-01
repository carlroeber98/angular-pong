export class GameField {
  private _size: { height: number; width: number };

  private _leftGoalEvent: boolean;
  private _rightGoalEvent: boolean;

  constructor(size?: { height: number; width: number }) {
    this._size = size;
  }

  public get size() {
    return this._size;
  }

  public set size(size: { height: number; width: number }) {
    this._size = size;
  }

  public set leftGoalEvent(leftGoalEvent: boolean) {
    this._leftGoalEvent = leftGoalEvent;
  }

  public get leftGoalEvent() {
    return this._leftGoalEvent;
  }

  public set rightGoalEvent(rightGoalEvent: boolean) {
    this._rightGoalEvent = rightGoalEvent;
  }

  public get rightGoalEvent() {
    return this._rightGoalEvent;
  }
}
