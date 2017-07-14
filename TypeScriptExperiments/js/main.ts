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
            app = new App(this.pixiApp);
            
            var padding = 32;            
            var canvasRect = this.canvas.getBoundingClientRect();        
            var w = window.innerWidth - padding, h = window.innerHeight - canvasRect.top - padding / 2;            
            this.pixiApp.renderer.resize(w, h);
            app.onWindowResize(w, h);            
            document.getElementById('scramble').addEventListener('click', scramble);
            document.getElementById('reset').addEventListener('click', resetGame);
        }

    onResize = debounce(function() {
            console.log("- window resize");
            var padding = 32;            
            var canvasRect = this.canvas.getBoundingClientRect();        
            var w = window.innerWidth - padding, h = window.innerHeight - canvasRect.top - padding / 2; 
            w = Math.max(w, 320);
            h = Math.max(h, 320);
            this.pixiApp.renderer.resize(w, h);
            app.onWindowResize(w, h);
        }, 250);

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
    window.addEventListener("DOMContentLoaded", windowHandler.init);
    window.addEventListener('resize', windowHandler.onResize);    
    
