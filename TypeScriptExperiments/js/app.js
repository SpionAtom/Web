///<reference path="pixi.js.d.ts" />
var DEBUGMODE = false;
var App = (function () {
    function App(_pixiApp) {
        this.config = { x: 0, y: 0, width: 4, height: 5, tileSize: 1 };
        this.pixiApp = _pixiApp;
        this.currentStage = this.pixiApp.stage;
        this.tileContainer = new PIXI.Container();
        this.currentStage.addChild(this.tileContainer);
        this.tiles = [];
        this.map = [];
        this.empty = { 'x': 0, 'y': 0 };
        this.resizeMap();
        this.resetMap();
    }
    App.prototype.createTiles = function () {
        // remove all tiles            
        this.tileContainer.removeChildren();
        this.tiles = [];
        this.tileContainer.x = this.config.x;
        this.tileContainer.y = this.config.y;
        var i, tileSize = this.config.scale;
        console.log(tileSize);
        for (i = 0; i < this.config.width * this.config.height - 1; i++) {
            var renderTexture = PIXI.RenderTexture.create(tileSize, tileSize);
            var graphics = new PIXI.Graphics();
            // draw a rounded rectangle
            graphics.lineStyle(2, 0xDDDDDD, 1);
            graphics.beginFill(0x878787, 0.25);
            graphics.drawRoundedRect(0, 0, tileSize, tileSize, 15);
            graphics.endFill();
            var labelStyle = new PIXI.TextStyle({
                fontFamily: 'Impact',
                fontSize: 0.6 * tileSize,
                //fontStyle: 'italic',
                fontWeight: 'bold',
                fill: ['#ffffff', '#cccccc'],
                stroke: '#4a1850',
                strokeThickness: 5,
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
                wordWrap: true,
                wordWrapWidth: 440
            });
            var label = new PIXI.Text(i + 1, labelStyle);
            label.anchor.set(0.5);
            label.x = 0.5 * tileSize;
            label.y = 0.5 * tileSize;
            graphics.addChild(label);
            this.pixiApp.renderer.render(graphics, renderTexture);
            var sprite = PIXI.Sprite.from(renderTexture.baseTexture);
            sprite.x = (i % this.config.width) * tileSize;
            sprite.y = (Math.floor(i / this.config.width)) * tileSize;
            sprite.number = i + 1;
            sprite.interactive = true;
            sprite.buttonMode = true;
            this.tiles[i] = sprite;
            this.tiles[i].on('pointerdown', onTileClick);
            this.tileContainer.addChild(sprite);
        }
    };
    App.prototype.resizeMap = function () {
        console.log("resizeMap");
        // read width and height from form
        this.config.width = 4; //document.getElementById('desiredWidth').value;
        this.config.height = 5; //document.getElementById('desiredHeight').value;
        //tileSize = canvasConfig.resolution.height / gameConfig.height;
        this.onWindowResize(window.innerWidth, window.innerHeight);
        console.log("Resizing map: " + this.config.width + " x " + this.config.height);
        // reset arrays
        this.tiles = [];
        this.map = [];
        // create two dimensional array that holds all tiles
        for (var i = 0; i < this.config.width; i++) {
            this.map[i] = [];
        }
        this.createTiles();
        this.resetMap();
    };
    App.prototype.resetMap = function () {
        /*
        // check if resize is neccessary
        if (this.config.width != document.getElementById('desiredWidth').value ||
            this.config.height != document.getElementById('desiredHeight').value
        ) {
            resizeMap();
        }
        */
        // bring the map in order
        console.log("Reset the map array:");
        var n = 1;
        for (var y = 0; y < this.config.height; y++) {
            for (var x = 0; x < this.config.width; x++) {
                this.map[x][y] = n;
                n++;
            }
        }
        // also reset the empty tile position
        this.empty.x = this.config.width - 1;
        this.empty.y = this.config.height - 1;
        this.map[this.empty.x][this.empty.y] = 0;
        this.arrangeTiles();
    };
    App.prototype.arrangeTiles = function () {
        console.log("Arranging the tiles:");
        var out;
        for (var y = 0; y < this.config.height; y++) {
            out = "    ";
            for (var x = 0; x < this.config.width; x++) {
                out += this.map[x][y] + "(" + x + "|" + y + "),";
                if (this.map[x][y] > 0) {
                    this.tiles[this.map[x][y] - 1].x = x * this.config.tileSize;
                    this.tiles[this.map[x][y] - 1].y = y * this.config.tileSize;
                    this.tiles[this.map[x][y] - 1].mapX = x;
                    this.tiles[this.map[x][y] - 1].mapY = y;
                }
            }
            if (DEBUGMODE) {
                console.log(out);
            }
        }
    };
    App.prototype.moveTileAt = function (x, y) {
        console.log("move tile at: " + x + ", " + y);
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
    };
    App.prototype.scrambleMap = function () {
        var times = 1000;
        for (var i = 0; i < times; i++) {
            var inX = this.empty.x;
            var inY = this.empty.y;
            if (Math.floor(Math.random() * 2) == 1) {
                do {
                    inX = Math.floor(Math.random() * this.config.width);
                } while (inX == this.empty.x);
            }
            else {
                do {
                    inY = Math.floor(Math.random() * this.config.height);
                } while (inY == this.empty.y);
            }
            this.moveTileAt(inX, inY);
        }
        this.arrangeTiles();
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
        this.config.scale = factor;
        this.pixiApp.renderer.resize(this.config.width * factor + margin, this.config.height * factor + margin);
        this.createTiles();
    };
    return App;
}());
function onTileClick() {
    console.log("Clicked on: " + this.number);
    debugger;
    app.moveTileAt(this.mapX, this.mapY);
    app.arrangeTiles();
}
