import * as tslib_1 from "tslib";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { GamefieldComponent } from './gamefield/gamefield.component';
import { BatComponent } from './bat/bat.component';
import { BallComponent } from './ball/ball.component';
import { PointsComponent } from './points/points.component';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib_1.__decorate([
        NgModule({
            declarations: [AppComponent, GamefieldComponent, BatComponent, BallComponent, PointsComponent],
            imports: [BrowserModule],
            providers: [],
            bootstrap: [AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map