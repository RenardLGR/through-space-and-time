import { COLS, ROWS, CELL_SIZE, period } from './constants.js';

import Void from "./road-types/Void.js"
import Plus from "./road-types/Plus.js"
import Horizontal from "./road-types/Horizontal.js"
import Vertical from "./road-types/Vertical.js"
import North from "./road-types/North.js"
import East from "./road-types/East.js"
import South from "./road-types/South.js"
import West from "./road-types/West.js"

export default class Board {
    constructor(context){
        this.context = context
        this.grid = Array.from({length : ROWS}, _ => Array(COLS))
        this.options = ["void", "plus", "horizontal", "vertical", "north", "east", "south", "west"]
        this.initialize()
    }

    //From the existing environment, this function generates the next generation
    next(){
        
    }

    initialize(){
        for(let row=0 ; row<ROWS ; row++){
            for(let col=0 ; col<COLS ; col++){
                let rand = this.randomNumberBetween(0, this.options.length - 1)
                this.putRoad(this.options[rand], row, col)
            }
        }
    }

    putRoad(id, row, col){
        switch (id) {
            case "void":
                this.grid[row][col] = new Void(row, col, this.context)
                break;

            case "plus":
                this.grid[row][col] = new Plus(row, col, this.context)
                break;

            case "horizontal":
                this.grid[row][col] = new Horizontal(row, col, this.context)
                break;

            case "vertical":
                this.grid[row][col] = new Vertical(row, col, this.context)
                break;

            case "north":
                this.grid[row][col] = new North(row, col, this.context)
                break;

            case "east":
                this.grid[row][col] = new East(row, col, this.context)
                break;

            case "south":
                this.grid[row][col] = new South(row, col, this.context)
                break;

            case "west":
                this.grid[row][col] = new West(row, col, this.context)
                break;

            default:
                throw new Error(`Tried to put a road type of id: ${id}, but it doesn't match existing elements.`)
                break;
        }
    }

    draw(){
        for(let row=0 ; row<ROWS ; row++){
            for(let col=0 ; col<COLS ; col++){
                this.grid[row][col].draw()
            }
        }
    }

    // (number, number) : number
    randomNumberBetween(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    // (number, number) : Array <Array<number> >
    getMooreNeighborhood(row, col){
        const neighborhood = [];
    
        const neighborsRelativeCoords = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
    
        for (const [dr, dc] of neighborsRelativeCoords) {
            const newRow = row + dr;
            const newCol = col + dc;
    
            if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                neighborhood.push([newRow, newCol]);
            }
        }
    
        return neighborhood;
    }

    // (number, number) : Array <Array<number> >
    getVonNeumannNeighborhood(row, col) {
        const neighborhood = [];
    
        const neighborsRelativeCoords = [
                     [-1, 0],
            [0, -1],           [0, 1],
                     [1, 0]
        ];
    
        for (const [dr, dc] of neighborsRelativeCoords) {
            const newRow = row + dr;
            const newCol = col + dc;
    
            if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                neighborhood.push([newRow, newCol]);
            }
        }
    
        return neighborhood;
    }

    // (number, number, number) : Array <Array<number> >
    getChebyshevNeighborhood(row, col, distance) {
        //Square shape
        //Note : the original center point is INCLUDED in the neighbors
        const neighborhood = [];
    
        // Iterate through all cells within the specified Chebyshev distance
        for (let i = row - distance; i <= row + distance; i++) {
            for (let j = col - distance; j <= col + distance; j++) {
                // Calculate Chebyshev distance
                const chebyshevDist = Math.max(Math.abs(row - i), Math.abs(col - j));
    
                // Check if the cell is within the Chebyshev distance and within the bounds of the grid
                if (chebyshevDist <= distance && i >= 0 && i < ROWS && j >= 0 && j < COLS) {
                    neighborhood.push([i, j]);
                }
            }
        }
    
        return neighborhood;
    }

    // (number, number, number) : Array <Array<number> >
    getTaxicabNeighborhood(row, col, distance) {
        //Diamond shape
        //Note : the original center point is INCLUDED in the neighbors
        const neighborhood = [];
    
        // Iterate through all cells within the specified taxicab distance
        for (let i = row - distance; i <= row + distance; i++) {
            for (let j = col - distance; j <= col + distance; j++) {
                // Calculate Manhattan distance
                const manhattanDist = Math.abs(row - i) + Math.abs(col - j);
    
                // Check if the cell is within the Manhattan distance and within the bounds of the grid
                if (manhattanDist <= distance && i >= 0 && i < ROWS && j >= 0 && j < COLS) {
                    neighborhood.push([i, j]);
                }
            }
        }
    
        return neighborhood;
    }

    // (number, number, number) : Array <Array<number> >
    getCircularNeighborhood(row, col, radius) {
        //Note : the original center point is INCLUDED in the neighbors
        const neighborhood = [];
    
        // Iterate through all cells within the circular radius
        for (let i = row - radius; i <= row + radius; i++) {
            for (let j = col - radius; j <= col + radius; j++) {
                // Calculate Euclidean distance from central cell (row, col)
                const distance = Math.sqrt(Math.pow(row - i, 2) + Math.pow(col - j, 2));
    
                // Check if the cell is within the circular radius and within the bounds of the grid
                if (distance < radius && i >= 0 && i < ROWS && j >= 0 && j < COLS) {
                    neighborhood.push([i, j]);
                }
            }
        }
    
        return neighborhood;
    }
}