
    interface IapplicationConfig {
        resolution: {
            width: number,
            height: number,
            ratio?: number,
        }
        backgroundColor: number,
        framesPerSeconds: number
    }
    
    function sign(n:number):number {
        if (n > 0) {
            return 1;
        } else if (n === 0) {
            return 0;
        } else {
            return -1;
        }
    }
