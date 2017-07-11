'use strict';

    // Basic Canvas settings
    var config = {
      'resolution': { 'width': 800, 'height': 480 },
      backgroundColor: 0x9B9B67,
      framesPerSeconds: 60
    };
    var rootStage, renderer;

    // Timer
    var lastUpdated = 0, updateWaitTime = 1000 / config.framesPerSeconds;

window.onload = init;

function init() {    
    var render = setup(config);
    render();    
}

function setup(_config) {    
    renderer = new PIXI.CanvasRenderer(_config.resolution.width, _config.resolution.height);
    renderer.backgroundColor = _config.backgroundColor;

    var canvasBox = document.getElementById('CanvasBox');
    canvasBox.appendChild(renderer.view);
    rootStage = new PIXI.Container();
    build();
    return render;
}

function build() {
    // button actions
    document.getElementById("reset").addEventListener("click", resetMap);
    document.getElementById("scramble").addEventListener("click", scrambleMap);

    document.getElementById("desiredWidth").value = 5;
    document.getElementById("desiredHeight").value = 4;

    var graphics = new PIXI.Graphics();
    rootStage.addChild(graphics);
    initGame(rootStage, config);



}

function render() {
    update();
    renderer.render(rootStage);
    requestAnimationFrame(render);
}

function update() {

    // update timer
    var ms = new Date().getTime();
    if (ms - lastUpdated > updateWaitTime) {
      lastUpdated = ms;
    } else {
      return;
    }

    // do stuff
    
    
}