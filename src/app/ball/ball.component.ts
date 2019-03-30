import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AngularSvgIconModule } from "angular-svg-icon";

@Component({
  selector: "app-ball",
  templateUrl: "./ball.component.html",
  styleUrls: ["./ball.component.scss"]
})
export class BallComponent implements OnInit {
  @Input() diameter: number;
  @Input() position: { x: number; y: number };

  @Input() hitBat: boolean;
  @Input() rotation: string;
  @Input() rotationDuration: number;

  constructor() {}

  ngOnInit() {}
}
