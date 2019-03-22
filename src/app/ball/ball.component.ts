import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent {

  @Input() x: number;
  @Input() y: number;

  private movement = {
    speed: 0,
    direction: {
      x: 0,
      y: 0
    }
  };

  constructor() {
  }



}
