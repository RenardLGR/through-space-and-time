import { COLS, ROWS, CELL_SIZE, period } from '.././constants.js';
import Road from './Road.js'

export default class Horizontal extends Road{
    constructor(row, col, context){
        super(row, col, context)
        this.id = "horizontal"
        this.northPossibilities = ["void", "horizontal", "north"]
        this.eastPossibilities = ["plus", "horizontal", "north", "south", "west"]
        this.southPossibilities = ["void", "horizontal", "south"]
        this.westPossibilities = ["plus", "horizontal", "north", "east", "south"]
    }


    draw(){
        let size = CELL_SIZE
        //background
        this.context.fillStyle = "grey"
        this.context.fillRect(this.startX, this.startY, size, size)

        //road
        this.context.fillStyle = "black"
        this.context.fillRect(this.startX, Math.floor(this.startY + size/3), size, Math.ceil(size/3))


        //middle line
        this.context.fillStyle = "white"
        this.context.fillRect(this.startX, Math.floor(this.startY + size/2), size, 1)
    }
}