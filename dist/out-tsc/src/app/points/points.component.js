import * as tslib_1 from "tslib";
import { Component, Input } from "@angular/core";
var PointsComponent = /** @class */ (function () {
    function PointsComponent() {
    }
    PointsComponent.prototype.ngOnInit = function () { };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PointsComponent.prototype, "leftPlayerPoints", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], PointsComponent.prototype, "rightPlayerPoints", void 0);
    PointsComponent = tslib_1.__decorate([
        Component({
            selector: "app-points",
            templateUrl: "./points.component.html",
            styleUrls: ["./points.component.scss"]
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], PointsComponent);
    return PointsComponent;
}());
export { PointsComponent };
//# sourceMappingURL=points.component.js.map