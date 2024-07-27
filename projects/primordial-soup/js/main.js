import Space from './Space.js'
import { WIDTH, HEIGHT, CELL_SIZE, period } from './constants.js';

const pauseBtn = document.querySelector('.pause-btn')
pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused
    pauseBtn.innerText = isPaused ? "Play" : "Pause"
})

const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

//Canvas Initialization
context.canvas.width = WIDTH
context.canvas.height = HEIGHT
// context.scale(CELL_SIZE, CELL_SIZE) //the scale of 1 will now be scaled to a block size

let space = new Space(context)
window.space = space //make variables from your module accessible in the global scope, you need to explicitly attach them to the window object.
space.draw()
let isPaused = false
let requestId
let time

play()


function play() {
    time = { start: 0, elapsed: 0}
    time.start = performance.now() //reset time
    // if (requestId) {
    //     cancelAnimationFrame(requestId)
    // }

    animate()
}

function animate(now = 0) {
    time.elapsed = now - time.start
    if(time.elapsed > period && !isPaused){
        time.start = now
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        space.next() //TODO
        space.draw() //TODO
    }

    requestId = requestAnimationFrame(animate)
}