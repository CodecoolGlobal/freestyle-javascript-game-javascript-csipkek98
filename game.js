initGame();

function initGame() {

/*const
    let frog = document.querySelector(".frog")
    document.addEventListener("keydown",event=> function(event){
        event.preventDefault()
        if(event.keyCode === 38){
            frog.currentTarget.style.background = "red";
        }
    })
*/


}

function addRow(gameField) {
    gameField.insertAdjacentHTML(
        'beforeend',
        '<div class="row"></div>'
    );
    return gameField.lastElementChild;
}

for (let row = 0; row < 13; row++) {
    const rowElement = addRow(document.querySelector('.bg'));
    rowElement.setAttribute("data-row", row);
    let car = document.createElement("div")
    car.classList.add("car")
    rowElement.appendChild(car)
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
  let frog = document.querySelector('.frog')
    let actualRow = frog.parentNode.getAttribute("data-row");
    let cars = document.querySelectorAll(`.row[data-row="${actualRow}"] .car`)

    for(let car=0; car<cars.length;car++){
        if(frog.getBoundingClientRect()['x'] < cars[car].getBoundingClientRect()['right']
            && cars[car].getBoundingClientRect()['right']  < frog.getBoundingClientRect()['right'])
        {console.log("Lost Life Placeholder")}
    }
}

setInterval(getTranslateX, 100)