/*
    https://enigame.de/
    29.-30.10.2021
    Puzzle 2.9. Stars

    coded for web some days later
    SpionAtom
*/

let cenX = -1.4999;
let cenY = 0.0;
let disScale = 1;
let currentLetter = "";
let qr = xr / 2; // size of a quadrant, normally half the width or half the height
let letterSize = (qr * 0.6);

let picLetter = document.createElement('canvas');
let ptx = picLetter.getContext('2d');
    picLetter.width = qr;
    picLetter.height = qr;  
let picHistogramPixelsPerRow = document.createElement('canvas');
let ptxrow = picHistogramPixelsPerRow.getContext('2d');
    picHistogramPixelsPerRow.width = qr;
    picHistogramPixelsPerRow.height = qr;
let picHistogramPixelsPerCol = document.createElement('canvas');
let ptxcol = picHistogramPixelsPerCol.getContext('2d');
    picHistogramPixelsPerCol.width = qr;
    picHistogramPixelsPerCol.height = qr;

window.addEventListener('keydown', (event) => {        
        let key = event.key        
        if (key.length == 1)
        {
            currentLetter = key;
            createPics(currentLetter);
        }
});

function createPics(letter) {

        //write the letter
        
            ptx.font = letterSize + "px Arial";                
            metrics = ptx.measureText(letter);
        
            // clear 
            ptx.beginPath();        
            ptx.fillStyle = "rgba(0, 0, 0, 255)";
            ptx.fillRect(0, 0, qr, qr);
            ptx.stroke();

            // draw letter
            ptx.beginPath();
            ptx.fillStyle = "white";
            ptx.fillText(letter, (qr - metrics.width) / 2, qr - (qr - letterSize) / 2 );
            ptx.stroke();           

            imgData = ptx.getImageData(0, 0, qr, qr).data;            

        //create picture pixelsperrow        
            // clear
            ptxrow.beginPath();        
            ptxrow.fillStyle = "rgba(0, 0, 0, 255)";
            ptxrow.fillRect(0, 0, qr, qr);
            ptxrow.stroke();
            
            ptxrow.beginPath();
            ptxrow.strokeStyle = "white";
            ptxrow.moveTo(0, 0);            
            for (let row = 0; row < qr; row++)
            {
                pixels = 0;
                for (let col = 0; col < qr; col++)
                {
                    indexblue = 4 * (row * qr + col)                    
                    if (imgData[indexblue] == 255)
                    {
                        pixels++;                        
                    }
                }
                ptxrow.lineTo(pixels, row);                                  
            }
            ptxrow.stroke();       

        //create picture pixelspercol        
            // clear
            ptxcol.beginPath();
            ptxcol.fillStyle = "rgba(0, 0, 0, 255)";
            ptxcol.fillRect(0, 0, qr, qr);
            ptxcol.stroke();            
            
            ptxcol.beginPath();
            ptxcol.strokeStyle = "white";
            ptxcol.moveTo(0, 0);  
            for (let col = 0; col < qr; col++)
            {
                pixels = 0;
                for (let row = 0; row < qr; row++)
                {
                    indexblue = 4 * (row * qr + col + 0)
                    if (imgData[indexblue] == 255)
                    {
                        pixels++;                        
                    }
                }
                ptxcol.lineTo(col, pixels);                                  
            }
            ptxcol.stroke();       
            
}


function updateDemo(s) {
}

function drawDemo(ctx, s) {
    
    ctx.beginPath(); 
    ctx.fillStyle = "rgba(0, 0, 0, 0)";    
    ctx.fillRect(0, 0, xr, yr);    
    ctx.stroke();
    

    // draw letter
    ctx.drawImage(picLetter, xr / 2, yr / 2);

    // draw histogram pixels per row
    ctx.drawImage(picHistogramPixelsPerRow, 0, yr / 2);

    // draw histogram pixels per col
    ctx.drawImage(picHistogramPixelsPerCol, xr / 2, 0);
    
}

function centerText(ctx, txt, y) {
    ctx.beginPath();
    ctx.fillText(txt, (xr - ctx.measureText(txt).width) / 2, y);
    ctx.closePath();
}

function drawCircle(ctx, x, y, r) {
    ctx.arc(x, y, r, 0, Math.PI * 2);
}