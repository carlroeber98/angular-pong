import * as tslib_1 from "tslib";
import { Component, Input, HostListener } from "@angular/core";
export var KEY_CODE;
(function (KEY_CODE) {
    KEY_CODE[KEY_CODE["W_KEY"] = 87] = "W_KEY";
    KEY_CODE[KEY_CODE["S_KEY"] = 83] = "S_KEY";
    KEY_CODE[KEY_CODE["UP_ARROW"] = 38] = "UP_ARROW";
    KEY_CODE[KEY_CODE["DOWN_ARROW"] = 40] = "DOWN_ARROW";
    KEY_CODE[KEY_CODE["D_KEY"] = 68] = "D_KEY";
    KEY_CODE[KEY_CODE["A_KEY"] = 68] = "A_KEY";
})(KEY_CODE || (KEY_CODE = {}));
var BatComponent = /** @class */ (function () {
    function BatComponent() {
        this.position = {
            x: 0,
            y: 0
        };
        this.size = {
            height: 300,
            width: 10
        };
    }
    BatComponent.prototype.keyUpEvent = function (event) {
        if (this.leftBat &&
            (this.key &&
                (event.keyCode === KEY_CODE.W_KEY || event.keyCode === KEY_CODE.S_KEY))) {
            this.key = null;
            return;
        }
        if (this.key &&
            (event.keyCode === KEY_CODE.UP_ARROW ||
                event.keyCode === KEY_CODE.DOWN_ARROW)) {
            this.key = null;
        }
    };
    BatComponent.prototype.keyDownEvent = function (event) {
        if (this.leftBat &&
            (!this.key &&
                (event.keyCode === KEY_CODE.D_KEY ||
                    event.keyCode === KEY_CODE.W_KEY ||
                    event.keyCode === KEY_CODE.S_KEY ||
                    event.keyCode === KEY_CODE.A_KEY))) {
            this.key = event.keyCode;
            return;
        }
        if (!this.key &&
            (event.keyCode === KEY_CODE.UP_ARROW ||
                event.keyCode === KEY_CODE.DOWN_ARROW)) {
            this.key = event.keyCode;
        }
    };
    BatComponent.prototype.ngOnInit = function () {
        this.setInitPosition();
    };
    BatComponent.prototype.setInitPosition = function () {
        if (this.leftBat) {
            this.position.x = 20;
            this.position.y = this.gameFieldSize.height / 2 - this.size.height / 2;
        }
        else {
            this.position.x = this.gameFieldSize.width - 20 - this.size.width;
            this.position.y = this.gameFieldSize.height / 2 - this.size.height / 2;
        }
    };
    BatComponent.prototype.calculate = function () {
        if (this.leftBat) {
            this.calculateLeftBatMove();
        }
        else {
            this.calculaterightBatMove();
        }
    };
    BatComponent.prototype.calculateLeftBatMove = function () {
        if (this.key &&
            this.position.y + (this.key === KEY_CODE.W_KEY ? -10 : 10) >= 0 &&
            this.position.y + (this.key === KEY_CODE.W_KEY ? -10 : 10) <=
                this.gameFieldSize.height - this.size.height) {
            this.position.y += this.key === KEY_CODE.W_KEY ? -10 : 10;
        }
        else if (this.leftBat) {
            this.key = null;
        }
    };
    BatComponent.prototype.calculaterightBatMove = function () {
        if (this.key &&
            this.position.y + (this.key === KEY_CODE.UP_ARROW ? -10 : 10) >= 0 &&
            this.position.y + (this.key === KEY_CODE.UP_ARROW ? -10 : 10) <=
                this.gameFieldSize.height - this.size.height) {
            this.position.y += this.key === KEY_CODE.UP_ARROW ? -10 : 10;
        }
        else {
            this.key = null;
        }
    };
    BatComponent.prototype.isUpKeyPressed = function () {
        return (this.key != null &&
            (this.key === KEY_CODE.UP_ARROW || this.key === KEY_CODE.W_KEY));
    };
    BatComponent.prototype.isDownKeyPressed = function () {
        return (this.key != null &&
            (this.key === KEY_CODE.DOWN_ARROW || this.key === KEY_CODE.S_KEY));
    };
    BatComponent.prototype.getPosition = function () {
        return this.position;
    };
    BatComponent.prototype.getSize = function () {
        return this.size;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], BatComponent.prototype, "gameFieldSize", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], BatComponent.prototype, "leftBat", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], BatComponent.prototype, "hit", void 0);
    tslib_1.__decorate([
        HostListener("window:keyup", ["$event"]),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [KeyboardEvent]),
        tslib_1.__metadata("design:returntype", void 0)
    ], BatComponent.prototype, "keyUpEvent", null);
    tslib_1.__decorate([
        HostListener("window:keydown", ["$event"]),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [KeyboardEvent]),
        tslib_1.__metadata("design:returntype", void 0)
    ], BatComponent.prototype, "keyDownEvent", null);
    BatComponent = tslib_1.__decorate([
        Component({
            selector: "app-bat",
            templateUrl: "./bat.component.html",
            styleUrls: ["./bat.component.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], BatComponent);
    return BatComponent;
}());
export { BatComponent };
//# sourceMappingURL=bat.component.js.map