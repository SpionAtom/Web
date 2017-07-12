///<reference path="pixi.js.d.ts" />

class WindowHandler {
    pixiApp;
    canvas;

    constructor() {
    }

    init():void {
        console.log("Initialisierung...");
        this.pixiApp = new PIXI.Application(
            applicationConfig.resolution.width,
            applicationConfig.resolution.height,
            {backgroundColor: applicationConfig.backgroundColor}
        );
        this.canvas = document.getElementById("CanvasBox");
        this.canvas.appendChild(this.pixiApp.view);        
    }

    onResize():void {
        var padding = 32;
        var w = window.innerWidth, h = window.innerHeight;
        var canvasRect = this.canvas.getBoundingClientRect();        
        this.pixiApp.renderer.resize(w - padding, h - canvasRect.top - padding / 2);
    }
}

var windowHandler:WindowHandler = new WindowHandler();
window.addEventListener("load", windowHandler.init);
window.addEventListener('resize', windowHandler.onResize);