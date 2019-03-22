import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { getTView } from '@angular/core/src/render3/state';
import { GamefieldComponent } from './gamefield/gamefield.component';
import { BallComponent } from './ball/ball.component';
import { BatComponent } from './bat/bat.component';

export enum KEY_CODE {
  W_KEY = 87,
  S_KEY = 83,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  D_KEY = 68,
  A_KEY = 68
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})



export class AppComponent{

  private gameField: GamefieldComponent;

  hitRight = false;
  hitLeft = false;
  
  leftBatMinusEvent = false;
  leftBatPlusEvent = false;

  leftBatKey;
  rightBatKey;

  leftBatY = 320;
  rightBatY = 320;

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
 
  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    if (this.leftBatKey && (event.keyCode === KEY_CODE.W_KEY || event.keyCode === KEY_CODE.S_KEY)) {
      this.leftBatKey = null;
    }

    if (this.rightBatKey && (event.keyCode === KEY_CODE.UP_ARROW || event.keyCode === KEY_CODE.DOWN_ARROW)) {
      this.rightBatKey = null;
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    console.log(event.keyCode);
    if (!this.leftBatKey && (event.keyCode === KEY_CODE.D_KEY || event.keyCode === KEY_CODE.W_KEY || event.keyCode === KEY_CODE.S_KEY || event.keyCode === KEY_CODE.A_KEY)) {
      this.leftBatKey = event.keyCode;
    }

    if (!this.rightBatKey && (event.keyCode === KEY_CODE.UP_ARROW || event.keyCode === KEY_CODE.DOWN_ARROW)) {
      this.rightBatKey = event.keyCode;
    }
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
  // TODO:Fix bug if the ball hits the bat not at the right site (if the angle is too big the ball hit the bat
  // but x * -1 + 1is not workinkg and gets called multiple times because the ball is still inside the bat range)

    // calculate new position
    for (let l = 0; l < Math.abs(this.movement.direction.x); l ++) {
      if (this.movement.direction.x < 0) {
        this.ballLeft --;
      } else {
        this.ballLeft ++;
      }
      if (this.ballLeft <= 0) {
        this.rightPlayerPoints ++;
        this.resetField();
        return;
      }
      if (this.ballLeft >= 1480) {
        this.leftPlayerPoints ++;
        this.resetField();
        return;
      }

      this.checkHitTopOrBottomLeftBat();

      const leftBatHit = this.checkHitLeftBat();
      const rightBatHit = this.checkHitRightBat();
      if (leftBatHit || rightBatHit) {
        this.movement.direction.x = this.movement.direction.x * -1;
        if (this.leftBatKey && leftBatHit) {
          this.checkIsBatLeftMovingHit();
        }
        if (this.rightBatKey && rightBatHit) {
          this.checkIsBatRightMovingHit();
        }
      }
    }

    for (let l = 0; l < Math.abs(this.movement.direction.y); l ++) {
      if (this.movement.direction.y < 0) {
        this.ballTop --;
      } else {
        this.ballTop ++;
      }
      if (this.checkHitTopOrBottom()) {
        this.movement.direction.y = this.movement.direction.y * -1;
      }
    }

    if (this.leftBatKey && this.leftBatKey != KEY_CODE.D_KEY && this.leftBatKey != KEY_CODE.A_KEY &&
     this.leftBatTop + (this.leftBatKey === KEY_CODE.W_KEY ? -10 : 10) >= 0 &&
     this.leftBatTop + (this.leftBatKey === KEY_CODE.W_KEY ? -10 : 10) <= 640) {
      this.leftBatTop += this.leftBatKey === KEY_CODE.W_KEY ? -10 : 10;
    } else if(this.leftBatKey === KEY_CODE.D_KEY){
      this.leftBatMinusEvent = true;
      setTimeout(() => {
        this.leftBatMinusEvent = false;
      }, 100);
      this.leftBatKey = null;
    } else if(this.leftBatKey === KEY_CODE.A_KEY){
      this.leftBatPlusEvent = true;
      setTimeout(() => {
        this.leftBatPlusEvent = false;
      }, 100);
      this.leftBatKey = null;
    }else{
      this.leftBatKey = null;
    }

    if (this.rightBatKey &&
      this.rightBatTop + (this.rightBatKey === KEY_CODE.UP_ARROW ? -10 : 10) >= 0 &&
       this.rightBatTop + (this.rightBatKey === KEY_CODE.UP_ARROW ? -10 : 10) <= 640) {
      this.rightBatTop += this.rightBatKey === KEY_CODE.UP_ARROW ? -10 : 10;
    } else {
      this.rightBatKey = null;
    }

    // Render actual positions
    this.cdr.detectChanges();

    // Render new position
    setTimeout(() => {
      this.nextMove();
    }, 1000 / 16 / this.movement.speed);
  }

  checkIsBatLeftMovingHit() {
    if (this.leftBatKey === KEY_CODE.W_KEY) {
      this.movement.direction.y -= 3;
    } else if (this.leftBatKey === KEY_CODE.S_KEY) {
      this.movement.direction.y += 3;
    }
  }

  checkIsBatRightMovingHit() {
    if (this.rightBatKey === KEY_CODE.UP_ARROW) {
      this.movement.direction.y -= 3;
    } else if (this.rightBatKey === KEY_CODE.DOWN_ARROW) {
      this.movement.direction.y += 3;
    }
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
      while (randomNumber < 0 && randomNumber > - 1 || randomNumber > 0 && randomNumber < 1) {
        randomNumber = Math.round((Math.random() * 4 - 2) * 100000) / 100000;
      }
      this.movement.direction.x = this.movement.direction.y * randomNumber;
    }

    this.movement.speed = 6 / Math.abs(randomNumber);
  }

  checkHitTopOrBottom() {
    if (this.ballTop <= 0 || this.ballTop >= 770) {
      return true;
    }
    return false;
  }

  checkHitLeftBat() {
    if (this.ballLeft <= 30 &&
      this.ballTop >= this.leftBatTop &&
      this.ballTop + 20 <= this.leftBatTop + 150) {
      this.hitLeft = true;
      setTimeout(() => {
        this.hitLeft = false;
      }, 200);
      return true;
    }
    return false;
  }

  checkHitRightBat() {
    if (this.ballLeft >= 1450 &&
      this.ballTop >= this.rightBatTop &&
      this.ballTop + 20 <= this.rightBatTop + 150) {
      this.hitRight = true;
      setTimeout(() => {
        this.hitRight = false;
      }, 200);
      return true;
    }
    return false;
  }

  resetGame() {
    this.gameIsRunning = false;
    this.leftPlayerPoints = 0;
    this.rightPlayerPoints = 0;
    this.resetField();
  }

  checkHitTopOrBottomLeftBat() {
    if (this.ballLeft <= 30 && this.ballLeft >= 10 &&
      this.ballTop >= this.leftBatTop &&
      this.ballTop + 20 <= this.leftBatTop + 150) {
      console.log("hier");
    }
  }
}
