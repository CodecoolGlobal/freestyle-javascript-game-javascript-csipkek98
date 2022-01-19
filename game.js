initGame();
let life = 5;
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
            rowElement.setAttribute("carType", row-8);
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
    gameField.insertAdjacentHTML(
        'beforeend',
        `<div class="row ${classes}" data-row="${row}"></div>`
    );
    return gameField.lastElementChild;
}

function addCar(road, carnumber=0){
    let car = document.createElement("div");
    car.classList.add(`car${carnumber}`);
    road.appendChild(car);
    car.addEventListener('animationend', (event) => {
        event.currentTarget.remove();
    });
}

let roads = document.querySelectorAll('.row.road')
for(let road of roads)
{
    /*road.addEventListener('click', function (event){
        let carType = event.currentTarget.getAttribute("carType");
        addCar(event.currentTarget, parseInt(carType));
    })*/
    setInterval(function (){
        setTimeout(function (){
            let carType = road.getAttribute("carType");
            addCar(road, parseInt(carType));
        }, Math.floor(Math.random()*3000+1000));
    }, 3000);
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


// Test object's attributes
let rect1 = {x:5, y:5, width: 50, height:50};
let rect2 = {x:20, y:10, width: 10, height:10};

function test_collision_collision () {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    ){
        //collision detected
    } else {
        //no collision
    }
}

function test_collision_no_collision () {
    if (rect1.x > rect2.x + rect2.width ||
        rect1.x + rect1.width < rect2.x ||
        rect1.y > rect2.y + rect2.height ||
        rect1.y + rect1.height < rect2.y
    ){
        //no collision
    } else {
        //collision detected
    }
}
function getTranslateX() {

  let frog = document.querySelector('.frog')
    let actualRow = frog.parentNode.getAttribute("data-row");
    let cartype = document.querySelector(`.row[data-row="${actualRow}"]`).getAttribute("cartype")
    let cars = document.querySelectorAll(`.row[data-row="${actualRow}"] .car${cartype}`)
    for(let car=0; car<cars.length;car++){
        if(frog.getBoundingClientRect()['x'] < cars[car].getBoundingClientRect()['right']
            && cars[car].getBoundingClientRect()['right']  < frog.getBoundingClientRect()['right'])
        {lostLife()}
    }
}
function lostLife(){
    let life = life - 1
    console.log(life)
    return life
}

setInterval(getTranslateX, 100)
