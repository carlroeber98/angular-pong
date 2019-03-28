import { GameControlService } from "./../game-control.service";
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
import { GameCalculationService } from "../game-calculation.service";
import { GameState } from "../game-state.enum";

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
  private ballRotation: string;
  private ballRotationDuration: number;

  @Output() goalEvent = new EventEmitter<boolean>();

  @ViewChild("ball") ball;
  @ViewChild("leftBat") leftBat;
  @ViewChild("rightBat") rightBat;

  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    this.size.height = window.innerHeight * 0.8;
    this.size.width = window.innerWidth * 0.85;
    console.log(this.size.height, this.size.width);
    this.gameCalculationService.setStopAndInitState();
  }

  constructor(private gameCalculationService: GameCalculationService) {}

  ngOnInit() {
    this.gameCalculationService.getGameTicker.subscribe(
      ({ gameState, direction }) => {
        switch (gameState) {
          case GameState.INITIAL:
            this.reset();
            break;
          case GameState.RUNNING:
            this.calculateMoves(direction);
            break;
        }
      }
    );
    this.onResize();
  }

  private calculateMoves(direction: any): void {
    let x = direction.x;
    let y = direction.y;

    // Calculate new x, y value smaller than 1 so that the ball movement can adjusted before hitting something
    let loopEntries = 1;
    while (Math.abs(x) >= 1 || Math.abs(y) >= 1) {
      x = x / 2;
      y = y / 2;
      loopEntries = loopEntries * 2;
    }

    let topBottomEvent = false;
    let leftRightBatEvent = false;
    let plusTwirlEvent = false;
    let minusTwirlEvent = false;
    for (let l = 0; l < loopEntries; l++) {
      // Calculate new ball position
      this.ball.calculateMovement(x, y);

      if (this.checkHitTopOrBottom()) {
        this.ballRotation = x > 0 ? "clockwise" : "counter-clockwise";
        this.ballRotationDuration = 0.7;
        this.calculateDuration(3000);
        y = y * -1;
        topBottomEvent = true;
      }

      if (this.ball.position.x <= 0) {
        this.goalEvent.emit(true);
        return;
      }
      if (this.ball.position.x >= this.size.width - this.ball.diameter) {
        this.goalEvent.emit(false);
        return;
      }

      const leftBatHit = this.checkHitLeftBat();
      const rightBatHit = this.checkHitRightBat();
      const leftBatTopBottomHit = this.checkHitTopOrBottomLeftBat();
      const rightBatTopBottomHit = this.checkHitTopOrBottomRightBat();
      if (leftBatTopBottomHit || rightBatTopBottomHit) {
        y = y * -1;
        console.log("Do somethink, like changing the angle!");
      }
      if (leftBatHit || rightBatHit) {
        x = x * -1;
        leftRightBatEvent = true;
        if (leftBatHit || rightBatHit) {
          if (this.leftBat.isUpKeyPressed() || this.rightBat.isUpKeyPressed()) {
            minusTwirlEvent = true;
            this.ballRotation = "clockwise";
            this.ballRotationDuration = 0.2;
            this.calculateDuration(5000);
          } else if (
            this.leftBat.isDownKeyPressed() ||
            this.rightBat.isDownKeyPressed()
          ) {
            plusTwirlEvent = true;
            this.ballRotation = "counter-clockwise";
            this.ballRotationDuration = 0.2;
            this.calculateDuration(5000);
          }
        } else {
          this.ballRotationDuration = 0.6;
        }
      }
    }

    if (topBottomEvent) {
      direction.y = direction.y * -1;
    }
    if (leftRightBatEvent) {
      direction.x = direction.x * -1;
    }
    if (plusTwirlEvent) {
      direction.y += 3;
    }
    if (minusTwirlEvent) {
      direction.y -= 3;
    }

    // render the bats
    this.calculateBats();
  }

  private checkHitTopOrBottom(): boolean {
    if (
      this.ball.position.y <= 0 ||
      this.ball.position.y >= this.size.height - this.ball.diameter
    ) {
      return true;
    }
    return false;
  }

  private checkHitLeftBat(): boolean {
    if (
      this.ball.position.x <=
        this.leftBat.position.x + this.leftBat.size.width &&
      this.ball.position.y >= this.leftBat.position.y &&
      this.ball.position.y + this.ball.diameter <=
        this.leftBat.position.y + this.leftBat.size.height
    ) {
      this.leftBatHit = true;
      setTimeout(() => {
        this.leftBatHit = false;
      }, 200);
      return true;
    }
    return false;
  }

  private checkHitTopOrBottomLeftBat(): boolean {
    // TODO: correct this
    if (
      this.ball.position.x <= 30 &&
      this.ball.position.x >= 10 &&
      this.ball.position.y >= this.leftBat.position.y &&
      this.ball.position.y + this.ball.diameter <=
        this.leftBat.position.y + this.leftBat.size.height
    ) {
      return true;
    }
    return false;
  }

  private checkHitTopOrBottomRightBat(): boolean {
    return false; // TODO:
  }

  private checkHitRightBat(): boolean {
    if (
      this.ball.position.x + this.ball.diameter >=
        this.size.width - (this.size.width - this.rightBat.position.x) &&
      this.ball.position.y >= this.rightBat.position.y &&
      this.ball.position.y + this.ball.diameter <=
        this.rightBat.position.y + this.rightBat.size.height
    ) {
      this.rightBatHit = true;
      setTimeout(() => {
        this.rightBatHit = false;
      }, 200);
      return true;
    }
    return false;
  }

  private reset(): void {
    this.leftBatHit = false;
    this.rightBatHit = false;
    this.ballRotationDuration = 0;
    this.ballRotation = null;
    this.ball.setInitPosition();
    this.leftBat.setInitPosition();
    this.rightBat.setInitPosition();
  }

  private calculateBats(): void {
    this.leftBat.calculate();
    this.rightBat.calculate();
  }

  private calculateDuration(milliSeconds: number) {
    setTimeout(() => {
      if (this.ballRotationDuration < 1) {
        this.ballRotationDuration += 0.1;
        this.calculateDuration(milliSeconds);
      } else {
        this.ballRotation = null;
        this.ballRotationDuration = 0;
      }
    }, milliSeconds);
  }
}
