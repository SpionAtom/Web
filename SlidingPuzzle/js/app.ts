///<reference path="pixi.js.d.ts" />
///<reference path="./map.ts" />
///<reference path="./tile.ts" />
///<reference path="./stepsandtimerhandler.ts" />
///<reference path="./solverhandler.ts" />

const DEBUGMODE = false;

    class App {

        pixiApp:PIXI.Application;
        currentStage:PIXI.Container;        
        config;
        tileContainer:PIXI.Container;
        tiles;
        map;
        stepsAndTimerHandler:StepsAndTimerHandler;
        solverHandler;

        constructor(_pixiApp:PIXI.Application) {
            this.config = { x: 0, y: 0, width: 5, height: 5, tileSize: 1};
            this.pixiApp = _pixiApp;
            this.currentStage = this.pixiApp.stage;            
            this.tileContainer = new PIXI.Container();            
            this.currentStage.addChild(this.tileContainer);
            this.tiles = [];            
            this.map = new Map(this.config.width, this.config.height);
            this.createTiles();            
            this.stepsAndTimerHandler = new StepsAndTimerHandler();
            this.solverHandler = new SolverHandler(new SimpleSolver(this.map));
        }

        createTiles(): void {
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
        }

        arrangeTiles() {
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
                            this.tiles[m - 1].y === this.tiles[m - 1].finalY
                        ) {
                            this.tiles[m - 1].sprite.tint = 0xAAFFAA;                            
                        } else {
                            this.tiles[m - 1].sprite.tint = 0xFFAAAA;
                        }
                    }                   
                }
                if (DEBUGMODE) {
                    console.log(out);
                }
            }            
        }

        onWindowResize(newWidth:number, newHeight:number): void {
            var scale:number = newWidth / newHeight;
            var swidth:number = this.config.width * scale;
            var sheight:number = this.config.height * scale;
            if (sheight > newHeight) {
                scale = newHeight / this.config.height;
                swidth = this.config.width * scale;
                sheight = this.config.height * scale;
            }
            
            var factor = (newWidth / this.config.width < newHeight / this.config.height
                 ? newWidth / this.config.width
                 : newHeight / this.config.height);            
            
            var margin = 10;
            this.config.x = 0.5 * margin;//(newWidth - this.config.width * factor) / 2;
            this.config.y = 0.5 * margin;//(newHeight - this.config.height * factor) / 2;
            
            this.config.tileSize = factor;            

            this.pixiApp.renderer.resize(this.config.width * factor + margin, this.config.height * factor + margin);            
            this.createTiles();
        }
        
    }

function onTileClick() {
    var logText:string = "- Clicked on: [" + (this.tile.num + 1) + "]";
              
    
    if (this.tile.x == app.map.gap.x || this.tile.y == app.map.gap.y) {
        logText += ". Moved Tiles";
        app.map.moveTileAt(this.tile.x, this.tile.y);        
        app.arrangeTiles();        
        app.stepsAndTimerHandler.start();    
        app.stepsAndTimerHandler.incrementSteps();    
    }        
    console.log(logText);
    if (app.map.alreadySolved()) {
        console.log("- solved!");
        app.stepsAndTimerHandler.stop();
    }
}


function scramble() {
    console.log("- button: Scramble");
    app.map.scramble();
    app.arrangeTiles();
    app.stepsAndTimerHandler.reset();
    app.solverHandler.stop();

}

function resetGame() {
    console.log("- button: Reset game");
    app.map.order();
    app.arrangeTiles();
    app.stepsAndTimerHandler.reset();
    app.solverHandler.stop();
}

function solveGame() {
    console.log("- button: solve");
    if (!app.solverHandler.running) {
        app.stepsAndTimerHandler.start();
    }
    app.solverHandler.click();
}


