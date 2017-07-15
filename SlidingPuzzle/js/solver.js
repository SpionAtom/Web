var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SimpleSolver = (function (_super) {
    __extends(SimpleSolver, _super);
    function SimpleSolver(map) {
        return _super.call(this, map) || this;
    }
    SimpleSolver.prototype.solveNextStep = function () {
        console.log("- doesn't really solve, just moves random (like in the scramble method from map");
        var inX = this.map.empty.x;
        var inY = this.map.empty.y;
        if (Math.floor(Math.random() * 2) == 1) {
            do {
                inX = Math.floor(Math.random() * this.map.width);
            } while (inX == this.map.empty.x);
        }
        else {
            do {
                inY = Math.floor(Math.random() * this.map.height);
            } while (inY == this.map.empty.y);
        }
        return { x: inX, y: inY };
    };
    return SimpleSolver;
}(Solver));
