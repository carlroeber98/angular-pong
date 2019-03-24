import * as tslib_1 from "tslib";
import { Component, HostListener, Output, EventEmitter, ViewChild } from "@angular/core";
var GamefieldComponent = /** @class */ (function () {
    function GamefieldComponent() {
        this.size = {
            height: 790,
            width: 1500
        };
        this.goalEvent = new EventEmitter();
    }
    GamefieldComponent.prototype.onResize = function (event) {
        this.size.height = window.innerHeight * 0.8;
        this.size.width = window.innerWidth * 0.85;
    };
    GamefieldComponent.prototype.ngOnInit = function () {
        // this.onResize();
    };
    GamefieldComponent.prototype.calculateMoves = function (movement) {
        // TODO:Fix bug if the ball hits the bat not at the right site (if the angle is too big the ball hit the bat
        // but x * -1 + 1is not workinkg and gets called multiple times because the ball is still inside the bat range)
        for (var l = 0; l < Math.abs(movement.direction.x); l++) {
            // calculate new ball position
            this.calculateBall(movement);
            if (this.ball.getPosition().x <= 0) {
                this.goalEvent.emit(true);
                return;
            }
            if (this.ball.getPosition().x >=
                this.size.width - this.ball.getDiameter()) {
                this.goalEvent.emit(false);
                return;
            }
            var leftBatHit = this.checkHitLeftBat();
            var rightBatHit = this.checkHitRightBat();
            if (leftBatHit || rightBatHit) {
                movement.direction.x = movement.direction.x * -1;
                if ((leftBatHit || rightBatHit) &&
                    (this.leftBat.isUpKeyPressed() || this.rightBat.isUpKeyPressed())) {
                    movement.direction.y -= 3;
                }
                else if ((leftBatHit || rightBatHit) &&
                    (this.leftBat.isDownKeyPressed() || this.rightBat.isDownKeyPressed())) {
                    movement.direction.y += 3;
                }
            }
        }
        for (var l = 0; l < Math.abs(movement.direction.y); l++) {
            if (movement.direction.y < 0) {
                this.ball.getPosition().y--;
            }
            else {
                this.ball.getPosition().y++;
            }
            if (this.checkHitTopOrBottom()) {
                movement.direction.y = movement.direction.y * -1;
            }
        }
        // render the bats
        this.calculateBats();
        return movement;
    };
    GamefieldComponent.prototype.checkHitTopOrBottom = function () {
        if (this.ball.getPosition().y <= 0 ||
            this.ball.getPosition().y >= this.size.height - this.ball.getDiameter()) {
            // getter ball diameter
            return true;
        }
        return false;
    };
    GamefieldComponent.prototype.checkHitLeftBat = function () {
        var _this = this;
        if (this.ball.getPosition().x <=
            this.leftBat.getPosition().x + this.leftBat.getSize().width &&
            this.ball.getPosition().y >= this.leftBat.getPosition().y &&
            this.ball.getPosition().y + this.ball.getDiameter() <=
                this.leftBat.getPosition().y + this.leftBat.getSize().height) {
            this.leftBatHit = true;
            setTimeout(function () {
                _this.leftBatHit = false;
            }, 200);
            return true;
        }
        return false;
    };
    GamefieldComponent.prototype.checkHitRightBat = function () {
        var _this = this;
        if (this.ball.getPosition().x >=
            this.size.width -
                (this.rightBat.getPosition().x + this.rightBat.getSize().width) &&
            this.ball.getPosition().y >= this.rightBat.getPosition().y &&
            this.ball.getPosition().y + this.ball.getDiameter() <=
                this.rightBat.getPosition().y + this.rightBat.getSize().height) {
            this.rightBatHit = true;
            setTimeout(function () {
                _this.rightBatHit = false;
            }, 200);
            return true;
        }
        return false;
    };
    GamefieldComponent.prototype.reset = function () {
        this.ball.setInitPosition();
        this.leftBat.setInitPosition();
        this.rightBat.setInitPosition();
    };
    GamefieldComponent.prototype.calculateBats = function () {
        this.leftBat.calculate();
        this.leftBat.calculate();
    };
    GamefieldComponent.prototype.calculateBall = function (movement) {
        this.ball.calculate(movement);
    };
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], GamefieldComponent.prototype, "goalEvent", void 0);
    tslib_1.__decorate([
        ViewChild("ball"),
        tslib_1.__metadata("design:type", Object)
    ], GamefieldComponent.prototype, "ball", void 0);
    tslib_1.__decorate([
        ViewChild("leftBat"),
        tslib_1.__metadata("design:type", Object)
    ], GamefieldComponent.prototype, "leftBat", void 0);
    tslib_1.__decorate([
        ViewChild("rightBat"),
        tslib_1.__metadata("design:type", Object)
    ], GamefieldComponent.prototype, "rightBat", void 0);
    tslib_1.__decorate([
        HostListener("window:resize", ["$event"]),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], GamefieldComponent.prototype, "onResize", null);
    GamefieldComponent = tslib_1.__decorate([
        Component({
            selector: "app-gamefield",
            templateUrl: "./gamefield.component.html",
            styleUrls: ["./gamefield.component.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], GamefieldComponent);
    return GamefieldComponent;
}());
export { GamefieldComponent };
//# sourceMappingURL=gamefield.component.js.map