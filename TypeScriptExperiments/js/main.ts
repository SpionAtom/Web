///<reference path="pixi.js.d.ts" />
///<reference path="./config.ts" />
///<reference path="./app.ts" />



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

            app = new App(this.pixiApp.stage);
        }

        onResize():void {
            var padding = 32;
            var w = window.innerWidth, h = window.innerHeight;
            var canvasRect = this.canvas.getBoundingClientRect();        
            this.pixiApp.renderer.resize(w - padding, h - canvasRect.top - padding / 2);
            app.onResize(w, h);
        }
    }

        var applicationConfig:IapplicationConfig = {
            resolution: {
                width: 320,
                height: 240,
                ratio: 640. / 480.
            },
            backgroundColor: 0x474758,
            framesPerSeconds: 60
        }


    var windowHandler:WindowHandler = new WindowHandler();
    var app:App;
    window.addEventListener("load", windowHandler.init);
    window.addEventListener('resize', windowHandler.onResize);
