import { COLS, ROWS, CELL_SIZE, period } from './constants.js';

export default class Board {
    constructor(context){
        this.context = context
        this.grid = Array.from({length : ROWS}, _ => Array(COLS).fill(0)) // 1 is alive, 0 is dead
        this.nextGrid = Array.from({length : ROWS}, _ => Array(COLS).fill(0)) // 1 is alive, 0 is dead
        this.initialize()
    }

    initialize(){
        for(let row=0 ; row<ROWS ; row++){
            for(let col=0 ; col<COLS ; col++){
                //50% chance for a cell to be initialized alive
                this.grid[row][col] = Math.random() < 0.5 ? 1 : 0
            }
        }
    }

    //From the existing environment, this function generates the next generation
    next(){
        for(let row=0 ; row<ROWS ; row++){
            for(let col=0 ; col<COLS ; col++){
                const mooreNbrs = this.getMooreNeighborhood(row, col)
                let aliveNbrs = 0
                let deadNbrs = 0
                for(let [rowN, colN] of mooreNbrs){
                    this.grid[rowN][colN] ? aliveNbrs++ : deadNbrs++
                }
                if(aliveNbrs === 3) this.nextGrid[row][col] = 1
                else if(aliveNbrs < 2 || aliveNbrs > 3) this.nextGrid[row][col] = 0
                else this.nextGrid[row][col] = this.grid[row][col]
                // Same thing, different writing ->
                // if (this.grid[row][col] === 1 && aliveNbrs < 2) {
                //     this.nextGrid[row][col] = 0;
                // } else if (this.grid[row][col] === 1 && aliveNbrs > 3) {
                //     this.nextGrid[row][col] = 0;
                // } else if (this.grid[row][col] === 0 && aliveNbrs == 3) {
                //     this.nextGrid[row][col] = 1;
                // } else {
                //     this.nextGrid[row][col] = this.grid[row][col]
                // }
            }
        }
        // Deep copy useless ->
        // this.grid = this.nextGrid.map(arr => arr.slice())
        this.grid = this.nextGrid
        this.nextGrid = Array.from({length : ROWS}, _ => Array(COLS).fill(0))
    }

    draw(){
        for(let row=0 ; row<ROWS ; row++){
            for(let col=0 ; col<COLS ; col++){
                // Draw grey border
                this.context.strokeStyle = 'grey';
                this.context.lineWidth = 1; // Adjust the border width as needed
                this.context.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

                // Draw black or white cell
                this.context.fillStyle = this.grid[row][col] === 1 ? 'black' : '#efefef'
                this.context.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
            }
        }
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
}