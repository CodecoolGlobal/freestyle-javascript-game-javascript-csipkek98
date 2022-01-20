let loop;
let fps = 1000/60;

initGame();
function initGame() {
    drawBoard();
    addFinish();
    getLife();
    setTimeout(spawnFrog,2500)
    frogAnim();
    setInterval(getTranslateX, 1)
    animateObject("river", "river");
    animateObject("road", "car");
    initScoreBoard();
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
        // Snake
        else if(row === 7){
            const rowElement = addRow(board, "snake", row);
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
    object.classList.add("object");
    road.appendChild(object);
    object.addEventListener('animationend', (event) => {
        event.currentTarget.remove();
        event.stopPropagation();
    });
    return object;
}

function animateObject(rowType, objectType){
    let rows = document.querySelectorAll(`.row.${rowType}`)
    for(let row of rows){
        let objectNumber = row.getAttribute(`${objectType}Type`);
        let objectName = `${objectType}${objectNumber}`
        let minWait = getMinWait(objectName);
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

function spawnFrog(){
    let frog = document.createElement("div");
    frog.classList.add('frog');
    moveFrog(frog);
    document.querySelector('.bg .start').appendChild(frog);
}

function getBoat(rowNumber, playerLeft, playerRight){
    let row = document.querySelector(`.game-center .bg .row[data-row="${rowNumber}"]`);
    let boats = row.children;
    for(let boat of boats){
        let right = boat.getBoundingClientRect()["right"];
        let left = boat.getBoundingClientRect()["left"];
        if(left-16 <= playerLeft && right+16 >= playerRight){
            updateScore(row);
            row.classList.add('reached');
            return boat;
        }
    }
    return null;
}
function getOnBoat(rowNumber, player){
    let playerLeft = player.getBoundingClientRect()["left"];
    let playerRight = player.getBoundingClientRect()["right"];
    let boat = getBoat(rowNumber, playerLeft, playerRight)
    if(boat){
        let boatLeft = boat.getBoundingClientRect()["left"];
        const root = document.querySelector(':root');
        let newPos = parseInt(playerLeft) - parseInt(boatLeft);
        boat.appendChild(player);
        root.style.setProperty("--frog-margin", `${newPos+"px"}`);
    }
    else {
        let row = document.querySelector(`.game-center .bg .row[data-row="${rowNumber}"]`);
        row.appendChild(player);
        drown(player);
    }
}
function getOffBoat(player){
    let playerLeft = player.getBoundingClientRect()["left"];
    let rowLeft = player.parentElement.parentElement.getBoundingClientRect()["left"];
    const root = document.querySelector(':root');
    let newPos = parseInt(playerLeft) - parseInt(rowLeft);
    player.parentNode.parentNode.appendChild(player);
    root.style.setProperty("--frog-margin", `${newPos+"px"}`);
}

function jumpBackAndForth(player, direction){
    let frog = document.querySelector('.frog');
    let row = player.parentElement;
    if(row.classList.contains("object")){
        getOffBoat(player)
        jumpBackAndForth(player, direction);
    }
    else {
        let newRow = parseInt(row.getAttribute("data-row")) - direction;
        if ([...Array(14).keys()].includes(newRow)) {
            let field = document.querySelector(`.game-center .bg .row[data-row="${newRow}"]`);
            if(field.classList.contains("river")){
                getOnBoat(newRow, frog);
            }
            else if(field.classList.contains("goal")){
                reachGoal(newRow, frog);
            }
            else {
                field.appendChild(player);
                updateScore(field);
                field.classList.add("reached");
            }
            player.removeAttribute("style");
        }
    }
}
function jumpLeftAndRight(player, direction){
    const root = document.querySelector(':root');
    let oldPos = window.getComputedStyle(root).getPropertyValue("--frog-margin");
    let newPos = parseInt(oldPos.replace('px', ''))-48*direction;
    let parentStyle = window.getComputedStyle(player.parentElement);
    let border = parseInt(parentStyle.getPropertyValue("width").replace('px', ''))
    if(0 <= newPos + 24 && newPos - 10 < border) {
        root.style.setProperty("--frog-margin", `${newPos + "px"}`)
        player.removeAttribute("style");
    }
    else{
        if(player.parentElement.classList.contains("object")){
            root.style.setProperty("--frog-margin", `${newPos + "px"}`)
            getOffBoat(player);
            drown(player);
        }
    }
}

function moveFrog(frog){
    if(frog){
        frog.addEventListener('animationend', (event) => {
            let anim = event.currentTarget.style.animationName;
            if (anim === "jump_forward"){
                jumpBackAndForth(event.currentTarget, 1);
            } else if(anim === "jump_backward"){
                jumpBackAndForth(event.currentTarget, -1);
                event.currentTarget.style.setProperty("transform", "rotate(-180deg)")
            } else if(anim === "jump_left"){
                jumpLeftAndRight(event.currentTarget, 1);
                event.currentTarget.style.setProperty("transform", "rotate(-90deg)")
            } else if(anim === "jump_right"){
                jumpLeftAndRight(event.currentTarget, -1);
                event.currentTarget.style.setProperty("transform", "rotate(90deg)")
            }
            event.stopPropagation();
        });
    }
}
function frogAnim(){
    window.addEventListener("keydown", function (event) {
      if (event.defaultPrevented) {
        return; // Should do nothing if the default action has been cancelled
      }
      let handled = false;
      let frog = document.querySelector('.frog');
      if(frog) {
          switch (event.code){
              case 'ArrowUp':
                  frog.setAttribute("style", "animation: jump_forward 150ms steps(2);");
                  handled = true;
                  break;
              case 'ArrowDown':
                  frog.setAttribute("style", "animation: jump_backward 150ms steps(2);");
                  handled = true;
                  break;
              case 'ArrowRight':
                  frog.setAttribute("style", "animation: jump_right 150ms steps(2);");
                  handled = true;
                  break;
              case 'ArrowLeft':
                  frog.setAttribute("style", "animation: jump_left 150ms steps(2);");
                  handled = true;
                  break;
              default:
                  break;
          }

          if (handled) {
              // Suppress "double action" if event handled
              event.preventDefault();
          }
      }
    }, true);
}

function getTranslateX() {
  let frog = document.querySelector('.frog')
    if (frog && frog.parentElement.classList.contains("road")){
        let actualRow = frog.parentElement.getAttribute("data-row");
        let cartype = frog.parentElement.getAttribute("cartype")
        let cars = document.querySelectorAll(`.row[data-row="${actualRow}"] .car${cartype}`)
        let left = frog.getBoundingClientRect()['left'];
        let right = frog.getBoundingClientRect()['right'];
        for(let car of cars){
            if(left < car.getBoundingClientRect()['right']
                && car.getBoundingClientRect()['left']  < right)
            {
                roadkill();
            }
        }
}
}

function getLife(){
    let lives = document.querySelector(".lives")
    let lifeFrogs = document.createElement("div");
    const root = document.querySelector(':root');
    lifeFrogs.classList.add('life');
    lives.appendChild(lifeFrogs);
    lives.setAttribute("Life","5")
    root.style.setProperty("--frog-life","72px")
}
function lostLife(){
    let lives = document.querySelector(`.lives`)
    let lifeBeforeDmg = lives.getAttribute("Life")
    const root = document.querySelector(':root');
    lives.setAttribute("Life",`${lifeBeforeDmg-1}`)
    root.style.setProperty("--frog-life", `${18*(lifeBeforeDmg-2)}px`)
    if (lives.getAttribute("Life") === "0"){
        gameOver();
    }else{
    respawn();}
}

function roadkill(){
    let frog = document.querySelector('.frog');
    let dieAnim = document.createElement("div");
    dieAnim.classList.add('roadkill');
    frog.parentNode.appendChild(dieAnim);
    frog.remove()
    dieAnim.addEventListener("animationend", event => {
        event.currentTarget.remove();
        lostLife();
        event.stopPropagation();
    })
}
function drown(player){
    let row = player.parentElement;
    player.remove();
    let drowning = document.createElement("div");
    drowning.classList.add("drown");
    drowning.addEventListener("animationend", event => {
        event.currentTarget.remove();
        lostLife();
        event.stopPropagation();
    })
    row.appendChild(drowning);
}
function respawn(){
    resetScoreRows();
    const root = document.querySelector(':root');
    root.style.setProperty("--frog-margin", `336px`)
    let newFrog = document.createElement("div");
    newFrog.classList.add('frog');
    moveFrog(newFrog);
    document.querySelector('.bg .start').appendChild(newFrog);
}

function addFinish(){
    let goal = document.querySelector('.goal')
    for(let i=0;i<5;i++) {
        let finish = document.createElement("div");
        finish.classList.add('finish-empty');
        goal.appendChild(finish);
    }
}
function reachGoal(rowNumber, player){
    let playerLeft = player.getBoundingClientRect()["left"];
    let playerRight = player.getBoundingClientRect()["right"];
    let boat = getBoat(rowNumber, playerLeft, playerRight);
    if(boat){
        let goalFrog = document.createElement("div");
        goalFrog.classList.add("goal-frog");
        boat.appendChild(goalFrog)
        updateScore(boat.parentElement, true);
        if(document.querySelectorAll('.bg .goal .finish-empty .goal-frog').length >= 5){
            player.remove();
            resetScoreRows();
            gameOver();
        }
        else {
            player.remove();
            respawn();
        }
    }
    else{
        drown(player);
    }
}

function initScoreBoard(){
    let board = document.querySelector(".bg .scoreboard");
    board.innerHTML = "<p>SCORE</p><p class='points'>0</p>";
}
function updateScore(row, isGoal=false){
    let score = document.querySelector(".bg .scoreboard .points");
    if(isGoal){
        score.innerHTML = String(parseInt(score.innerHTML) + 50);
    }
    else if(!row.classList.contains("reached") && !row.classList.contains("start")){
        score.innerHTML = String(parseInt(score.innerHTML) + 10);
    }
}
function resetScoreRows(){
    let rows = document.querySelectorAll('.bg .row.reached');
    for(let row of rows){
        row.classList.remove('reached');
    }
}
function resetScore(){
    let score = document.querySelector(".bg .scoreboard .points");
    score.innerHTML = "0";
}

function removeGoalFrog(){
    let goalFrogs = document.querySelectorAll(".goal-frog")
    for(let goalFrog of goalFrogs){
        goalFrog.remove()
    }
}


//////////////////////////////////////////////////////////////////////////
// function start() {
//     initGame();
//     loop = setInterval(update, fps);
// }
//
// function update() {
//     drawBoard();
// }

function launchIfReady() {
    let startDiv = document.getElementById("start");
    // let gameCenter = document.getElementsByClassName("game-center");
    let gameOver = document.getElementById("game-over");
    startDiv.style.display = "block";
    // gameCenter.style.display = "none";
    gameOver.style.display = "none";
}

function startGame() {
    let startDiv = document.getElementById("start");
    // let gameCenter = document.getElementsByClassName("game-center");
    let gameOver = document.getElementById("game-over");
    startDiv.style.display = "none";
    // gameCenter.style.display = "block";
    gameOver.style.display = "none";
    removeGoalFrog()
    getLife()
    resetScore();
    respawn()
}

function gameOver() {
    let startDiv = document.getElementById("start");
    // let gameCenter = document.getElementsByClassName("game-center");
    let gameOver = document.getElementById("game-over");
    startDiv.style.display = "none";
    // gameCenter.style.display = "none";
    gameOver.style.display = "block";

    clearInterval(loop);
}
