/**
 * From this abstract solver class you can extend your own fantastic solver.
 * Here you find all you need to know to get started with your solver.
 *
 * First the Point. It's a simple structure to handle the game grid coordinates.
 * interface Point {x:number, y:number} - where x is the column and y is the row.
 *
 * A Solver has a Map which holds all the information about the grid:
 *
 *  map.width   :number     - type number - width of the game grid.
 *  map.height  :number     - height of the game grid.
 *  map.map[][] :number[][] - is a two dimensional array representing the grid.
 *                            so when map.map[2][3] is 7, it means that in the grid
 *                            at column 2, row 3 is a tile with a 7.
 *  empty       :Point      - the map also keeps track of the empty gap in the grid.
 *
 *  step()      :Point      - is the only method that will be called by the SolverHandler.
 *                            It has to return grid coordinates of the tile that
 *                            the solver wants to be moved towards the gap (and therefore
 *                            become the new gap in the grid).
 */
var Solver = (function () {
    function Solver(map) {
        this.map = map;
    }
    return Solver;
}());
var SolverHandler = (function () {
    // app is just needed to call the re arrange method
    function SolverHandler(solver) {
        this.map = solver.map;
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
            this.solverTickerRef = setInterval(this.solveTicker, 1000);
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
        console.log("- check if solved");
        if (app.map.alreadySolved()) {
            console.log("- solved!");
            app.solverHandler.stop();
            app.stepsAndTimerHandler.stop();
        }
        else {
            console.log("- step");
            var moveAt = app.solverHandler.solver.step();
            app.solverHandler.solver.map.moveTileAt(moveAt.x, moveAt.y);
            app.arrangeTiles();
            app.stepsAndTimerHandler.incrementSteps();
        }
    };
    return SolverHandler;
}());