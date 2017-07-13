"use strict";
///<reference path="pixi.js.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var App = (function () {
    function App(_stage) {
        this.currentStage = _stage;
        this.config = { x: 0, y: 0, width: 4, height: 4 };
    }
    App.prototype.onResize = function (newWidth, newHeight) {
        var scale = newWidth / newHeight;
        var swidth = this.config.width * scale;
        var sheight = this.config.height * scale;
        if (sheight > newHeight) {
            scale = newHeight / this.config.height;
            swidth = this.config.width * scale;
            sheight = this.config.height * scale;
        }
        this.config.x = (newWidth - swidth) / 2;
        this.config.y = (newHeight - sheight) / 2;
        var graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0x0000FF, 1);
        graphics.beginFill(0xFF700B, 1);
        graphics.drawRect(50, 250, 120, 120);
        this.currentStage.addChild(graphics);
    };
    return App;
}());
exports.App = App;
