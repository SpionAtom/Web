"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="pixi.js.d.ts" />
//declare AppConfig = IapplicationConfig;
//import IapplicationConfig = IapplicationConfig;
var app_1 = require("./app");
var WindowHandler = (function () {
    function WindowHandler() {
    }
    WindowHandler.prototype.init = function () {
        console.log("Initialisierung...");
        this.pixiApp = new PIXI.Application(applicationConfig.resolution.width, applicationConfig.resolution.height, { backgroundColor: applicationConfig.backgroundColor });
        this.canvas = document.getElementById("CanvasBox");
        this.canvas.appendChild(this.pixiApp.view);
    };
    WindowHandler.prototype.onResize = function () {
        var padding = 32;
        var w = window.innerWidth, h = window.innerHeight;
        var canvasRect = this.canvas.getBoundingClientRect();
        this.pixiApp.renderer.resize(w - padding, h - canvasRect.top - padding / 2);
        app.onResize(w, h);
    };
    return WindowHandler;
}());
exports.WindowHandler = WindowHandler;
var applicationConfig = {
    resolution: {
        width: 320,
        height: 240,
        ratio: 640. / 480.
    },
    backgroundColor: 0x474758,
    framesPerSeconds: 60
};
var windowHandler = new WindowHandler();
var app = new app_1.App(windowHandler.pixiApp.stage);
window.addEventListener("load", windowHandler.init);
window.addEventListener('resize', windowHandler.onResize);
