interface IapplicationConfig {
    resolution: {
        width: number,
        height: number,
        ratio?: number,
    }
    backgroundColor: number,
    framesPerSeconds: number
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