let loop;

initGame();
function initGame() {
    drawBoard();
    animateObject("river", "river");
    animateObject("road", "car");
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
            rowElement.setAttribute("riverType", row-2);
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

function addMovingObject(road, className){
    let object = document.createElement("div");
    object.classList.add(className);
    road.appendChild(object);
    object.addEventListener('animationend', (event) => {
        event.currentTarget.remove();
    });
    return object;
}

function animateObject(rowType, objectType){
    let rows = document.querySelectorAll(`.row.${rowType}`)
    for(let row of rows){
        let objectNumber = row.getAttribute(`${objectType}Type`);
        let objectName = `${objectType}${objectNumber}`
        let minWait = getMinWait(objectName);
        console.log(minWait)
        setInterval(function (){
            setTimeout(function (){
                let object = addMovingObject(row, objectName);
            }, minWait + Math.floor(Math.random()*1000));
        }, minWait+1500);
    }
}

function getMinWait(objectName){
    let object = document.createElement("div");
    object.classList.add(objectName);
    document.body.appendChild(object);
    let style = getComputedStyle(object);
    let duration = parseInt(style.animationDuration.replace('s', ''))
    let width = parseInt(style.width);
    object.remove();
    return Math.floor(duration * (width));
}

let frog = document.createElement("div");
frog.classList.add('frog');
document.querySelector('.bg').lastElementChild.appendChild(frog);


frog.addEventListener('animationend', (event) => {
    let anim = event.currentTarget.style.animationName;
    const root = document.querySelector(':root');
    let frog = document.querySelector('.frog');
    let style = frog.currentStyle || window.getComputedStyle(frog);
    if (anim === "jump_forward"){
        let newRow = parseInt(event.currentTarget.parentNode.getAttribute("data-row")) - 1;
        if (newRow >= 0) {
            let f = document.querySelector('.game-center .bg .row[data-row=' + CSS.escape(String(newRow)) + ']');
            f.appendChild(event.currentTarget);
            event.currentTarget.removeAttribute("style");
        }
    } else if(anim === "jump_backward"){
        let newRow = parseInt(event.currentTarget.parentNode.getAttribute("data-row")) + 1;
        console.log(newRow)
        if (newRow <= 14){
            let f = document.querySelector('.game-center .bg .row[data-row=' + CSS.escape(String(newRow)) + ']');
            f.appendChild(event.currentTarget);
            event.currentTarget.removeAttribute("style");
        }
    } else if(anim === "jump_left"){
        let newPos = parseInt(style.marginLeft.replace('px', ''))-48;
        if(newPos >= 0) {
            root.style.setProperty("--frog-margin", `${newPos + "px"}`)
            event.currentTarget.removeAttribute("style");
        }
    } else if(anim === "jump_right"){
        let newPos = parseInt(style.marginLeft.replace('px', ''))+48;
        if(newPos < 672){
            root.style.setProperty("--frog-margin", `${newPos+"px"}`)
            frog.style.marginLeft = String(newPos + 48) + "px";
            event.currentTarget.removeAttribute("style");
        }
    }

});

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Should do nothing if the default action has been cancelled
  }

  var handled = false;
  const root = document.querySelector(':root');
  let frog = document.querySelector('.frog');
  let style = frog.currentStyle || window.getComputedStyle(frog);
  //up
    if (event.keyCode === 38) {
    // Handle the event with KeyboardEvent.keyCode and set handled true.
        if(frog){
        root.style.setProperty("--frog-margin", `${style.marginLeft}`)
        frog.style.animation = 'jump_forward 50ms steps(2);';
        frog.setAttribute("style", "animation: jump_forward 150ms steps(2);");
      handled = true;
      }
  }
    //down
    if (event.keyCode === 40) {
    // Handle the event with KeyboardEvent.keyCode and set handled true.
        if (frog){
        root.style.setProperty("--frog-margin", `${style.marginLeft}`)
        frog.style.animation = 'jump_backward 50ms steps(2);';
        frog.setAttribute("style", "animation: jump_backward 150ms steps(2);");
      handled = true;
        }
  }
    //right
    if (event.keyCode === 39) {
    // Handle the event with KeyboardEvent.keyCode and set handled true.
        if(frog){
        frog.style.animation = 'jump_right 50ms steps(1);';
        frog.setAttribute("style", "animation: jump_right 150ms steps(2);");
      handled = true;
        }
  }
    //left
    if (event.keyCode === 37) {
    // Handle the event with KeyboardEvent.keyCode and set handled true.
        frog.style.animation = 'jump_left 50ms steps(1);';
        frog.setAttribute("style", "animation: jump_left 150ms steps(2);");
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
    let lifeFrogs = document.createElement("div");
    lifeFrogs.classList.add('life');
    lives.appendChild(lifeFrogs);
    console.log(lives)
    lives.setAttribute("Life","5")
}
function lostLife(){
    let lives = document.querySelector(`.lives`)
    let lifeBeforeDmg = lives.getAttribute("Life")
    const root = document.querySelector(':root');
    lives.setAttribute("Life",`${lifeBeforeDmg-1}`)
    root.style.setProperty("--frog-life", `${18*(lifeBeforeDmg-2)}px`)
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

setInterval(getTranslateX, 1)
getLife();


function startGame() {
    let startDiv = document.getElementById("start");
    let gameCenter = document.getElementsByClassName("game-center");
    let gameOver = document.getElementById("game-over");
    startDiv.style.display = "none";
    gameCenter.style.display = "block";
    gameOver.style.display = "none";
    start();
}

function gameOver() {
    let startDiv = document.getElementById("start");
    let gameCenter = document.getElementsByClassName("game-center");
    let gameOver = document.getElementById("game-over");
    startDiv.style.display = "none";
    gameCenter.style.display = "none";
    gameOver.style.display = "block";

    clearInterval(loop);
}
