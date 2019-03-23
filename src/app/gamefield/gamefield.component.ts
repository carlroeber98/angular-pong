import {
  Component,
  OnInit,
  HostListener,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { getTView } from "@angular/core/src/render3/state";
import { BallComponent } from "../ball/ball.component";
import { BatComponent } from "../bat/bat.component";

@Component({
  selector: "app-gamefield",
  templateUrl: "./gamefield.component.html",
  styleUrls: ["./gamefield.component.scss"]
})
export class GamefieldComponent implements OnInit {
  ball: BallComponent;
  leftBat: BatComponent;
  rightBat: BatComponent;

  private size = {
    height: 790,
    width: 1500
  };

  private ballPosition = {
    x: 0,
    y: 0
  };

  private leftBatPosition = {
    x: 0,
    y: 0
  };

  private rightBatPosition = {
    x: 0,
    y: 0
  };

  private leftBatHit: boolean;
  private rightBatHit: boolean;

  @Output() goalEvent = new EventEmitter<boolean>();

  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    this.size.height = window.innerHeight * 0.8;
    this.size.width = window.innerWidth * 0.85;
  }

  constructor() {
    console.log(this.size);
    this.ball = new BallComponent(this.size);
    this.leftBat = new BatComponent(this.size);
    this.rightBat = new BatComponent(this.size);
  }

  ngOnInit() {
    // this.onResize();
    this.ball = new BallComponent(this.size);
    this.leftBat = new BatComponent(this.size);
    this.rightBat = new BatComponent(this.size);
  }

  calculateMoves(movement: any) {
    // TODO:Fix bug if the ball hits the bat not at the right site (if the angle is too big the ball hit the bat
    // but x * -1 + 1is not workinkg and gets called multiple times because the ball is still inside the bat range)
    for (let l = 0; l < Math.abs(movement.direction.x); l++) {
      // calculate new ball position
      this.calculateBall(movement);

      if (this.ball.getPosition().x <= 0) {
        console.log("hier");
        this.goalEvent.emit(true);
        return;
      }
      if (
        this.ball.getPosition().x >=
        this.size.width - this.ball.getDiameter()
      ) {
        this.goalEvent.emit(false);
        return;
      }

      const leftBatHit = this.checkHitLeftBat();
      const rightBatHit = this.checkHitRightBat();
      if (leftBatHit || rightBatHit) {
        movement.direction.x = movement.direction.x * -1;
        if (
          (leftBatHit || rightBatHit) &&
          (this.leftBat.isUpKeyPressed() || this.rightBat.isUpKeyPressed())
        ) {
          movement.direction.y -= 3;
        } else if (
          (leftBatHit || rightBatHit) &&
          (this.leftBat.isDownKeyPressed() || this.rightBat.isDownKeyPressed())
        ) {
          movement.direction.y += 3;
        }
      }
    }

    for (let l = 0; l < Math.abs(movement.direction.y); l++) {
      if (movement.direction.y < 0) {
        this.ballPosition.y--;
      } else {
        this.ballPosition.y++;
      }
      if (this.checkHitTopOrBottom()) {
        movement.direction.y = movement.direction.y * -1;
      }
    }
    // render the bats
    this.calculateBats();

    return movement;
  }

  checkHitTopOrBottom() {
    if (
      this.ballPosition.y <= 0 ||
      this.ballPosition.y >= this.size.height - 25
    ) {
      // getter ball diameter
      return true;
    }
    return false;
  }

  checkHitLeftBat() {
    if (
      this.ballPosition.x <= 30 &&
      this.ballPosition.y >= this.leftBatPosition.y &&
      this.ballPosition.y + 20 <= this.leftBatPosition.y + 150
    ) {
      this.leftBatHit = true;
      setTimeout(() => {
        this.leftBatHit = false;
      }, 200);
      return true;
    }
    return false;
  }

  checkHitRightBat() {
    if (
      this.ballPosition.x >= this.size.width - 30 &&
      this.ballPosition.y >= this.rightBatPosition.y &&
      this.ballPosition.y + 25 <= this.rightBatPosition.y + 150 // getter ball schlaeger size
    ) {
      this.rightBatHit = true;
      setTimeout(() => {
        this.rightBatHit = false;
      }, 200);
      return true;
    }
    return false;
  }

  calculateBats() {
    this.leftBat.calculate();
    this.leftBat.calculate();
  }

  calculateBall(movement: any) {
    this.ball.calculate(movement);
  }

  setLeftBatY(position: any) {
    this.leftBatPosition = position;
  }

  setRightBatY(position: any) {
    this.rightBatPosition = position;
  }

  setBallPosition(position: any) {
    this.ballPosition = position;
  }
}
