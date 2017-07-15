var Solver = (function () {
    // app is just needed to call the re arrange method
    function Solver(map) {
        this.map = map;
        this.running = false;
    }
    Solver.prototype.click = function () {
        if (!this.running) {
            this.start();
        }
        else {
            this.stop();
        }
    };
    Solver.prototype.start = function () {
        if (!this.running) {
            this.running = true;
            this.solverTickerRef = setInterval(this.solveTicker, 250);
        }
        this.showSolveButton("Stop solving");
    };
    Solver.prototype.stop = function () {
        if (this.running) {
            clearInterval(this.solverTickerRef);
            this.running = false;
            this.showSolveButton("Start solving");
        }
    };
    Solver.prototype.showSolveButton = function (text) {
        document.getElementById('solve').innerHTML = text;
    };
    Solver.prototype.solveTicker = function () {
        console.log("- solve step");
        var moveAt = app.solver.solveStep();
        app.solver.map.moveTileAt(moveAt.x, moveAt.y);
        app.arrangeTiles();
        app.stepsAndTimerHandler.incrementSteps();
    };
    // has to return a Point which is the map position that will be "clicked" by the solver
    Solver.prototype.solveStep = function () {
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
    return Solver;
}());
