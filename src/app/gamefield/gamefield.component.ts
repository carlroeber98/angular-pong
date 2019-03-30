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
import { KEY_CODE } from "../key-code.enum";

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
  leftBatPosition: { x: number; y: number };
  leftBatSize: { height: number; width: number };

  // Right bat values
  rightBatHit: boolean;
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
      if (gameFieldState.getGameFieldSize()) {
        this.size = gameFieldState.getGameFieldSize();
      }
      if (gameFieldState.getLeftBatHit() != null) {
        this.leftBatHit = gameFieldState.getLeftBatHit();
      }
      if (gameFieldState.getLeftBatPosition()) {
        this.leftBatPosition = gameFieldState.getLeftBatPosition();
      }
      if (gameFieldState.getLeftBatSize()) {
        this.leftBatSize = gameFieldState.getLeftBatSize();
      }
      if (gameFieldState.getRightBatHit() != null) {
        this.rightBatHit = gameFieldState.getRightBatHit();
      }
      if (gameFieldState.getRightBatPosition()) {
        this.rightBatPosition = gameFieldState.getRightBatPosition();
      }
      if (gameFieldState.getRightBatSize()) {
        this.rightBatSize = gameFieldState.getRightBatSize();
      }
      if (gameFieldState.getBallRotation() != null) {
        this.ballRotation = gameFieldState.getBallRotation();
      }
      if (gameFieldState.getBallRotationDuration()) {
        this.ballRotationDuration = gameFieldState.getBallRotationDuration();
      }
      if (gameFieldState.getBallPosition()) {
        this.ballPosition = gameFieldState.getBallPosition();
      }
      if (gameFieldState.getBallDiameter()) {
        this.ballDiameter = gameFieldState.getBallDiameter();
      }
      if (gameFieldState.getLeftGoalEvent()) {
        this.goalEvent.emit(true);
      }
      if (gameFieldState.getRightGoalEvent()) {
        this.goalEvent.emit(false);
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
