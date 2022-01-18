initGame();

function initGame() {
    drawBoard();
}

function drawBoard() {
    const board = document.querySelector('.game-center .bg');
    for (let row = 0; row < 15; row++) {
        // Scoreboard
        if(row === 0){
            const rowElement = addRow(board, "scoreboard", row);
        }
        // Goal
        else if(row === 1){
            const rowElement = addRow(board, "goal", row);
        }
        // River
        else if(row <= 6){
            const rowElement = addRow(board, "river", row);
        }
        // Empty
        else if(row === 7){
            const rowElement = addRow(board, "", row);
        }
        // Road
        else if(row <= 12){
            const rowElement = addRow(board, "road", row);
        }
        // Start
        else if(row === 13){
            const rowElement = addRow(board, "start", row);
        }
        // Lives
        else{
            const rowElement = addRow(board, "lives", row);
        }
    }
}

function addRow(gameField, classes="", row=0) {
    console.log(`${classes}`)
    gameField.insertAdjacentHTML(
        'beforeend',
        `<div class="row ${classes}" data-row="${row}"></div>`
    );
    return gameField.lastElementChild;
}


let frog = document.createElement("div");
frog.classList.add('frog');
document.querySelector('.bg').lastElementChild.appendChild(frog);

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Should do nothing if the default action has been cancelled
  }

  var handled = false;
    if (event.keyCode === 38) {
    // Handle the event with KeyboardEvent.keyCode and set handled true.
        let frog = document.querySelector('.frog');
        let newRow = parseInt(frog.parentNode.getAttribute("data-row")) - 1;
        let f = document.querySelector('.game-center .bg .row[data-row=' + CSS.escape(String(newRow)) + ']');
        f.appendChild(frog);

      handled = true;
  }
    if (event.keyCode === 40) {
    // Handle the event with KeyboardEvent.keyCode and set handled true.
        let frog = document.querySelector('.frog');
        let newRow = parseInt(frog.parentNode.getAttribute("data-row")) + 1;
        let f = document.querySelector('.game-center .bg .row[data-row=' + CSS.escape(String(newRow)) + ']');
        f.appendChild(frog);

      handled = true;
  }
    if (event.keyCode === 39) {
    // Handle the event with KeyboardEvent.keyCode and set handled true.
        let frog = document.querySelector('.frog');
        let style = frog.currentStyle || window.getComputedStyle(frog);
        let newPos = parseInt(style.marginLeft.replace('px', ''));
        frog.style.marginLeft = String(newPos + 48) + "px";

      handled = true;
  }
    if (event.keyCode === 37) {
    // Handle the event with KeyboardEvent.keyCode and set handled true.
        let frog = document.querySelector('.frog');
        let style = frog.currentStyle || window.getComputedStyle(frog);
        let newPos = parseInt(style.marginLeft.replace('px', ''));
        frog.style.marginLeft = String(newPos - 48) + "px";

      handled = true;
  }

  if (handled) {
    // Suppress "double action" if event handled
    event.preventDefault();
  }
}, true);

function getTranslateX() {
    let car = document.querySelector('.row[data-row="12"] .car')
  //var style = window.getComputedStyle(car);
  //var matrix = style.getPropertyValue("transform");
  let frog = document.querySelector('.frog')
    //console.log('translateX: ', frog.getBoundingClientRect()['right']);
    if(frog.getBoundingClientRect()['x'] < car.getBoundingClientRect()['right']
        && car.getBoundingClientRect()['right']  < frog.getBoundingClientRect()['right'])
    {console.log('translateX: ', car.getBoundingClientRect()['x']);}
  //console.log('tran: ', matrix.split(','));
}

//setInterval(getTranslateX, 1)