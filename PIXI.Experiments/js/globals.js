'use strict';

    // Basic Canvas settings
    var config = {
      'resolution': { 'width': 800, 'height': 480 },
      backgroundColor: 0x363646,
      framesPerSeconds: 60
    };

    // Timer
    var lastUpdated = 0, updateWaitTime = 1000 / config.framesPerSeconds;

    // Stages
    var rootStage;

    var renderer;
    var canvasBox;