const MINE = -1, EMPTY = 0 //Minen werden mit -1 gespeichert
var gameTimer //Variable für setInterval, hält die aktuelle Spielzeit
var gameStarted, gamePaused //Gibt an, ob das Spiel begonnen hat. Gibt an, ob das Spiel momentan pausiert ist
var field = [], fieldWidth, fieldHeight, fieldMines //Spielfeld mit Werten (Minen werden mit -1 gespeichert)

window.onload = function() {    
    showNewRange()
    restartGame()
}

function showNewRange() {
    const inputWidth = document.getElementById('width')
    const spanWidth = document.getElementById('spanWidth')
    const inputHeight = document.getElementById('height')
    const spanHeight = document.getElementById('spanHeight')
    const inputMines = document.getElementById('mines')
    const spanMines = document.getElementById('spanMines')  
    spanWidth.innerHTML = inputWidth.value    
    spanHeight.innerHTML = inputHeight.value
    spanMines.innerHTML = inputMines.value    
}

function restartGame() {
    console.log("Game started")
    resetTimer(true)
    gameStarted = false
    gamePaused = false
    pauseGame()
    document.getElementById('pause').disabled = true

    const divField = document.getElementById("field")
    
    //Div vom alten Feld befreien    
    while (divField.firstChild) {
        divField.removeChild(divField.lastChild)
    }

    //neues Feld aufbauen
    const inputWidth = document.getElementById('width')    
    const inputHeight = document.getElementById('height')    
    const inputMines = document.getElementById('mines')
    
    let table = document.createElement('table')
    for (let row = 0; row < inputHeight.value; row++) {
        let newRow = document.createElement('tr')        
        for (let col = 0; col < inputWidth.value; col++) {
            let newCell = document.createElement('td')
            let newButton = document.createElement('button')
            newButton.addEventListener('click', clickCellButton)
            newButton.style.width = '100%'
            newButton.style.height = '100%'
            newCell.setAttribute('row', row)
            newCell.setAttribute('col', col)
            newCell.classList.add('cell')
            newCell.appendChild(newButton)
            newRow.appendChild(newCell)            
        }
        table.appendChild(newRow)
    }
    divField.appendChild(table)

}

function clickCellButton() {

    var startRow = parseInt(this.parentElement.getAttribute('row'))
    var startCol = parseInt(this.parentElement.getAttribute('col'))


    if (!gameStarted) {
        gameStarted = true        
        populateField(startRow, startCol)
        document.getElementById('pause').disabled = false
        pauseGame()
        openCell(this.parentElement)
    }
    else {
        openCell(this.parentElement)
    }

}

function openCell(cell) {
    cell.removeChild(cell.firstChild)    
    let index = parseInt(cell.getAttribute('row')) * fieldWidth + parseInt(cell.getAttribute('col'))
    cell.innerHTML = field[index]
}

function populateField(rowStart, colStart) {

    fieldWidth = document.getElementById('width').value
    fieldHeight = document.getElementById('height').value
    fieldMines = document.getElementById('mines').value

    let randomIndex, startCellIndex = rowStart * fieldWidth + colStart;
    
    field = []
    // array füllen mit Minen und leeren Feldern
    for (let i = 0; i < fieldWidth * fieldHeight; i++) {
        if (i < fieldMines) {
            field.push(MINE)
        }
        else {
            field.push(EMPTY)
        }        
    }

    //falls das Startfeld mit einer Mine versehen wurde, setze es auf EMPTY, und dafür das Feld mit dem Index fieldMines auf MINE
    if (startCellIndex < fieldMines) {
        field[startCellIndex] = EMPTY
        field[fieldMines] = MINE
    }

    //Array shuffeln, aber so, dass nicht das Startfeld eine Mine bekommt
    for (let i = field.length -1; i > 0; i--) {
        
        if (i != startCellIndex) {
            do {
                randomIndex = Math.floor(Math.random() * i)
            } while (randomIndex == startCellIndex);            
            // swap
            [field[i], field[randomIndex]] = [field[randomIndex], field[i]]    
        }
    }
    
    //Feld mit Nachbarwerten füllen
    console.log(field)
    return
    for (let row = 0; row < fieldHeight; row++) {
        for (let col = 0; col < fieldWidth; col++) {
            // Anzahl Nachbarminen ermitteln
            let neighbours = field[row * fieldWidth + col] == MINE ? -1 : 0
            console.log(row + ", " + col)

            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    console.log(r + ", " + c)
                    if (r >= 0 && c >= 0 && r < fieldHeight && c < fieldWidth) {
                        if (field[r * fieldWidth + c] == MINE) {
                            neighbours++
                        }
                    }

                }
            }
            if (field[row * fieldWidth + col] == EMPTY) {
                field[row * fieldWidth + col] = neighbours
            }

        }
    }

    
        
    

}



function resetTimer(startFromZero) {
    if (gameTimer != null) {
        clearInterval(gameTimer)
    }
    let clock = document.getElementById('clock')
    if (startFromZero) {
        clock.innerHTML = "0"
    }    
    gameTimer = setInterval(function() {
        let getTime = parseInt(clock.innerHTML)
        clock.innerHTML = getTime + 1
    }, 1000)
}

function pauseGame() {
    console.log("clicked pause")    
    if (!gamePaused) {
        clearInterval(gameTimer)
        gamePaused = true
    }
    else {
        resetTimer(false)
        gamePaused = false
    }
    console.log(gamePaused)
}