
var background = new Image();

window.onload = function() {    
    background.src = "background.png";

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    screen = document.createElement("canvas");
    sctx = screen.getContext("2d");   

    screen.width = xr;
    screen.height = yr;        
    
    canvas.width = xr;
    canvas.height = yr;
    sctx.font = (xr / 2) + "px";      
    sctx.textBaseline = "top";
    step = 0;

    // for pixel edit
    myImageData = sctx.createImageData(xr, yr);

    onWindowResize();
    setInterval(update, 1000 / fps);    

  }

function update() {
  updateDemo(step);
  window.requestAnimationFrame(draw);
  step++;
}

function draw() {  
  sctx.clearRect(0, 0, xr, yr);
  drawDemo(sctx, step);  
  // sctx.fillStyle = "#fff";
  // sctx.fillText("Step: " + step, 0, 0);  
  
  // scale screen to display
  ctx.drawImage(screen, 0, 0, xr, yr, 0, 0, screenStretchedWidth, screenStretchedHeight);  
}

window.onresize = function() {
    windowResized();
}

function windowResized() {    
    onWindowResize();
  }


  // canvas get resized to fit the entire browserscreen but remains the aspect ratio
  function onWindowResize() {
    console.log("Resizising");
            
    // calculate new screen size
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    screenStretchedWidth = windowWidth;
    screenStretchedHeight = windowWidth / screenRatio;
    if (screenStretchedHeight > windowHeight) {
      screenStretchedHeight = windowHeight;
      screenStretchedWidth = screenStretchedHeight * screenRatio;
    }    
    canvas.width = screenStretchedWidth;
    canvas.height = screenStretchedHeight;
  }