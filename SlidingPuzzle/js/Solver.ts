class SimpleSolver extends Solver {

    map:Map;
    constructor(map:Map) {
        super(map);        
    }

    solveNextStep():Point {

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