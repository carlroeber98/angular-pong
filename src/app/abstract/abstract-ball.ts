import { Ball } from "../model/ball";

export class AbstractBall extends Ball {
  constructor(
    rotation?: string,
    rotationDuration?: number,
    position?: any,
    diameter?: number
  ) {
    super(rotation, rotationDuration, position, diameter);
  }

  public setRoationAnimation(rotation: string, rotationDuration: number): void {
    this.rotation = rotation;
    this.rotationDuration = rotationDuration;
    this.calculateDuration();
  }

  private calculateDuration() {
    setTimeout(() => {
      if (this.rotationDuration < 2) {
        this.rotationDuration += 0.1;
        this.calculateDuration();
      } else {
        this.rotation = "";
        this.rotationDuration = 0;
      }
    }, this.rotationDuration * 2000);
  }
}
