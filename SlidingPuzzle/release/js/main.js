///<reference path="pixi.js.d.ts" />
///<reference path="webfontloader.d.ts" />
///<reference path="./globals.ts" />
///<reference path="./config.ts" />
///<reference path="./app.ts" />
var WindowHandler = (function () {
    function WindowHandler() {
        this.onResize = debounce(function () {
            console.log("- window resize");
            var padding = 32;
            var canvasRect = windowHandler.canvas.getBoundingClientRect();
            var w = window.innerWidth - padding, h = window.innerHeight - canvasRect.top - padding / 2;
            w = Math.max(w, 240);
            h = Math.max(h, 240);
            windowHandler.pixiApp.renderer.resize(w, h);
            app.onWindowResize(w, h);
        }, 250);
    }
    WindowHandler.prototype.init = function () {
        console.log("Initialisierung...");
        this.pixiApp = new PIXI.Application(applicationConfig.resolution.width, applicationConfig.resolution.height, { backgroundColor: applicationConfig.backgroundColor });
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
        document.getElementById('solve').addEventListener('click', solveGame);
    };
    return WindowHandler;
}());
var windowHandler = new WindowHandler();
var app;
window.addEventListener('resize', windowHandler.onResize);
// http://www.enea.sk/blog/preloading-web-font-pixi.js.html
var fontName = 'Nunito';
window.onload = function () {
    document.body.innerHTML = "<span id='loading' style='color: white;'>Loading web font...</span>" + document.body.innerHTML;
    WebFont.load({
        // this event is triggered when the fonts have been rendered, see https://github.com/typekit/webfontloader
        active: function () {
            // let browser take a breath. Some fonts may require more room for taking deep breath
            setTimeout(function () {
                var loading = document.getElementById('loading');
                loading.parentNode.removeChild(loading);
                ;
                windowHandler.init();
            }, 500);
        },
        // when font is loaded do some magic, so font can be correctly rendered immediately after PIXI is initialized
        fontloading: doMagic,
        // multiple fonts can be passed here
        google: {
            families: [fontName]
        }
    });
};
// this one is important
function doMagic() {
    // create <p> tag with our font and render some text secretly. We don't need to see it after all...
    var el = document.createElement('p');
    el.style.fontFamily = fontName;
    el.style.fontSize = "0px";
    el.style.visibility = "hidden";
    el.innerHTML = '.';
    document.body.appendChild(el);
}
;
