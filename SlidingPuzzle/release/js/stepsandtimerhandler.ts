class StepsAndTimerHandler {
    // timer related
    secondsTickerRef;
    seconds:number;
    running:boolean;

    // steps related
    steps:number;

    constructor() {
        this.seconds = 0;
        this.steps = 0;
        this.running = false;
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.seconds = 0;
            this.steps = 0;
            this.secondsTickerRef = setInterval(this.secondsTicker, 1000); 
        }
        
    }

    reset() {
        clearInterval(this.secondsTickerRef);    
        this.seconds = 0;
        this.steps = 0;
        this.showSeconds();
        this.running = false;
        this.showSteps();
        this.showSeconds();
    }

    secondsTicker() {
        app.stepsAndTimerHandler.seconds++;
        app.stepsAndTimerHandler.showSeconds();
    }

    incrementSteps() {
        this.steps++;
        this.showSteps();
    }

    showSeconds() {
        document.getElementById('seconds').innerHTML = String(this.seconds);
    }
    showSteps() {
        document.getElementById('steps').innerHTML = String(this.steps);
    }
}