import { COLS, ROWS, CELL_SIZE, period } from '.././constants.js';

export default class Void{
    constructor(startX, startY, context){
        this.context = context
        this.startX = startX
        this.startY = startY
        this.northPossibilities = ["void", "horizontal", "north"]
        this.eastPossibilities = ["void", "vertical", "east"]
        this.southPossibilities = ["void", "horizontal", "south"]
        this.westPossibilities = ["void", "vertical", "west"]
    }


    draw(){
        let size = CELL_SIZE
        //background
        this.context.fillStyle = "grey"
        this.context.fillRect(this.startX, this.startY, size, size)
    }
}