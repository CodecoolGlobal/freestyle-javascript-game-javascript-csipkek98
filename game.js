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

frog.addEventListener('animationend', (event) => {
    let newRow = parseInt(event.currentTarget.parentNode.getAttribute("data-row")) - 1;
    let f = document.querySelector('.game-center .bg .row[data-row=' + CSS.escape(String(newRow)) + ']');
    f.appendChild(event.currentTarget);
    event.currentTarget.removeAttribute("style");
});

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Should do nothing if the default action has been cancelled
  }

  var handled = false;
    if (event.keyCode === 38) {
    // Handle the event with KeyboardEvent.keyCode and set handled true.
        let frog = document.querySelector('.frog');
        if(frog){
        let style = frog.currentStyle || window.getComputedStyle(frog);
        let newRow = parseInt(frog.parentNode.getAttribute("data-row")) -1;
        const root = document.querySelector(':root');
        root.style.setProperty("--frog-margin", `${style.marginLeft}`)
        frog.style.animation = 'jump_forward 50ms steps(2);';
        frog.setAttribute("style", "animation: jump_forward 150ms steps(2);");
        let f = document.querySelector('.game-center .bg .row[data-row=' + CSS.escape(String(newRow)) + ']');
      handled = true;
      }
  }
    if (event.keyCode === 40) {
    // Handle the event with KeyboardEvent.keyCode and set handled true.
        let frog = document.querySelector('.frog');
        let newRow = parseInt(frog.parentNode.getAttribute("data-row")) + 1;
        let style = frog.currentStyle || window.getComputedStyle(frog);
        let f = document.querySelector('.game-center .bg .row[data-row=' + CSS.escape(String(newRow)) + ']');
        f.appendChild(frog);

        let margin = frog.currentStyle || window.getComputedStyle(frog)
        console.log("Current marginLeft: " + margin.marginLeft)

      handled = true;
  }
    if (event.keyCode === 39) {
    // Handle the event with KeyboardEvent.keyCode and set handled true.
        let frog = document.querySelector('.frog');
        let style = frog.currentStyle || window.getComputedStyle(frog);
        let newPos = parseInt(style.marginLeft.replace('px', ''));
        frog.style.marginLeft = String(newPos + 48) + "px";

        let margin = frog.currentStyle || window.getComputedStyle(frog)
        console.log("Current marginLeft: " + margin.marginLeft)

      handled = true;
  }
    if (event.keyCode === 37) {
    // Handle the event with KeyboardEvent.keyCode and set handled true.
        let frog = document.querySelector('.frog');
        let style = frog.currentStyle || window.getComputedStyle(frog);
        let newPos = parseInt(style.marginLeft.replace('px', ''));
        frog.style.marginLeft = String(newPos - 48) + "px";

        let margin = frog.currentStyle || window.getComputedStyle(frog)
        console.log("Current marginLeft: " + margin.marginLeft)

      handled = true;
  }

  if (handled) {
    // Suppress "double action" if event handled
    event.preventDefault();
  }
}, true);

function getTranslateX() {

  let frog = document.querySelector('.frog')
    if (frog){
    let actualRow = frog.parentNode.getAttribute("data-row");
    let cartype = document.querySelector(`.row[data-row="${actualRow}"]`).getAttribute("cartype")
    let cars = document.querySelectorAll(`.row[data-row="${actualRow}"] .car${cartype}`)
    for(let car=0; car<cars.length;car++){
        if(frog.getBoundingClientRect()['x'] < cars[car].getBoundingClientRect()['right']
            && cars[car].getBoundingClientRect()['right']  < frog.getBoundingClientRect()['right'])
        {lostLife()}
    }
}
}
function getLife(){
    let lives = document.querySelector(".lives")
    console.log(lives)
    lives.setAttribute("Life","5")
}
function lostLife(){
    let lives = document.querySelector(`.lives`)
    let lifeBeforeDmg = lives.getAttribute("Life")
    lives.setAttribute("Life",`${lifeBeforeDmg-1}`)
    dieAnim()
    if (lives.getAttribute("Life") === "0"){
        gameOver()
    }else{
    setTimeout(respawn,1000)}
}
function gameOver(){
    console.log("dead")
}
function dieAnim(){
    let frog = document.querySelector('.frog');
    let dieAnim = document.createElement("div");
    dieAnim.classList.add('dieAnim');
    frog.parentNode.appendChild(dieAnim);
    let style = frog.currentStyle || window.getComputedStyle(frog);
    const root = document.querySelector(':root');
    root.style.setProperty("--frog-margin", `${style.marginLeft}`)
    dieAnim.setAttribute("style", "animation: die-on-road 1000ms steps(4);");
    frog.remove()
}
function respawn(){
    let dieAnim = document.querySelector('.dieAnim');
    dieAnim.remove()
    const root = document.querySelector(':root');
    root.style.setProperty("--frog-margin", `336px`)
    let newFrog = document.createElement("div");
    newFrog.classList.add('frog');
    document.querySelector('.bg').lastElementChild.appendChild(frog);
}

setInterval(getTranslateX, 100)
getLife();
