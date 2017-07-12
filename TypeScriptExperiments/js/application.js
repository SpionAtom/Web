'use strict';

var application = {
    
    currentStage: null,

    config: {
        width: 5,
        height: 5
    },

    init: function(_currentState) {
        this.currentState = _currentState;

        var basicText = new PIXI.Text('Basic text in pixi');
        basicText.x = 30;
        basicText.y = 90;

        this.currentState.addChild(basicText);
    },

    onResize: function(newWidth, newHeight) {
        debugger;
        var canvasRect = windowHandler.canvas.getBoundingClientRect();
        windowHandler.pixiapp.height = newHeight - canvasRect.top;
        console.log("new window size: " + newWidth + ", " + newHeight);        
        console.log(canvasRect.top);
    },
    
    update: function() {
        // console.log("update");
    }
    
}