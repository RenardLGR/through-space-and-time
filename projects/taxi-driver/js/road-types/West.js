import { COLS, ROWS, CELL_SIZE, period } from '.././constants.js';
import Road from './Road.js'

export default class West extends Road{
    constructor(row, col, context){
        super(row, col, context)
        this.id = "west"
        this.northPossibilities = ["plus", "vertical", "east", "south", "west"]
        this.eastPossibilities = ["void", "vertical", "east"]
        this.southPossibilities = ["plus", "vertical", "north", "east", "west"]
        this.westPossibilities = ["plus", "horizontal", "north", "east", "south"]
        this.roadConnections = ["north", "south", "west"]
    }


    draw(){
        let size = CELL_SIZE
        //background
        this.context.fillStyle = "grey"
        this.context.fillRect(this.startX, this.startY, size, size)

        //road
        this.context.fillStyle = "black"
        this.context.fillRect(Math.floor(this.startX + size/3), this.startY, Math.ceil(size/3), size)
        this.context.fillRect(this.startX, Math.floor(this.startY + size/3), Math.ceil(size/3), Math.ceil(size/3))


        //middle line
        this.context.fillStyle = "white"
        this.context.fillRect(Math.floor(this.startX + size/2), this.startY, 1, size)
        this.context.fillRect(this.startX, Math.floor(this.startY + size/2), Math.floor(size/3), 1)
    }
}