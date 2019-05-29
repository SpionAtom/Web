const canvas = document.getElementById('mycanvas');
const app = new PIXI.Application({
	view: canvas,
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: 0x2c3e50
});
document.body.appendChild(app.view);

app.loader.add('tex', 'assets/pixel_indian_head.png').load(startup);

function startup()
{
	var head = new PIXI.Sprite(app.loader.resources.tex.texture);
	
	// center anchor point
	head.anchor.set(0.5);
	
	// center sprite
	head.x = app.renderer.width / 2;
	head.y = app.renderer.height / 2;
	
	app.stage.addChild(head);
	
	
	app.ticker.add(function(delta)
	{
		// Rotate
		head.rotation += 0.1 * delta;
	});
}