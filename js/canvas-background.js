import Board from './Board.js'
import { COLS, ROWS, CELL_SIZE, period } from './constants.js';

// console.log(window.innerWidth)
// console.log(window.innerHeight)

const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

//GRID Initialization
context.canvas.width = COLS * CELL_SIZE
context.canvas.height = ROWS * CELL_SIZE
// context.scale(CELL_SIZE, CELL_SIZE) //the scale of 1 will now be scaled to a block size

let board = new Board(context)
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
        board.next() //TODO
        board.draw() //TODO
        // isPaused = true
    }

    requestId = requestAnimationFrame(animate)
}