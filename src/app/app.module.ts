import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GamefieldComponent } from './gamefield/gamefield.component';
import { BatComponent } from './bat/bat.component';
import { BallComponent } from './ball/ball.component';

@NgModule({
  declarations: [AppComponent, GamefieldComponent, BatComponent, BallComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
