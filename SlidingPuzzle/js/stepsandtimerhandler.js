var StepsAndTimerHandler = (function () {
    function StepsAndTimerHandler() {
        this.seconds = 0;
        this.steps = 0;
        this.running = false;
    }
    StepsAndTimerHandler.prototype.start = function () {
        if (!this.running) {
            this.running = true;
            this.seconds = 0;
            this.steps = 0;
            this.secondsTickerRef = setInterval(this.secondsTicker, 1000);
        }
    };
    StepsAndTimerHandler.prototype.reset = function () {
        clearInterval(this.secondsTickerRef);
        this.seconds = 0;
        this.steps = 0;
        this.showSeconds();
        this.running = false;
        this.showSteps();
        this.showSeconds();
    };
    StepsAndTimerHandler.prototype.secondsTicker = function () {
        app.stepsAndTimerHandler.seconds++;
        app.stepsAndTimerHandler.showSeconds();
    };
    StepsAndTimerHandler.prototype.incrementSteps = function () {
        this.steps++;
        this.showSteps();
    };
    StepsAndTimerHandler.prototype.showSeconds = function () {
        document.getElementById('seconds').innerHTML = String(this.seconds);
    };
    StepsAndTimerHandler.prototype.showSteps = function () {
        document.getElementById('steps').innerHTML = String(this.steps);
    };
    return StepsAndTimerHandler;
}());
