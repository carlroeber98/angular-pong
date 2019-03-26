import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {
  diameter = 25;
  position: {
    x: number;
    y: number;
  };

  @Input() gameFieldSize: { height: number; width: number };
  @Input() hitBat: boolean;

  constructor() {}

  ngOnInit() {
    this.setInitPosition();
  }

  setInitPosition() {
    this.position = {
      x: this.gameFieldSize.width / 2 - this.diameter / 2,
      y: this.gameFieldSize.height / 2 - this.diameter / 2
    };
  }

  calculateMovement(x: number, y: number) {
    this.position.x += x;
    this.position.y += y;
    this.position = {
      x: this.position.x += x,
      y: this.position.y += y
    };
  }

  getPosition() {
    return this.position;
  }

  getDiameter(): number {
    return this.diameter;
  }
}
