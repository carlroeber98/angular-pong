import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AngularSvgIconModule } from "angular-svg-icon";

@Component({
  selector: "app-ball",
  templateUrl: "./ball.component.html",
  styleUrls: ["./ball.component.scss"]
})
export class BallComponent implements OnInit {
  diameter = 25;
  position: {
    x: number;
    y: number;
  };

  @Input() gameFieldSize: { height: number; width: number };
  @Input() hitBat: boolean;
  @Input() rotation: string;
  @Input() rotationDuration: number;

  constructor() {}

  ngOnInit() {
    this.setInitPosition();
  }

  public setInitPosition(): void {
    this.position = {
      x: this.gameFieldSize.width / 2 - this.diameter / 2 + 5,
      y: this.gameFieldSize.height / 2 - this.diameter / 2 + 5
    };
  }

  public calculateMovement(x: number, y: number): void {
    this.position.x += x;
    this.position.y += y;
    this.position = {
      x: this.position.x += x,
      y: this.position.y += y
    };
  }
}
