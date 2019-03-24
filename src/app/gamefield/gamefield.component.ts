import {
  Component,
  OnInit,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ViewChild
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
  private size = {
    height: 790,
    width: 1500
  };

  private leftBatHit: boolean;
  private rightBatHit: boolean;

  @Output() goalEvent = new EventEmitter<boolean>();

  @ViewChild("ball") ball;
  @ViewChild("leftBat") leftBat;
  @ViewChild("rightBat") rightBat;

  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    this.size.height = window.innerHeight * 0.8;
    this.size.width = window.innerWidth * 0.85;
  }

  constructor() {}

  ngOnInit() {
    // this.onResize();
  }

  calculateMoves(movement: any) {
    // TODO:Fix bug if the ball hits the bat not at the right site (if the angle is too big the ball hit the bat
    // but x * -1 + 1is not workinkg and gets called multiple times because the ball is still inside the bat range)
    for (let l = 0; l < Math.abs(movement.direction.x); l++) {
      // calculate new ball position
      this.ball.calculateXMovement(movement.direction.x);

      if (this.ball.getPosition().x <= 0) {
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
      this.ball.calculateYMovement(movement.direction.y);
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
      this.ball.getPosition().y <= 0 ||
      this.ball.getPosition().y >= this.size.height - this.ball.getDiameter()
    ) {
      return true;
    }
    return false;
  }

  checkHitLeftBat() {
    if (
      this.ball.getPosition().x <=
        this.leftBat.getPosition().x + this.leftBat.getSize().width &&
      this.ball.getPosition().y >= this.leftBat.getPosition().y &&
      this.ball.getPosition().y + this.ball.getDiameter() <=
        this.leftBat.getPosition().y + this.leftBat.getSize().height
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
      this.ball.getPosition().x + this.ball.getDiameter() >=
        this.size.width - (this.size.width - this.rightBat.getPosition().x) &&
      this.ball.getPosition().y >= this.rightBat.getPosition().y &&
      this.ball.getPosition().y + this.ball.getDiameter() <=
        this.rightBat.getPosition().y + this.rightBat.getSize().height
    ) {
      this.rightBatHit = true;
      setTimeout(() => {
        this.rightBatHit = false;
      }, 200);
      return true;
    }
    return false;
  }

  reset() {
    this.ball.setInitPosition();
    this.leftBat.setInitPosition();
    this.rightBat.setInitPosition();
  }

  calculateBats() {
    this.leftBat.calculate();
    this.rightBat.calculate();
  }
}
