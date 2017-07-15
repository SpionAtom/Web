///<reference path="pixi.js.d.ts" />
var Tile = (function () {
    function Tile(app, _num) {
        this.x = 0;
        this.y = 0;
        this.finalX = (_num % app.config.width);
        this.finalY = (Math.floor(_num / app.config.width));
        this.num = _num;
        this.sprite = this.createSprite(app, _num);
    }
    Tile.prototype.createSprite = function (app, num) {
        var tileSize = app.config.tileSize;
        var renderTexture = PIXI.RenderTexture.create(tileSize, tileSize);
        var graphics = new PIXI.Graphics();
        var margin = 3;
        // draw a rounded rectangle
        //graphics.lineStyle(2, 0xDDDDDD, 1);
        graphics.beginFill(0x878787);
        graphics.drawRect(margin, margin, tileSize - 2 * margin, tileSize - 2 * margin);
        graphics.endFill();
        var labelStyle = new PIXI.TextStyle({
            fontFamily: 'Nunito',
            fontSize: 0.6 * tileSize,
            //fontStyle: 'italic',
            fontWeight: 'bold',
            fill: 'white'
            //fill: ['#ffffff', '#cccccc'], // gradient
            //stroke: '#4a1850',
            //strokeThickness: 5,
            //dropShadow: true,
            //dropShadowColor: '#000000',
            //dropShadowBlur: 4,
            //dropShadowAngle: Math.PI / 6,
            //dropShadowDistance: 6,
            //wordWrap: true,
            //wordWrapWidth: 440
        });
        var label = new PIXI.Text(String(num + 1), labelStyle);
        label.anchor.set(0.5);
        label.x = 0.5 * tileSize;
        label.y = 0.5 * tileSize;
        graphics.addChild(label);
        app.pixiApp.renderer.render(graphics, renderTexture);
        var sprite = PIXI.Sprite.from(renderTexture.baseTexture);
        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.tile = this;
        return sprite;
    };
    return Tile;
}());
