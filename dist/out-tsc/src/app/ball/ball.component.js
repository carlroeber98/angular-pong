import * as tslib_1 from "tslib";
import { Component, Input } from "@angular/core";
var BallComponent = /** @class */ (function () {
    function BallComponent() {
        this.diameter = 25;
        this.position = {
            x: 0,
            y: 0
        };
    }
    BallComponent.prototype.ngOnInit = function () {
        this.setInitPosition();
    };
    BallComponent.prototype.setInitPosition = function () {
        this.position.x = this.gameFieldSize.width / 2 - this.diameter / 2;
        this.position.y = this.gameFieldSize.height / 2 - this.diameter / 2;
    };
    BallComponent.prototype.calculate = function (movement) {
        if (movement.direction.x < 0) {
            this.position.y--;
        }
        else {
            this.position.y++;
        }
    };
    BallComponent.prototype.getPosition = function () {
        return this.position;
    };
    BallComponent.prototype.getDiameter = function () {
        return this.diameter;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], BallComponent.prototype, "gameFieldSize", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], BallComponent.prototype, "hitBat", void 0);
    BallComponent = tslib_1.__decorate([
        Component({
            selector: "app-ball",
            templateUrl: "./ball.component.html",
            styleUrls: ["./ball.component.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], BallComponent);
    return BallComponent;
}());
export { BallComponent };
//# sourceMappingURL=ball.component.js.map