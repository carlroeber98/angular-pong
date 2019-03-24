import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from "@angular/core";
var AppComponent = /** @class */ (function () {
    function AppComponent(cdr) {
        this.cdr = cdr;
        this.leftPlayerPoints = 0;
        this.rightPlayerPoints = 0;
        this.gameIsRunning = false;
        this.movement = {
            speed: 2,
            direction: {
                x: 1,
                y: 0
            }
        };
    }
    AppComponent.prototype.startGame = function () {
        //this.calculateRandomMovement();
        console.log(this.movement);
        if (!this.gameIsRunning) {
            this.gameIsRunning = true;
            this.nextMove();
        }
    };
    AppComponent.prototype.nextMove = function () {
        var _this = this;
        if (!this.gameIsRunning) {
            return;
        }
        var newMovement = this.gameField.calculateMoves(this.movement);
        // Render actual positions
        this.cdr.detectChanges();
        if (newMovement == null) {
            this.gameIsRunning = false;
            return;
        }
        else {
            this.movement = newMovement;
        }
        // Render new position
        setTimeout(function () {
            _this.nextMove();
        }, 1000 / 16 / this.movement.speed);
    };
    AppComponent.prototype.goalEvent = function (leftGoal) {
        if (leftGoal) {
            this.rightPlayerPoints++;
        }
        else {
            this.leftPlayerPoints++;
        }
        this.resetField();
    };
    AppComponent.prototype.resetField = function () {
        this.gameIsRunning = false;
        if (this.leftPlayerPoints === 6) {
            alert("Player 1 won the game");
            this.resetGame();
            return;
        }
        if (this.rightPlayerPoints === 6) {
            alert("Player 2 won the game");
            this.resetGame();
            return;
        }
        this.gameField.reset();
        this.movement.direction.x = 0;
        this.movement.direction.y = 0;
        this.cdr.detectChanges();
    };
    AppComponent.prototype.calculateRandomMovement = function () {
        var randomNumber = Math.round((Math.random() * 4 - 2) * 100000) / 100000;
        while (this.movement.direction.x === 0 || this.movement.direction.y === 0) {
            this.movement.direction.y = Math.floor(Math.random() * 13) - 6;
            while ((randomNumber < 0 && randomNumber > -1) ||
                (randomNumber > 0 && randomNumber < 1)) {
                randomNumber = Math.round((Math.random() * 4 - 2) * 100000) / 100000;
            }
            this.movement.direction.x = this.movement.direction.y * randomNumber;
        }
        this.movement.speed = 6 / Math.abs(randomNumber);
    };
    AppComponent.prototype.resetGame = function () {
        this.gameIsRunning = false;
        this.leftPlayerPoints = 0;
        this.rightPlayerPoints = 0;
        this.resetField();
    };
    tslib_1.__decorate([
        ViewChild("gamefield"),
        tslib_1.__metadata("design:type", Object)
    ], AppComponent.prototype, "gameField", void 0);
    AppComponent = tslib_1.__decorate([
        Component({
            selector: "app-root",
            templateUrl: "./app.component.html",
            styleUrls: ["./app.component.scss"],
            changeDetection: ChangeDetectionStrategy.OnPush
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map