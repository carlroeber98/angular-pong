import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bat',
  templateUrl: './bat.component.html',
  styleUrls: ['./bat.component.scss']
})
export class BatComponent {

  @Input() x: number;
  @Input() y: number;
  
  @Input() hit: boolean;

  constructor() { }


}
