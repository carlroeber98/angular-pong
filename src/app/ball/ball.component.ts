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

  constructor() {}

  ngOnInit() {
    this.setInitPosition();
  }

  setInitPosition() {
    this.position.x = this.gameFieldSize.width / 2 - this.diameter / 2;
    this.position.y = this.gameFieldSize.height / 2 - this.diameter / 2;
  }

  calculateMovement(x: number, y: number) {
    this.position.x += x;
    this.position.y += y;
  }

  getPosition() {
    return this.position;
  }

  getDiameter(): number {
    return this.diameter;
  }
}
