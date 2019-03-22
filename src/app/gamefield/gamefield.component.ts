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

  @Input() width = 1500;
  @Input() height = 790;

  @Input() leftBatHit: boolean;
  @Input() rightBatHit: boolean;

  @Input() ballY: number;
  @Input() ballX: number;

  @Input() leftBatY: number;
  @Input() rightBatY: number;
  private leftBatX = 20;
  private rightBatX = this.width - 20;

  constructor() {}
  

}
