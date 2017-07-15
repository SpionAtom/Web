/**
 * A Map represents the game grid.
 * 
 * At its core there is the two dimensional array.
 * 
 *  map.width   :number     - type number - width of the game grid.
 *  map.height  :number     - height of the game grid.
 *  map.map[][] :number[][] - is a two dimensional array representing the grid.
 *                            so when map.map[2][3] is 7, it means that in the grid
 *                            at column 2, row 3 is a tile with a 7.
 *  gap         :Point      - the map also keeps track of the empty gap in the grid.
 */
class Map {

    map;
    width:number;
    height:number;
    gap:Point;

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
        this.gap = {x: 0, y: 0}
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
        this.gap.x = this.width - 1;
        this.gap.y = this.height - 1;
        this.map[this.gap.x][this.gap.y] = 0;        
    }

    moveTileAt(x:number, y:number):void {        
        //console.log("move tile at: " + x + ", " + y);
        var s, k;

        if (this.gap.y == y) {
            s = sign(x - this.gap.x);
            k = this.gap.x;
            while (k != x) {
                this.map[k][y] = this.map[k + s][y];
                k += s;
            }
            this.gap.x = x;
        }

        if (this.gap.x == x) {
            s = sign(y - this.gap.y);
            k = this.gap.y;
            while (k != y) {
                this.map[x][k] = this.map[x][k + s];
                k += s;
            }
            this.gap.y = y;
        }
        this.map[this.gap.x][this.gap.y] = 0;    
    }

    scramble() {
        var times = 1000;

        for (var i = 0; i < times; i++) {
            var inX = this.gap.x;
            var inY = this.gap.y;
            if (Math.floor(Math.random() * 2) == 1) {
                do {inX = Math.floor(Math.random() * this.width)} while(inX == this.gap.x);
            } else {
                do {inY = Math.floor(Math.random() * this.height)} while(inY == this.gap.y);
            }
            this.moveTileAt(inX, inY);
        }        
    }

    /**
     * Check if the array is solved/sorted.
     * That is the case if the last unsorted tile would be
     * the tile in the bottom right.
     * (If the map is 5x5, tile 25 would be the tile in the
     * bottom right.)
     */
    alreadySolved():boolean {
        let i = 1, x = 0, y = 0;        
        while (this.map[x][y] === i) {
            i++;
            x = (i - 1) % this.width;
            y = Math.floor((i - 1) / this.width);
        }
        return i === this.width * this.height;
    }

}