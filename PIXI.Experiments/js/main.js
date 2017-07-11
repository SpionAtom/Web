'use strict';

window.onload = init;

function init() {    
    var render = setup(config);
    render();    
}

function setup(_config) {    
    renderer = new PIXI.CanvasRenderer(_config.resolution.width, _config.resolution.height);
    renderer.backgroundColor = _config.backgroundColor;

    canvasBox = document.getElementById('CanvasBox');
    canvasBox.appendChild(renderer.view);
    rootStage = new PIXI.Container();
    build();
    return render;
}

function build() {
    var graphics = new PIXI.Graphics();
    rootStage.addChild(graphics);
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