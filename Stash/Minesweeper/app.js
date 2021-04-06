window.onload = function() {


    console.log("hello world")
    
}

function showNewRange() {
    let inputWidth = document.getElementById('width')
    let spanWidth = document.getElementById('spanWidth')
    let inputHeight = document.getElementById('height')
    let spanHeight = document.getElementById('spanHeight')    
    spanWidth.innerHTML = inputWidth.value    
    spanHeight.innerHTML = inputHeight.value    
}