import { COLS, ROWS, CELL_SIZE, period } from '.././constants.js';
import Road from './Road.js'

export default class Void extends Road{
    constructor(row, col, context){
        super(row, col, context)
        this.id = "void"
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