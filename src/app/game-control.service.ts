import { Injectable } from '@angular/core';
import { Observable, Subject, TimeInterval } from 'rxjs';

export enum GameState {
  INITIAL = 'initial',
  RUNNING = 'running',
  PAUSED = 'paused',
  STOPPED = 'stopped'
}

@Injectable({
  providedIn: 'root'
})
export class GameControlService {
  private gameTicker: Subject<GameState>;
  private interval: any;

  constructor() {
    this.gameTicker = new Subject<GameState>();
    this.gameTicker.next(GameState.INITIAL);
  }

  public startGame(): void {
    this.interval = setInterval(() => {
      this.gameTicker.next(GameState.RUNNING);
    }, 1000 / 16);
  }

  public stopGame(): void {
    clearInterval(this.interval);
    this.gameTicker.next(GameState.STOPPED);
  }

  public resetGame(): void {}

  public get gameState(): Observable<GameState> {
    return this.gameTicker;
  }
}
