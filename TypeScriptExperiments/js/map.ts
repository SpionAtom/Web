
class Map {

    map;
    width:number;
    height:number;
    empty;

    constructor(_width:number, _height:number) {
        this.width = _width;
        this.height = _height;
        this.map = [];
        this.resize(_width, _height);
    }

    // Recreate the map array
    // Then order the map
    resize(_width, _height):void {
        console.log("- Resize the map array");
        this.map = [];        
        this.empty = {x: 0, y: 0}
        for (var i = 0; i < _width; i++) {
            this.map[i] = [];
        }
        this.order();        
    }

    // bring the map in order
    order():void {        
        console.log("- Reset the map array");
        var n = 1;
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.map[x][y] = n;
                n++;
            }
        }
        // also reset the empty tile position
        this.empty.x = this.width - 1;
        this.empty.y = this.height - 1;
        this.map[this.empty.x][this.empty.y] = 0;        
    }

    moveTileAt(x:number, y:number):void {        
        //console.log("move tile at: " + x + ", " + y);
        var s, k;

        if (this.empty.y == y) {
            s = sign(x - this.empty.x);
            k = this.empty.x;
            while (k != x) {
                this.map[k][y] = this.map[k + s][y];
                k += s;
            }
            this.empty.x = x;
        }

        if (this.empty.x == x) {
            s = sign(y - this.empty.y);
            k = this.empty.y;
            while (k != y) {
                this.map[x][k] = this.map[x][k + s];
                k += s;
            }
            this.empty.y = y;
        }
        this.map[this.empty.x][this.empty.y] = 0;    
    }

    scramble() {
        var times = 1000;

        for (var i = 0; i < times; i++) {
            var inX = this.empty.x;
            var inY = this.empty.y;
            if (Math.floor(Math.random() * 2) == 1) {
                do {inX = Math.floor(Math.random() * this.width)} while(inX == this.empty.x);
            } else {
                do {inY = Math.floor(Math.random() * this.height)} while(inY == this.empty.y);
            }
            this.moveTileAt(inX, inY);
        }        
    }

}