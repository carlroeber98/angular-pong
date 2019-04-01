import {
  Component,
  OnInit,
  Input,
  HostListener,
  Output,
  EventEmitter
} from "@angular/core";
import { KEY_CODE } from "../enum/key-code.enum";

@Component({
  selector: "app-bat",
  templateUrl: "./bat.component.html",
  styleUrls: ["./bat.component.scss"]
})
export class BatComponent implements OnInit {
  private key: any;

  @Input() leftBat: boolean;
  @Input() hit: boolean;
  @Input() heightEvent: boolean;

  @Input() position: { x: number; y: number };
  @Input() size: { height: number; width: number };

  @Output() event = new EventEmitter<KEY_CODE>();

  @HostListener("window:keyup", ["$event"])
  keyUpEvent(event: KeyboardEvent) {
    if (this.leftBat) {
      if (
        this.key &&
        (event.keyCode === KEY_CODE.W_KEY || event.keyCode === KEY_CODE.S_KEY)
      ) {
        this.key = null;
        this.event.emit(this.key);
      }
    } else {
      if (
        this.key &&
        (event.keyCode === KEY_CODE.UP_ARROW ||
          event.keyCode === KEY_CODE.DOWN_ARROW)
      ) {
        this.key = null;
        this.event.emit(this.key);
      }
    }
  }
  @HostListener("window:keydown", ["$event"])
  keyDownEvent(event: KeyboardEvent) {
    if (this.leftBat) {
      if (
        this.leftBat &&
        (!this.key &&
          (event.keyCode === KEY_CODE.S_KEY ||
            event.keyCode === KEY_CODE.W_KEY))
      ) {
        this.key = event.keyCode;
        this.event.emit(this.key);
      }
    } else {
      if (
        !this.key &&
        (event.keyCode === KEY_CODE.UP_ARROW ||
          event.keyCode === KEY_CODE.DOWN_ARROW)
      ) {
        this.key = event.keyCode;
        this.event.emit(this.key);
      }
    }
  }
  constructor() {}

  ngOnInit() {}
}
