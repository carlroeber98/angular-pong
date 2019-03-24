import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-points",
  templateUrl: "./points.component.html",
  styleUrls: ["./points.component.scss"]
})
export class PointsComponent implements OnInit {
  @Input() leftPlayerPoints: number;
  @Input() rightPlayerPoints: number;

  constructor() {}

  ngOnInit() {}
}
