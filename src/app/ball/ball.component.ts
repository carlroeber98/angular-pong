import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-ball",
  templateUrl: "./ball.component.html",
  styleUrls: ["./ball.component.scss"]
})
export class BallComponent implements OnInit {
  private diameter = 25;

  private position = {
    x: 0, // how to add a type x: number?
    y: 0
  };

  @Input() gameFieldSize: { height: number; width: number };
  @Input() hitBat: boolean;

  @Output() event = new EventEmitter<{}>();

  constructor(gamefieldSize: any) {
    this.gameFieldSize = gamefieldSize;
    this.position.x = this.gameFieldSize.width / 2 - this.diameter / 2;
    this.position.y = this.gameFieldSize.height / 2 - this.diameter / 2;
    this.event.emit(this.position);
  }

  ngOnInit() {
    this.position.x = this.gameFieldSize.width / 2 - this.diameter / 2;
    this.position.y = this.gameFieldSize.height / 2 - this.diameter / 2;
    this.event.emit(this.position);
  }

  calculate(movement: any) {
    if (movement.direction.x < 0) {
      this.position.y--;
    } else {
      this.position.y++;
    }
    this.event.emit(this.position);
  }

  getPosition() {
    return this.position;
  }

  getDiameter() {
    return this.diameter;
  }
}
