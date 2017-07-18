///<reference path="pixi.js.d.ts" />
var DEBUGMODE = false;
var App = (function () {
    function App(_pixiApp) {
        this.config = { x: 0, y: 0, width: 5, height: 5, tileSize: 1 };
        this.pixiApp = _pixiApp;
        this.currentStage = this.pixiApp.stage;
    }
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
    };
    return App;
}());
