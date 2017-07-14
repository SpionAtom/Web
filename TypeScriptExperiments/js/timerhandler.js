var TimerHandler = (function () {
    function TimerHandler(app) {
        this.app = app;
        this.seconds = 0;
        this.running = false;
    }
    TimerHandler.prototype.start = function () {
        if (!this.running) {
            this.running = true;
            this.secondsTickerRef = setInterval(this.secondsTicker, 1000);
        }
    };
    TimerHandler.prototype.resetTimer = function () {
        clearInterval(this.secondsTickerRef);
        this.seconds = 0;
        this.showSeconds();
        this.running = false;
    };
    TimerHandler.prototype.secondsTicker = function () {
        app.timerHandler.seconds++;
        app.timerHandler.showSeconds();
    };
    TimerHandler.prototype.showSeconds = function () {
        document.getElementById('seconds').innerHTML = String(this.seconds);
    };
    return TimerHandler;
}());
