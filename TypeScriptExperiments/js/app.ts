///<reference path="pixi.js.d.ts" />

    class App {

        currentStage;
        config;

        constructor(_stage) {
            this.currentStage = _stage;
            this.config = { x: 0, y: 0, width: 4, height: 4};
        }

        onResize(newWidth:number, newHeight:number): void {
            var scale:number = newWidth / newHeight;
            var swidth:number = this.config.width * scale;
            var sheight:number = this.config.height * scale;
            if (sheight > newHeight) {
                scale = newHeight / this.config.height;
                swidth = this.config.width * scale;
                sheight = this.config.height * scale;
            }
            this.config.x = (newWidth - swidth) / 2;
            this.config.y = (newHeight - sheight) / 2;
            
            var factor = 20;
            var graphics = new PIXI.Graphics();
                    graphics.lineStyle(2, 0x0000FF, 1);
                    graphics.beginFill(0xFF700B, 1);
                    graphics.drawRect(this.config.x, this.config.y, swidth, sheight);
            
            this.currentStage.addChild(graphics);
            console.log(newWidth, newHeight);
        }
    }
