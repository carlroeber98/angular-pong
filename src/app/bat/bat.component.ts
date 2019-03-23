import {
  Component,
  OnInit,
  Input,
  HostListener,
  Output,
  EventEmitter
} from "@angular/core";

export enum KEY_CODE {
  W_KEY = 87,
  S_KEY = 83,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  D_KEY = 68,
  A_KEY = 68
}

@Component({
  selector: "app-bat",
  templateUrl: "./bat.component.html",
  styleUrls: ["./bat.component.scss"]
})
export class BatComponent implements OnInit {
  private key: any;

  private position = {
    x: 0,
    y: 0
  };

  private size = {
    height: 300,
    width: 10
  };

  @Input() gameFieldSize: { height: number; width: number };
  @Input() leftBat: boolean;

  @Input() hit: boolean;

  @Output() event = new EventEmitter<number>();

  @HostListener("window:keyup", ["$event"])
  keyUpEvent(event: KeyboardEvent) {
    if (
      this.leftBat &&
      (this.key &&
        (event.keyCode === KEY_CODE.W_KEY || event.keyCode === KEY_CODE.S_KEY))
    ) {
      this.key = null;
      return;
    }

    if (
      this.key &&
      (event.keyCode === KEY_CODE.UP_ARROW ||
        event.keyCode === KEY_CODE.DOWN_ARROW)
    ) {
      this.key = null;
    }
  }
  @HostListener("window:keydown", ["$event"])
  keyDownEvent(event: KeyboardEvent) {
    if (
      this.leftBat &&
      (!this.key &&
        (event.keyCode === KEY_CODE.D_KEY ||
          event.keyCode === KEY_CODE.W_KEY ||
          event.keyCode === KEY_CODE.S_KEY ||
          event.keyCode === KEY_CODE.A_KEY))
    ) {
      this.key = event.keyCode;
      return;
    }

    if (
      !this.key &&
      (event.keyCode === KEY_CODE.UP_ARROW ||
        event.keyCode === KEY_CODE.DOWN_ARROW)
    ) {
      this.key = event.keyCode;
    }
  }
  constructor(gamefieldSize: any) {
    this.gameFieldSize = gamefieldSize;
    if (this.leftBat) {
      this.position.x = 20;
      this.position.y = this.gameFieldSize.height / 2 - this.size.height / 2;
    } else {
      this.position.x = this.gameFieldSize.width - 20 - this.size.width;
      this.position.y = this.gameFieldSize.height / 2 - this.size.height / 2;
    }
  }

  ngOnInit() {
    if (this.leftBat) {
      this.position.x = 20;
      this.position.y = this.gameFieldSize.height / 2 - this.size.height / 2;
    } else {
      this.position.x = this.gameFieldSize.width - 20 - this.size.width;
      this.position.y = this.gameFieldSize.height / 2 - this.size.height / 2;
    }
  }

  calculate() {
    if (this.leftBat) {
      this.calculateLeftBatMove();
    } else {
      this.calculaterightBatMove();
    }
    this.event.emit(this.position.y);
  }

  calculateLeftBatMove() {
    if (
      this.key &&
      this.position.y + (this.key === KEY_CODE.W_KEY ? -10 : 10) >= 0 &&
      this.position.y + (this.key === KEY_CODE.W_KEY ? -10 : 10) <=
        this.gameFieldSize.height - this.size.height
    ) {
      this.position.y += this.key === KEY_CODE.W_KEY ? -10 : 10;
    } else if (this.leftBat) {
      this.key = null;
    }
  }

  calculaterightBatMove() {
    if (
      this.key &&
      this.position.y + (this.key === KEY_CODE.UP_ARROW ? -10 : 10) >= 0 &&
      this.position.y + (this.key === KEY_CODE.UP_ARROW ? -10 : 10) <=
        this.gameFieldSize.height - this.size.height
    ) {
      this.position.y += this.key === KEY_CODE.UP_ARROW ? -10 : 10;
    } else {
      this.key = null;
    }
  }

  isUpKeyPressed() {
    return (
      this.key != null &&
      (this.key === KEY_CODE.UP_ARROW || this.key === KEY_CODE.W_KEY)
    );
  }

  isDownKeyPressed() {
    return (
      this.key != null &&
      (this.key === KEY_CODE.DOWN_ARROW || this.key === KEY_CODE.S_KEY)
    );
  }
}
