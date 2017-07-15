/** From this simple solver class you can extend your own fantastic solver. */
abstract class Solver {
    map:Map;
    constructor(map:Map) {
        this.map = map;
    }
    /** 
     * Here is where the magic happens step by step.
     * The idea is that each time the solver moves tiles
     * the moved tile coordinates will be returned as a point.
     * So everything can handled by the solverHandler and
     * therefore can be seen live.
     */
    abstract solveNextStep():Point;
}

class SolverHandler {    
        
    running;
    solverTickerRef;
    solver;

    // app is just needed to call the re arrange method
    constructor(solver:Solver) {        
        this.solver = solver;       
        this.running = false;
    }

    click() {
        if (!this.running) {
            this.start();
        } else {
            this.stop();
        }
    }
 
    start() {
        if (!this.running) {
            this.running = true;            
            this.solverTickerRef = setInterval(this.solveTicker, 250); 
        }
        this.showSolveButton("Stop solving");        
    }

    stop () {
        if (this.running) {
            clearInterval(this.solverTickerRef);    
            this.running = false;
            this.showSolveButton("Start solving"); 
        }
    }

    showSolveButton(text:string) {
        document.getElementById('solve').innerHTML = text;
    }

    solveTicker() {
        console.log("- solve step");
        let moveAt:Point = app.solverHandler.solver.solveNextStep();
        app.solverHandler.solver.map.moveTileAt(moveAt.x, moveAt.y);
        app.arrangeTiles();
        app.stepsAndTimerHandler.incrementSteps();
    }

}