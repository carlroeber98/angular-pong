import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { getTView } from "@angular/core/src/render3/state";
import { GamefieldComponent } from "./gamefield/gamefield.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private gameField: GamefieldComponent;

  leftPlayerPoints = 0;
  rightPlayerPoints = 0;

  gameIsRunning = false;

  private movement = {
    speed: 0,
    direction: {
      x: 0,
      y: 0
    }
  };

  leftBatTop = 320;
  rightBatTop = 320;

  ballTop = 380;
  ballLeft = 730;

  constructor(private cdr: ChangeDetectorRef) {
    this.gameField = new GamefieldComponent();
  }

  startGame() {
    this.calculateRandomMovement();
    if (!this.gameIsRunning) {
      this.gameIsRunning = true;
      this.nextMove();
    }
  }

  nextMove() {
    if (!this.gameIsRunning) {
      return;
    }

    const newMovement = this.gameField.calculateMoves(this.movement);

    // Render actual positions
    this.cdr.detectChanges();

    if (newMovement == null) {
      this.gameIsRunning = false;
      return;
    } else {
      this.movement = newMovement;
    }

    // Render new position
    setTimeout(() => {
      this.nextMove();
    }, 1000 / 16 / this.movement.speed);
  }

  goalEvent(leftGoal: boolean) {
    if (leftGoal) {
      this.rightPlayerPoints++;
    } else {
      this.leftPlayerPoints++;
    }
    this.resetField();
  }

  resetField() {
    this.gameIsRunning = false;

    if (this.leftPlayerPoints === 6) {
      alert("Player 1 won the game");
      this.resetGame();
      return;
    }

    if (this.rightPlayerPoints === 6) {
      alert("Player 2 won the game");
      this.resetGame();
      return;
    }

    this.leftBatTop = 320;
    this.rightBatTop = 320;

    this.ballTop = 380;
    this.ballLeft = 730;

    this.movement.direction.x = 0;
    this.movement.direction.y = 0;

    this.cdr.detectChanges();
  }

  calculateRandomMovement() {
    let randomNumber = Math.round((Math.random() * 4 - 2) * 100000) / 100000;
    while (this.movement.direction.x === 0 || this.movement.direction.y === 0) {
      this.movement.direction.y = Math.floor(Math.random() * 13) - 6;
      while (
        (randomNumber < 0 && randomNumber > -1) ||
        (randomNumber > 0 && randomNumber < 1)
      ) {
        randomNumber = Math.round((Math.random() * 4 - 2) * 100000) / 100000;
      }
      this.movement.direction.x = this.movement.direction.y * randomNumber;
    }

    this.movement.speed = 6 / Math.abs(randomNumber);
  }

  resetGame() {
    this.gameIsRunning = false;
    this.leftPlayerPoints = 0;
    this.rightPlayerPoints = 0;
    this.resetField();
  }
}
