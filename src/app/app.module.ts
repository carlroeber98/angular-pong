import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { GamefieldComponent } from "./gamefield/gamefield.component";
import { BatComponent } from "./bat/bat.component";
import { BallComponent } from "./ball/ball.component";
import { PointsComponent } from "./points/points.component";

import { HttpClientModule } from "@angular/common/http";
import { AngularSvgIconModule } from "angular-svg-icon";

@NgModule({
  declarations: [
    AppComponent,
    GamefieldComponent,
    BatComponent,
    BallComponent,
    PointsComponent
  ],
  imports: [BrowserModule, HttpClientModule, AngularSvgIconModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
