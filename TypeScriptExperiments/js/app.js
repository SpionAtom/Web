///<reference path="pixi.js.d.ts" />
///<reference path="./map.ts" />
///<reference path="./tile.ts" />
var DEBUGMODE = false;
var App = (function () {
    function App(_pixiApp) {
        this.config = { x: 0, y: 0, width: 5, height: 5, tileSize: 1 };
        this.pixiApp = _pixiApp;
        this.currentStage = this.pixiApp.stage;
        this.tileContainer = new PIXI.Container();
        this.currentStage.addChild(this.tileContainer);
        this.tiles = [];
        this.map = new Map(this.config.width, this.config.height);
        this.createTiles();
    }
    App.prototype.createTiles = function () {
        // remove all tiles            
        this.tileContainer.removeChildren();
        this.tiles = [];
        this.tileContainer.x = this.config.x;
        this.tileContainer.y = this.config.y;
        var i, tileSize = this.config.scale;
        for (i = 0; i < this.config.width * this.config.height - 1; i++) {
            this.tiles[i] = new Tile(this, i);
            this.tiles[i].sprite.on('pointerdown', onTileClick);
            this.tileContainer.addChild(this.tiles[i].sprite);
        }
        this.arrangeTiles();
    };
    App.prototype.arrangeTiles = function () {
        console.log("Arranging the tiles:");
        var out;
        for (var y = 0; y < this.config.height; y++) {
            out = "    ";
            for (var x = 0; x < this.config.width; x++) {
                out += this.map.map[x][y] + "(" + x + "|" + y + "),";
                if (this.map.map[x][y] > 0) {
                    this.tiles[this.map.map[x][y] - 1].sprite.x = x * this.config.tileSize;
                    this.tiles[this.map.map[x][y] - 1].sprite.y = y * this.config.tileSize;
                    this.tiles[this.map.map[x][y] - 1].x = x;
                    this.tiles[this.map.map[x][y] - 1].y = y;
                }
            }
            if (DEBUGMODE) {
                console.log(out);
            }
        }
    };
    App.prototype.onWindowResize = function (newWidth, newHeight) {
        var scale = newWidth / newHeight;
        var swidth = this.config.width * scale;
        var sheight = this.config.height * scale;
        if (sheight > newHeight) {
            scale = newHeight / this.config.height;
            swidth = this.config.width * scale;
            sheight = this.config.height * scale;
        }
        var factor = (newWidth / this.config.width < newHeight / this.config.height
            ? newWidth / this.config.width
            : newHeight / this.config.height);
        var margin = 10;
        this.config.x = 0.5 * margin; //(newWidth - this.config.width * factor) / 2;
        this.config.y = 0.5 * margin; //(newHeight - this.config.height * factor) / 2;
        this.config.tileSize = factor;
        this.pixiApp.renderer.resize(this.config.width * factor + margin, this.config.height * factor + margin);
        this.createTiles();
    };
    return App;
}());
function onTileClick() {
    console.log("Clicked on: " + this.tile.num);
    app.map.moveTileAt(this.tile.x, this.tile.y);
    app.arrangeTiles();
}
function scramble() {
    console.log("Scramble");
    app.map.scramble();
    app.arrangeTiles();
}
