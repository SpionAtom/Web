///<reference path="pixi.js.d.ts" />


const DEBUGMODE = false;

    class App {

        pixiApp:PIXI.Application;
        currentStage:PIXI.Container;        
        config;
        constructor(_pixiApp:PIXI.Application) {
            this.config = { x: 0, y: 0, width: 5, height: 5, tileSize: 1};
            this.pixiApp = _pixiApp;
            this.currentStage = this.pixiApp.stage;            
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
            
        }
        
    }