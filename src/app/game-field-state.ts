export class GameFieldState {
  constructor(
    private leftBatPosition: { x: number; y: number },
    private rightBatPosition: { x: number; y: number },
    private ballPosition?: { x: number; y: number },
    private ballDiameter?: number,
    private gameFieldSize?: { height: number; width: number },
    private leftBatSize?: { height: number; width: number },
    private rightBatSize?: { height: number; width: number },
    private leftBatHit?: boolean,
    private rightBatHit?: boolean,
    private ballRotation?: string,
    private ballRotationDuration?: number,
    private leftGoalEvent?: boolean,
    private rightGoalEvent?: boolean
  ) {}

  public getGameFieldSize(): any {
    return this.gameFieldSize;
  }

  public getLeftBatHit(): boolean {
    return this.leftBatHit;
  }

  public getLeftBatPosition(): any {
    return this.leftBatPosition;
  }

  public getLeftBatSize(): any {
    return this.leftBatSize;
  }

  public getRightBatHit(): boolean {
    return this.rightBatHit;
  }

  public getRightBatPosition(): any {
    return this.rightBatPosition;
  }

  public getRightBatSize(): any {
    return this.rightBatSize;
  }

  public getBallRotation(): string {
    return this.ballRotation;
  }

  public getBallRotationDuration(): number {
    return this.ballRotationDuration;
  }

  public getBallPosition(): any {
    return this.ballPosition;
  }

  public getBallDiameter(): number {
    return this.ballDiameter;
  }

  public getLeftGoalEvent(): boolean {
    return this.leftGoalEvent;
  }

  public getRightGoalEvent(): boolean {
    return this.rightGoalEvent;
  }
}
