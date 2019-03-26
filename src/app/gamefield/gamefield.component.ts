import { GameControlService } from './../game-control.service';
import {
  Component,
  OnInit,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { getTView } from '@angular/core/src/render3/state';
import { BallComponent } from '../ball/ball.component';
import { BatComponent } from '../bat/bat.component';

@Component({
  selector: 'app-gamefield',
  templateUrl: './gamefield.component.html',
  styleUrls: ['./gamefield.component.scss']
})
export class GamefieldComponent implements OnInit {
  private size = {
    height: 790,
    width: 1500
  };

  private leftBatHit: boolean;
  private rightBatHit: boolean;

  @Output() goalEvent = new EventEmitter<boolean>();

  @ViewChild('ball') ball;
  @ViewChild('leftBat') leftBat;
  @ViewChild('rightBat') rightBat;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.size.height = window.innerHeight * 0.8;
    this.size.width = window.innerWidth * 0.85;
  }

  constructor(private gameControlService: GameControlService) {}

  ngOnInit() {
    // this.onResize();
    this.gameControlService.gameState.subscribe(console.log);
  }

  calculateMoves(direction: any) {
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
        y = y * -1;
        topBottomEvent = true;
      }

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
      const leftBatTopBottomHit = this.checkHitTopOrBottomLeftBat();
      const rightBatTopBottomHit = this.checkHitTopOrBottomRightBat();
      if (leftBatTopBottomHit || rightBatTopBottomHit) {
        console.log('Do somethink, like changing the angle!');
      }
      if (leftBatHit || rightBatHit) {
        x = x * -1;
        leftRightBatEvent = true;
        if (
          (leftBatHit || rightBatHit) &&
          (this.leftBat.isUpKeyPressed() || this.rightBat.isUpKeyPressed())
        ) {
          minusTwirlEvent = true;
        } else if (
          (leftBatHit || rightBatHit) &&
          (this.leftBat.isDownKeyPressed() || this.rightBat.isDownKeyPressed())
        ) {
          plusTwirlEvent = true;
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

    return direction;
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

  checkHitTopOrBottomLeftBat() {
    // TODO: correct this
    if (
      this.ball.getPosition().x <= 30 &&
      this.ball.getPosition().x >= 10 &&
      this.ball.getPosition().y >= this.leftBat.getPosition().y &&
      this.ball.getPosition().y + this.ball.getDiameter() <=
        this.leftBat.getPosition().y + this.leftBat.getSize().height
    ) {
      console.log('hier');
      return true;
    }
    return false;
  }

  checkHitTopOrBottomRightBat() {
    return false; // TODO:
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
    this.leftBatHit = false;
    this.rightBatHit = false;
    this.ball.setInitPosition();
    this.leftBat.setInitPosition();
    this.rightBat.setInitPosition();
  }

  calculateBats() {
    this.leftBat.calculate();
    this.rightBat.calculate();
  }
}
