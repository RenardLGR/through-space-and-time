import { COLS, ROWS, CELL_SIZE, period } from '.././constants.js';

export default class Road{
    constructor(row, col, context){
        this.context = context
        this.row = row
        this.col = col
        this.startX = row * CELL_SIZE
        this.startY = col * CELL_SIZE
        this.id = "road"
    }
}