var Map = (function () {
    function Map(_width, _height) {
        this.width = _width;
        this.height = _height;
        this.map = [];
        this.resize(_width, _height);
    }
    // Recreate the map array
    // Then order the map
    Map.prototype.resize = function (_width, _height) {
        console.log("- Resize the map array");
        this.map = [];
        this.empty = { x: 0, y: 0 };
        for (var i = 0; i < _width; i++) {
            this.map[i] = [];
        }
        this.order();
    };
    // bring the map in order
    Map.prototype.order = function () {
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
    };
    Map.prototype.moveTileAt = function (x, y) {
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
    };
    Map.prototype.scramble = function () {
        var times = 1000;
        for (var i = 0; i < times; i++) {
            var inX = this.empty.x;
            var inY = this.empty.y;
            if (Math.floor(Math.random() * 2) == 1) {
                do {
                    inX = Math.floor(Math.random() * this.width);
                } while (inX == this.empty.x);
            }
            else {
                do {
                    inY = Math.floor(Math.random() * this.height);
                } while (inY == this.empty.y);
            }
            this.moveTileAt(inX, inY);
        }
    };
    return Map;
}());
///<reference path="pixi.js.d.ts" />
var Tile = (function () {
    function Tile(app, _num) {
        this.x = 0;
        this.y = 0;
        this.finalX = (_num % app.config.width);
        this.finalY = (Math.floor(_num / app.config.width));
        this.num = _num;
        this.sprite = this.createSprite(app, _num);
    }
    Tile.prototype.createSprite = function (app, num) {
        var tileSize = app.config.tileSize;
        var renderTexture = PIXI.RenderTexture.create(tileSize, tileSize);
        var graphics = new PIXI.Graphics();
        var margin = 3;
        // draw a rounded rectangle
        //graphics.lineStyle(2, 0xDDDDDD, 1);
        graphics.beginFill(0x878787);
        graphics.drawRect(margin, margin, tileSize - 2 * margin, tileSize - 2 * margin);
        graphics.endFill();
        var labelStyle = new PIXI.TextStyle({
            fontFamily: 'Nunito',
            fontSize: 0.6 * tileSize,
            //fontStyle: 'italic',
            fontWeight: 'bold',
            fill: 'white'
            //fill: ['#ffffff', '#cccccc'], // gradient
            //stroke: '#4a1850',
            //strokeThickness: 5,
            //dropShadow: true,
            //dropShadowColor: '#000000',
            //dropShadowBlur: 4,
            //dropShadowAngle: Math.PI / 6,
            //dropShadowDistance: 6,
            //wordWrap: true,
            //wordWrapWidth: 440
        });
        var label = new PIXI.Text(String(num + 1), labelStyle);
        label.anchor.set(0.5);
        label.x = 0.5 * tileSize;
        label.y = 0.5 * tileSize;
        graphics.addChild(label);
        app.pixiApp.renderer.render(graphics, renderTexture);
        var sprite = PIXI.Sprite.from(renderTexture.baseTexture);
        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.tile = this;
        return sprite;
    };
    return Tile;
}());
var StepsAndTimerHandler = (function () {
    function StepsAndTimerHandler() {
        this.seconds = 0;
        this.steps = 0;
        this.running = false;
    }
    StepsAndTimerHandler.prototype.start = function () {
        if (!this.running) {
            this.running = true;
            this.seconds = 0;
            this.steps = 0;
            this.secondsTickerRef = setInterval(this.secondsTicker, 1000);
        }
    };
    StepsAndTimerHandler.prototype.reset = function () {
        clearInterval(this.secondsTickerRef);
        this.seconds = 0;
        this.steps = 0;
        this.showSeconds();
        this.running = false;
        this.showSteps();
        this.showSeconds();
    };
    StepsAndTimerHandler.prototype.secondsTicker = function () {
        app.stepsAndTimerHandler.seconds++;
        app.stepsAndTimerHandler.showSeconds();
    };
    StepsAndTimerHandler.prototype.incrementSteps = function () {
        this.steps++;
        this.showSteps();
    };
    StepsAndTimerHandler.prototype.showSeconds = function () {
        document.getElementById('seconds').innerHTML = String(this.seconds);
    };
    StepsAndTimerHandler.prototype.showSteps = function () {
        document.getElementById('steps').innerHTML = String(this.steps);
    };
    return StepsAndTimerHandler;
}());
///<reference path="pixi.js.d.ts" />
///<reference path="./map.ts" />
///<reference path="./tile.ts" />
///<reference path="./stepsandtimerhandler.ts" />
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
        this.stepsAndTimerHandler = new StepsAndTimerHandler();
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
        //console.log("- Arranging the tiles");            
        var out;
        for (var y = 0; y < this.config.height; y++) {
            out = "    ";
            for (var x = 0; x < this.config.width; x++) {
                var m = this.map.map[x][y];
                out += m + "(" + x + "|" + y + "),";
                if (m > 0) {
                    this.tiles[m - 1].sprite.x = x * this.config.tileSize;
                    this.tiles[m - 1].sprite.y = y * this.config.tileSize;
                    this.tiles[m - 1].x = x;
                    this.tiles[m - 1].y = y;
                    // special tinting if on final position
                    if (this.tiles[m - 1].x === this.tiles[m - 1].finalX &&
                        this.tiles[m - 1].y === this.tiles[m - 1].finalY) {
                        this.tiles[m - 1].sprite.tint = 0xAAFFAA;
                    }
                    else {
                        this.tiles[m - 1].sprite.tint = 0xFFAAAA;
                    }
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
    var logText = "- Clicked on: [" + (this.tile.num + 1) + "]";
    if (this.tile.x == app.map.empty.x || this.tile.y == app.map.empty.y) {
        logText += ". Moved Tiles";
        app.map.moveTileAt(this.tile.x, this.tile.y);
        app.arrangeTiles();
        app.stepsAndTimerHandler.start();
        app.stepsAndTimerHandler.incrementSteps();
    }
    console.log(logText);
}
function scramble() {
    console.log("- Scramble");
    app.map.scramble();
    app.arrangeTiles();
    app.stepsAndTimerHandler.reset();
}
function resetGame() {
    console.log("- Reset game");
    app.map.order();
    app.arrangeTiles();
    app.stepsAndTimerHandler.reset();
}
var applicationConfig = {
    resolution: {
        width: 240,
        height: 240,
    },
    backgroundColor: 0x474758,
    framesPerSeconds: 60
};
function sign(n) {
    if (n > 0) {
        return 1;
    }
    else if (n === 0) {
        return 0;
    }
    else {
        return -1;
    }
}
// from: https://davidwalsh.name/javascript-debounce-function
//
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}
;
///<reference path="pixi.js.d.ts" />
///<reference path="webfontloader.d.ts" />
///<reference path="./globals.ts" />
///<reference path="./config.ts" />
///<reference path="./app.ts" />
var WindowHandler = (function () {
    function WindowHandler() {
        this.onResize = debounce(function () {
            console.log("- window resize");
            var padding = 32;
            var canvasRect = windowHandler.canvas.getBoundingClientRect();
            var w = window.innerWidth - padding, h = window.innerHeight - canvasRect.top - padding / 2;
            w = Math.max(w, 240);
            h = Math.max(h, 240);
            windowHandler.pixiApp.renderer.resize(w, h);
            app.onWindowResize(w, h);
        }, 250);
    }
    WindowHandler.prototype.init = function () {
        console.log("Initialisierung...");
        this.pixiApp = new PIXI.Application(applicationConfig.resolution.width, applicationConfig.resolution.height, { backgroundColor: applicationConfig.backgroundColor });
        this.canvas = document.getElementById("CanvasBox");
        this.canvas.appendChild(this.pixiApp.view);
        app = new App(this.pixiApp);
        var padding = 32;
        var canvasRect = this.canvas.getBoundingClientRect();
        var w = window.innerWidth - padding, h = window.innerHeight - canvasRect.top - padding / 2;
        this.pixiApp.renderer.resize(w, h);
        app.onWindowResize(w, h);
        document.getElementById('scramble').addEventListener('click', scramble);
        document.getElementById('reset').addEventListener('click', resetGame);
    };
    return WindowHandler;
}());
var windowHandler = new WindowHandler();
var app;
window.addEventListener('resize', windowHandler.onResize);
// http://www.enea.sk/blog/preloading-web-font-pixi.js.html
var fontName = 'Nunito';
window.onload = function () {
    WebFont.load({
        // this event is triggered when the fonts have been rendered, see https://github.com/typekit/webfontloader
        active: function () {
            // let browser take a breath. Some fonts may require more room for taking deep breath
            setTimeout(function () {
                windowHandler.init();
            }, 500);
        },
        // when font is loaded do some magic, so font can be correctly rendered immediately after PIXI is initialized
        fontloading: doMagic,
        // multiple fonts can be passed here
        google: {
            families: [fontName]
        }
    });
};
// this one is important
function doMagic() {
    // create <p> tag with our font and render some text secretly. We don't need to see it after all...
    var el = document.createElement('p');
    el.style.fontFamily = fontName;
    el.style.fontSize = "0px";
    el.style.visibility = "hidden";
    el.innerHTML = '.';
    document.body.appendChild(el);
}
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGluZ3B1enpsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hcC50cyIsInRpbGUudHMiLCJzdGVwc2FuZHRpbWVyaGFuZGxlci50cyIsImFwcC50cyIsImNvbmZpZy50cyIsImdsb2JhbHMudHMiLCJtYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0lBT0ksYUFBWSxNQUFhLEVBQUUsT0FBYztRQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztRQUN0QixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCx5QkFBeUI7SUFDekIscUJBQXFCO0lBQ3JCLG9CQUFNLEdBQU4sVUFBTyxNQUFNLEVBQUUsT0FBTztRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUE7UUFDekIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNyQixDQUFDO1FBQ0QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRCx5QkFBeUI7SUFDekIsbUJBQUssR0FBTDtRQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDVixHQUFHLENBQUMs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