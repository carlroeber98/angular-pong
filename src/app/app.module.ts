import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { GamefieldComponent } from "./gamefield/gamefield.component";
import { BatComponent } from "./bat/bat.component";
import { BallComponent } from "./ball/ball.component";
import { PointsComponent } from "./points/points.component";

import { HttpClientModule } from "@angular/common/http";
import { AngularSvgIconModule } from "angular-svg-icon";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatIconModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    GamefieldComponent,
    BatComponent,
    BallComponent,
    PointsComponent
  ],
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, AngularSvgIconModule, MatButtonModule, MatIconModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
