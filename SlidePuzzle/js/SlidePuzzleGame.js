'use strict';

    var DEBUGMODE = false;

var gameConfig = {
    'width': 4,
    'height': 4
};

var tile = [];
var map = [], empty = {'x': 0, 'y': 0};

var tileSize;
var tileContainer;
var root;
var canvasConfig;

function initGame(_rootStage, _canvasConfig) {
    root = _rootStage;
    canvasConfig = _canvasConfig;   

    resizeMap();    
    resetMap();    
}

function resizeMap() {    

    // read width and height from form
    gameConfig.width = document.getElementById('desiredWidth').value;
    gameConfig.height = document.getElementById('desiredHeight').value;

    tileSize = canvasConfig.resolution.height / gameConfig.height;

    console.log("Resizing map: " + gameConfig.width + " x " + gameConfig.height);

    // reset arrays
    tile = [];
    map = [];

    // create two dimensional array that holds all tiles
    for (var i = 0; i < gameConfig.width; i++) {
        map[i] = [];
    }

    createTiles();
    rootStage.addChild(tileContainer);    
}

function resetMap() {
    // check if resize is neccessary
    if (gameConfig.width != document.getElementById('desiredWidth').value ||
        gameConfig.height != document.getElementById('desiredHeight').value
    ) {
        resizeMap();
    }

    // bring the map in order
    console.log("Reset the map array:");
    var n = 1;
    for (var y = 0; y < gameConfig.height; y++) {
        for (var x = 0; x < gameConfig.width; x++) {
            map[x][y] = n;
            n++;
        }
    }
    // also reset the empty tile position
    empty.x = gameConfig.width - 1;
    empty.y = gameConfig.height - 1;
    map[empty.x][empty.y] = 0;

    arrangeTiles();
}

function createTiles() {    

    if (tileContainer != null) {
        rootStage.removeChild(tileContainer);
    }
    
    tileContainer = new PIXI.Container();
    tileContainer.x = (canvasConfig.resolution.width - gameConfig.width * tileSize) / 2;

    for (var i = 0; i < gameConfig.width * gameConfig.height - 1; i++) {
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
            fill: ['#ffffff', '#cccccc'], // gradient
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
        graphics.addChild(label)               

        tile[i] = graphics;
        tile[i].number = i + 1;
        tile[i].interactive = true;
        tile[i].buttonMode = true;
        tile[i].on('pointerdown', onTileClick);
        tileContainer.addChild(tile[i]);
    }
}

function arrangeTiles() {
    console.log("Arranging the tiles:");
    var out;    
    for (var y = 0; y < gameConfig.height; y++) {
        out = "    ";
        for (var x = 0; x < gameConfig.width; x++) {
            out += map[x][y] + "(" + x + "|" + y + "),";
            
            if (map[x][y] > 0) {
                tile[map[x][y] - 1].x = x * tileSize;
                tile[map[x][y] - 1].y = y * tileSize;
                tile[map[x][y] - 1].mapX = x;
                tile[map[x][y] - 1].mapY = y;
            }                   
        }
        if (DEBUGMODE) {
            console.log(out);
        }
    }
}

function moveTileAt(x, y) {
    console.log("move tile at: " + x + ", " + y);
    var s, k;

    if (empty.y == y) {
        s = Math.sign(x - empty.x);
        k = empty.x;
        while (k != x) {
            map[k][y] = map[k + s][y];
            k += s;
        }
        empty.x = x;
    }

    if (empty.x == x) {
        s = Math.sign(y - empty.y);
        k = empty.y;
        while (k != y) {
            map[x][k] = map[x][k + s];
            k += s;
        }
        empty.y = y;
    }

    map[empty.x][empty.y] = 0;
}

function scrambleMap() {
    var times = 1000;

    for (var i = 0; i < times; i++) {
        var inX = empty.x;
        var inY = empty.y;
        if (Math.floor(Math.random() * 2) == 1) {
            do {inX = Math.floor(Math.random() * gameConfig.width)} while(inX == empty.x);
        } else {
            do {inY = Math.floor(Math.random() * gameConfig.height)} while(inY == empty.y);
        }
        moveTileAt(inX, inY);
    }
    arrangeTiles();
}

function onTileClick() {
    console.log("Clicked on: " + this.number);
    moveTileAt(this.mapX, this.mapY);
    arrangeTiles();    
}