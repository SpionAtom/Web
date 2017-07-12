'use strict';

var windowHandler = {    
    pixiapp: null,  // PIXI Application
    canvas: null, // HTML canvas
    application: null, // The main application (game)
    

    init: function() {
        this.pixiapp = new PIXI.Application(config.resolution.width, config.resolution.height, {backgroundColor : config.backgroundColor});
        this.canvas = document.getElementById('CanvasBox');
        this.canvas.appendChild(pixiapp.view);

        //this.application = application;
        application.init(pixiapp.stage);

    },

    onResize: function() {
        var w = window.outerWidth;
        var h = window.outerHeight;
        application.onResize(w, h);
    }

} // end of canvas handler

window.onload = windowHandler.init;
window.addEventListener('resize', windowHandler.onResize);