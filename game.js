initGame();

function initGame() {
const
    let frog = document.querySelector(".frog")
    document.addEventListener("keydown",event=> function(event){
        event.preventDefault()
        if(event.keyCode === 38){
            frog.currentTarget.style.background = "red";
        }
    })

}
