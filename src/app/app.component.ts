import { GameControlService } from './game-control.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  ViewChild
} from '@angular/core';
import { getTView } from '@angular/core/src/render3/state';
import { KEY_CODE } from './key-code.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  leftPlayerPoints = 0;
  rightPlayerPoints = 0;

  gameIsRunning = false;

  private movement = {
    speed: 2,
    direction: {
      x: 0,
      y: 0
    }
  };

  @ViewChild('gamefield') gameField;

  constructor(
    private gameControlService: GameControlService,
    private cdr: ChangeDetectorRef
  ) {}

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    if (KEY_CODE.ENTER_KEY === event.keyCode) {
      if (this.gameIsRunning) {
        this.resetField();
      } else {
        this.startGame();
      }
    }
  }

  startGame() {
    this.gameControlService.startGame();
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

    const newDirection = this.gameField.calculateMoves(this.movement.direction);

    // Render actual positions
    this.cdr.detectChanges();

    if (newDirection == null) {
      this.gameIsRunning = false;
      return;
    } else {
      this.movement.direction = newDirection;
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
      alert('Player 1 won the game');
      this.resetGame();
      return;
    }

    if (this.rightPlayerPoints === 6) {
      alert('Player 2 won the game');
      this.resetGame();
      return;
    }

    this.gameField.reset();

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
    this.gameControlService.stopGame();
    this.gameIsRunning = false;
    this.leftPlayerPoints = 0;
    this.rightPlayerPoints = 0;
    this.resetField();
  }
}
