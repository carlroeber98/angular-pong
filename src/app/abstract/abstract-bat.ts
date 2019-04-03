import { KEY_CODE } from "../enum/key-code.enum";
import { Bat } from "../model/bat";

export class AbstractBat extends Bat {
  private _key: KEY_CODE;

  constructor(
    hitEvent?: boolean,
    heightEvent?: boolean,
    position?: { x: number; y: number },
    size?: { height: number; width: number }
  ) {
    super(hitEvent, heightEvent, position, size);
  }

  public calculatePosition(gamefieldHeight: number): void {
    if (this.key) {
      for (let i = 0; i < 5; i++) {
        if (
          this.position.y +
            (this.key === KEY_CODE.W_KEY || this.key === KEY_CODE.UP_ARROW
              ? -1
              : 1) >=
            5 &&
          this.position.y +
            (this.key === KEY_CODE.W_KEY || this.key === KEY_CODE.UP_ARROW
              ? -1
              : 1) <=
            gamefieldHeight - this.size.height + 6
        ) {
          this.position.y +=
            this.key === KEY_CODE.W_KEY || this.key === KEY_CODE.UP_ARROW
              ? -1
              : 1;
        } else {
          this.key = null;
          break;
        }
      }
    }
  }

  public isUpKeyPressed(): boolean {
    return (
      this.key != null &&
      (this.key === KEY_CODE.W_KEY || this.key === KEY_CODE.UP_ARROW)
    );
  }

  public isDownKeyPressed(): boolean {
    return (
      this.key != null &&
      (this.key === KEY_CODE.S_KEY || this.key === KEY_CODE.DOWN_ARROW)
    );
  }

  public onHeightEvent(): void {
    this.size.height -= 20;
    this.position.y += 10;
    this.heightEvent = true;
    setTimeout(() => {
      this.heightEvent = false;
    }, 500);
  }

  public onHitEvent(): void {
    this.hitEvent = true;
    setTimeout(() => {
      this.hitEvent = false;
    }, 500);
  }

  public get key() {
    return this._key;
  }

  public set key(key: KEY_CODE) {
    this._key = key;
  }
}
