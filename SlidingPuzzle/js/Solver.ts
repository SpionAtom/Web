interface ISolver {

}

class Solver implements ISolver {
    
    app;
    map:Map;
    running;
    solverTickerRef;

    // app is just needed to call the re arrange method
    constructor(map:Map) {
        this.map = map;       
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
        let moveAt:Point = app.solver.solveStep();
        app.solver.map.moveTileAt(moveAt.x, moveAt.y);
        app.arrangeTiles();
        app.stepsAndTimerHandler.incrementSteps();
    }

    // has to return a Point which is the map position that will be "clicked" by the solver
    solveStep():Point {

        console.log("- doesn't really solve, just moves random (like in the scramble method from map");
        var inX = this.map.empty.x;
        var inY = this.map.empty.y;
        if (Math.floor(Math.random() * 2) == 1) {
            do {inX = Math.floor(Math.random() * this.map.width)} while(inX == this.map.empty.x);
        } else {
            do {inY = Math.floor(Math.random() * this.map.height)} while(inY == this.map.empty.y);
        }

        return {x: inX, y: inY};
    }


}