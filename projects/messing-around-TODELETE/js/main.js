import Board from './Board.js'
import { COLS, ROWS, CELL_SIZE, period } from './constants.js';

const pauseBtn = document.querySelector('.pause-btn')
pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused
    pauseBtn.innerText = isPaused ? "Play" : "Pause"
})

const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

//GRID Initialization
context.canvas.width = COLS * CELL_SIZE
context.canvas.height = ROWS * CELL_SIZE
// context.scale(CELL_SIZE, CELL_SIZE) //the scale of 1 will now be scaled to a block size

let board = new Board(context)
board.draw()
let isPaused = true
let requestId
let time

// play()


function play() {
    time = { start: 0, elapsed: 0}
    time.start = performance.now() //reset time
    // if (requestId) { //not sure what it does but it was here
    //     cancelAnimationFrame(requestId)
    // }

    animate()
}

function animate(now = 0) {
    time.elapsed = now - time.start
    if(time.elapsed > period && !isPaused){
        time.start = now
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        board.next()
        board.draw()
    }

    requestId = requestAnimationFrame(animate) //not sure what it does but it make the animation work
}