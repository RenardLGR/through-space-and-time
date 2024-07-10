import { COLS, ROWS, CELL_SIZE, period } from '.././constants.js';
import Road from './Road.js'

export default class North extends Road{
    constructor(row, col, context){
        super(row, col, context)
        this.id = "north"
        this.northPossibilities = ["plus", "vertical", "east", "south", "west"]
        this.eastPossibilities = ["plus", "horizontal", "north", "south", "west"]
        this.southPossibilities = ["void", "horizontal", "south"]
        this.westPossibilities = ["plus", "horizontal", "north", "east", "south"]
        this.roadConnections = ["north", "east", "west"]
    }


    draw(){
        let size = CELL_SIZE
        //background
        this.context.fillStyle = "grey"
        this.context.fillRect(this.startX, this.startY, size, size)

        //road
        this.context.fillStyle = "black"
        this.context.fillRect(this.startX, Math.floor(this.startY + size/3), size, Math.ceil(size/3))
        this.context.fillRect(Math.floor(this.startX + size/3), this.startY, Math.ceil(size/3), Math.ceil(size/3))


        //middle line
        this.context.fillStyle = "white"
        this.context.fillRect(this.startX, Math.floor(this.startY + size/2), size, 1)
        this.context.fillRect(Math.floor(this.startX + size/2), this.startY, 1, Math.floor(size/3))
    }
}