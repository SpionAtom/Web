class TimerHandler {
    secondsTickerRef;
    seconds:number;
    app;
    running:boolean;

    constructor(app) {
        this.app = app;
        this.seconds = 0;
        this.running = false;
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.secondsTickerRef = setInterval(this.secondsTicker, 1000); 
        }
        
    }

    resetTimer() {
        clearInterval(this.secondsTickerRef);    
        this.seconds = 0;
        this.showSeconds();
        this.running = false;
    }

    secondsTicker() {
        app.timerHandler.seconds++;
        app.timerHandler.showSeconds();
    }

    showSeconds() {
        document.getElementById('seconds').innerHTML = String(this.seconds);
    }
}