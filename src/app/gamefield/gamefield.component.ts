import { GameControlService } from "./../game-control.service";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { GameCalculationService } from "../game-calculation.service";
import { KEY_CODE } from "../enum/key-code.enum";

@Component({
  selector: "app-gamefield",
  templateUrl: "./gamefield.component.html",
  styleUrls: ["./gamefield.component.scss"]
})
export class GamefieldComponent implements OnInit {
  // Own values
  private size: { height: number; width: number };

  // Left bat values
  leftBatHit: boolean;
  leftBatHeightEvent: boolean;
  leftBatPosition: { x: number; y: number };
  leftBatSize: { height: number; width: number };

  // Right bat values
  rightBatHit: boolean;
  rightBatHeightEvent: boolean;
  rightBatPosition: { x: number; y: number };
  rightBatSize: { height: number; width: number };

  // Ball values
  ballRotation: string;
  ballRotationDuration: number;
  ballPosition: { x: number; y: number };
  ballDiameter: number;

  @Output() goalEvent = new EventEmitter<boolean>();

  constructor(private gameCalculationService: GameCalculationService) {}

  ngOnInit() {
    this.gameCalculationService.getGameTicker.subscribe(gameFieldState => {
      if (!gameFieldState) {
        return;
      }

      if (gameFieldState.leftBat) {
        if (gameFieldState.leftBat.position) {
          this.leftBatPosition = gameFieldState.leftBat.position;
        }
        if (gameFieldState.leftBat.size) {
          this.leftBatSize = gameFieldState.leftBat.size;
        }
        if (gameFieldState.leftBat.hitEvent != null) {
          this.leftBatHit = gameFieldState.leftBat.hitEvent;
        }
        if (gameFieldState.leftBat.heightEvent != null) {
          this.leftBatHeightEvent = gameFieldState.leftBat.heightEvent;
        }
      }

      if (gameFieldState.rightBat) {
        if (gameFieldState.rightBat.position) {
          this.rightBatPosition = gameFieldState.rightBat.position;
        }
        if (gameFieldState.rightBat.size) {
          this.rightBatSize = gameFieldState.rightBat.size;
        }
        if (gameFieldState.rightBat.hitEvent != null) {
          this.rightBatHit = gameFieldState.rightBat.hitEvent;
        }
        if (gameFieldState.rightBat.heightEvent != null) {
          this.rightBatHeightEvent = gameFieldState.rightBat.heightEvent;
        }
      }

      if (gameFieldState.ball) {
        if (gameFieldState.ball.diameter) {
          this.ballDiameter = gameFieldState.ball.diameter;
        }
        if (gameFieldState.ball.position) {
          this.ballPosition = gameFieldState.ball.position;
        }
        if (gameFieldState.ball.rotation != null) {
          this.ballRotation = gameFieldState.ball.rotation;
        }
        if (gameFieldState.ball.rotationDuration) {
          this.ballRotationDuration = gameFieldState.ball.rotationDuration;
        }
      }

      if (gameFieldState.gameField) {
        if (gameFieldState.gameField.size) {
          this.size = gameFieldState.gameField.size;
        }
        if (gameFieldState.gameField.leftGoalEvent) {
          this.goalEvent.emit(true);
        }
        if (gameFieldState.gameField.rightGoalEvent) {
          this.goalEvent.emit(false);
        }
      }
    });
  }

  setLeftBatKey(key: KEY_CODE): void {
    this.gameCalculationService.setLeftBatKey(key);
  }

  setRightBatKey(key: KEY_CODE): void {
    this.gameCalculationService.setRightBatKey(key);
  }
}
