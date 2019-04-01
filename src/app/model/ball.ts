export class Ball {
  private _position: { x: number; y: number };
  private _diameter: number;
  private _rotation: string;
  private _rotationDuration: number;

  constructor(
    rotation?: string,
    rotationDuration?: number,
    position?: any,
    diameter?: number
  ) {
    this._rotation = rotation;
    this._rotationDuration = rotationDuration;
    this._position = position;
    this._diameter = diameter;
  }

  public get rotation(): string {
    return this._rotation;
  }

  public set rotation(rotation: string) {
    this._rotation = rotation;
  }

  public get rotationDuration(): number {
    return this._rotationDuration;
  }

  public set rotationDuration(rotationDuration: number) {
    this._rotationDuration = rotationDuration;
  }

  public get position(): any {
    return this._position;
  }

  public set position(position: any) {
    this._position = position;
  }

  public get diameter(): number {
    return this._diameter;
  }

  public set diameter(diameter: number) {
    this._diameter = diameter;
  }
}
