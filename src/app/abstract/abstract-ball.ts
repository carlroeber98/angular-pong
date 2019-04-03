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

  // These functions display the circle and can return x, y intersection values on another line
  // If there is no intersection the functions are not defined and returns null
  public upperLineFunction(x: number): number {
    return (
      this.position.y +
      Math.sqrt(
        Math.pow(this.diameter / 2, 2) - Math.pow(this.position.x - x, 2)
      )
    );
  }

  public inversUpperLineFunction(x: number): number {
    return (
      this.position.x +
      Math.sqrt(
        Math.pow(this.diameter / 2, 2) - Math.pow(this.position.y - x, 2)
      )
    );
  }

  public underLineFunction(x: number): number {
    return (
      this.position.y -
      Math.sqrt(
        Math.pow(this.diameter / 2, 2) - Math.pow(this.position.x - x, 2)
      )
    );
  }

  public inversUnderLineFunction(x: number): number {
    return (
      this.position.x -
      Math.sqrt(
        Math.pow(this.diameter / 2, 2) - Math.pow(this.position.y - x, 2)
      )
    );
  }
}
