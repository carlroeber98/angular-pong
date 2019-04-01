export class Bat {
  private _position: { x: number; y: number };
  private _size: { height: number; width: number };
  private _hitEvent: boolean;
  private _heightEvent: boolean;

  constructor(
    hitEvent?: boolean,
    heightEvent?: boolean,
    position?: { x: number; y: number },
    size?: { height: number; width: number }
  ) {
    this._hitEvent = hitEvent;
    this._heightEvent = heightEvent;
    this._position = position;
    this._size = size;
  }

  public get hitEvent(): boolean {
    return this._hitEvent;
  }

  public set hitEvent(hitEvent: boolean) {
    this._hitEvent = hitEvent;
  }

  public get heightEvent(): boolean {
    return this._heightEvent;
  }

  public set heightEvent(heightEvent: boolean) {
    this._heightEvent = heightEvent;
  }

  public get position(): any {
    return this._position;
  }

  public set position(position: any) {
    this._position = position;
  }

  public get size(): any {
    return this._size;
  }

  public set size(size: any) {
    this._size = size;
  }
}
