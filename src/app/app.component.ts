import { GameControlService } from "./game-control.service";
import { GameState } from "./game-state.enum";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  ViewChild,
  OnInit
} from "@angular/core";
import { getTView } from "@angular/core/src/render3/state";
import { KEY_CODE } from "./key-code.enum";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  leftPlayerPoints = 0;
  rightPlayerPoints = 0;

  gameIsRunning: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    private gameControlService: GameControlService
  ) {}

  ngOnInit() {
    this.gameControlService.getGameHandler.subscribe(gameState => {
      switch (gameState) {
        case GameState.INITIAL:
          this.gameIsRunning = false;
          break;
        case GameState.GAME_RUNNING:
          this.gameIsRunning = true;
          break;
        case GameState.BATS_RUNNING:
          break;
        case GameState.STOPPED:
          this.gameIsRunning = false;
          break;
      }
      this.cdr.detectChanges();
    });
    setTimeout(() => {
      this.gameControlService.setInitialGameField();
      this.gameControlService.startBatMovement();
    }, 100);
  }

  @HostListener("window:keydown", ["$event"])
  keyDownEvent(event: KeyboardEvent) {
    if (KEY_CODE.ENTER_KEY === event.keyCode) {
      if (this.gameIsRunning) {
        this.gameControlService.stopGame();
        this.resetField();
      } else {
        this.startGame();
      }
    }
  }

  startGame() {
    this.gameControlService.startGame();
  }

  goalEvent(leftGoal: boolean) {
    this.gameControlService.stopGame();
    if (leftGoal) {
      this.rightPlayerPoints++;
    } else {
      this.leftPlayerPoints++;
    }
    this.resetField();
  }

  resetField() {
    this.gameControlService.setInitialGameField();

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
  }

  resetGame() {
    this.gameControlService.stopGame();
    this.leftPlayerPoints = 0;
    this.rightPlayerPoints = 0;
    this.resetField();
  }
}
