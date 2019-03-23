import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, HostListener, Input } from '@angular/core';
import { getTView } from '@angular/core/src/render3/state';
import { BallComponent } from '../ball/ball.component';
import { BatComponent } from '../bat/bat.component';

@Component({
  selector: 'app-gamefield',
  templateUrl: './gamefield.component.html',
  styleUrls: ['./gamefield.component.scss'],
})



export class GamefieldComponent {

  height: number;
  width: number;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.height = window.innerHeight * 0.8;
    this.width = window.innerWidth * 0.9;
  }

  @Input() leftBatHit: boolean;
  @Input() rightBatHit: boolean;

  @Input() ballY: number;
  @Input() ballX: number;

  @Input() leftBatY: number;
  @Input() rightBatY: number;
  
  private leftBatX = 20;
  private rightBatX = this.width - 20;

  constructor() {
    this.onResize();
  }
  

}
