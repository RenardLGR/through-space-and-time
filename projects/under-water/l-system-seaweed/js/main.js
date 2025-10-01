import Board from './Board.js'
import { WIDTH, HEIGHT, period } from './constants.js';

const pauseBtn = document.querySelector('.pause-btn')
pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused
    pauseBtn.innerText = isPaused ? "Play" : "Pause"
})

const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

//GRID Initialization
context.canvas.width = WIDTH
context.canvas.height = HEIGHT
// context.scale(CELL_SIZE, CELL_SIZE) //the scale of 1 will now be scaled to a block size

let board = new Board(context)
window.board = board //make variables from your module accessible in the global scope, you need to explicitly attach them to the window object.
let isPaused = false
let requestId
let time

// board.draw()
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
        // board.draw() //TODO
        board.drawOneByOne() //TODO
    }

    requestId = requestAnimationFrame(animate)
}


// Naive : The idea is to run two nested loops to iterate over all possible subarrays and find the maximum sum. The outer loop will mark the starting point of a subarray and inner loop will mark the ending point of the subarray.
function getMaxSubSum(arr){
    let maxSum = 0
    for(let i=0 ; i<arr.length ; i++){
        let curSum = 0
        for(let j=i ; j<arr.length ; j++){
            curSum += arr[j]
            maxSum = Math.max(maxSum, curSum)
        }
    }

    return maxSum
}

// console.log(getMaxSubSum([-1, 2, 3, -9])) // 5
// console.log(getMaxSubSum([2, -1, 2, 3, -9])) // 6
// console.log(getMaxSubSum([-1, 2, 3, -9, 11])) // 11
// console.log(getMaxSubSum([-2, -1, 1, 2])) // 3
// console.log(getMaxSubSum([100, -9, 2, -3, 5])) // 100
// console.log(getMaxSubSum([1, 2, 3])) // 6
// console.log(getMaxSubSum([-1, -2, -3])) // 0


// console.log(getMaxSubSum([2, 3, -8, 7, -1, 2, 3])) // 11
// console.log(getMaxSubSum([-2,1,-3,4,-1,2,1,-5,4])) // 6




// Kadane's : The idea of Kadane's algorithm is to traverse over the array from left to right and for each element, find the maximum sum among all subarrays ending at that element. The result will be the maximum of all these values. 
function getMaxSubSumKadanes(arr){
    let maxSum = 0
    let curSum = 0

    for(let i=0 ; i<arr.length ; i++){
        //Either extend the previous subarray or start new from current element
        curSum = Math.max(curSum+arr[i], arr[i])
        maxSum = Math.max(curSum, maxSum)
    }

    return maxSum
}

// console.log(getMaxSubSumKadanes([-1, 2, 3, -9])) // 5
// console.log(getMaxSubSumKadanes([2, -1, 2, 3, -9])) // 6
// console.log(getMaxSubSumKadanes([-1, 2, 3, -9, 11])) // 11
// console.log(getMaxSubSumKadanes([-2, -1, 1, 2])) // 3
// console.log(getMaxSubSumKadanes([100, -9, 2, -3, 5])) // 100
// console.log(getMaxSubSumKadanes([1, 2, 3])) // 6
// console.log(getMaxSubSumKadanes([-1, -2, -3])) // 0


// console.log(getMaxSubSumKadanes([2, 3, -8, 7, -1, 2, 3])) // 11
// console.log(getMaxSubSumKadanes([-2,1,-3,4,-1,2,1,-5,4])) // 6