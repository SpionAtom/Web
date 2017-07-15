/** From this simple solver class you can extend your own fantastic solver. */
var Solver = (function () {
    function Solver(map) {
        this.map = map;
    }
    return Solver;
}());
var SolverHandler = (function () {
    // app is just needed to call the re arrange method
    function SolverHandler(solver) {
        this.solver = solver;
        this.running = false;
    }
    SolverHandler.prototype.click = function () {
        if (!this.running) {
            this.start();
        }
        else {
            this.stop();
        }
    };
    SolverHandler.prototype.start = function () {
        if (!this.running) {
            this.running = true;
            this.solverTickerRef = setInterval(this.solveTicker, 250);
        }
        this.showSolveButton("Stop solving");
    };
    SolverHandler.prototype.stop = function () {
        if (this.running) {
            clearInterval(this.solverTickerRef);
            this.running = false;
            this.showSolveButton("Start solving");
        }
    };
    SolverHandler.prototype.showSolveButton = function (text) {
        document.getElementById('solve').innerHTML = text;
    };
    SolverHandler.prototype.solveTicker = function () {
        console.log("- solve step");
        var moveAt = app.solverHandler.solver.solveNextStep();
        app.solverHandler.solver.map.moveTileAt(moveAt.x, moveAt.y);
        app.arrangeTiles();
        app.stepsAndTimerHandler.incrementSteps();
    };
    return SolverHandler;
}());
