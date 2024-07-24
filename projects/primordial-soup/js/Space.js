import { COLS, ROWS, CELL_SIZE, period } from './constants.js';

import CelestialBody from './CelestialBody.js';

export default class Board {
    constructor(context){
        this.context = context
        this.bodies = []
        this.G = 10 // Gravitational constant

        this.initialize()
    }

    //From the existing environment, this function generates the next generation
    next(){
        // STEP 1 Initial data
        // Positions: Let the initial positions of the two celestial bodies be r1 = (x1, y1) and r2 = (x2, y2)
        // Velocities: Let the initial velocities of the two celestial bodies be v1 = (v1x, v1y) and v2 = (v2x, v2y)
        // Masses: Let the initial masses of the two celestial bodies be m1 and m2

        // STEP 2 Calculate the gravitational force
        // F12 = G(m1m2/r²)u
        // where :
        // F12 is the force on body 1 due to body 2
        // G is the gravitational constant
        // r is the distance between the bodies r = sqrt((x1-x2)² + (y1-y2)²)
        // u is the unit vector from body 1 to body 2 u = (r2-r1)/r = (x1-x2, y1-y2)/r
        // Finally, we have F12 = F1 = -F2

        // STEP 3 Calculate the acceleration
        // Using Newton's second law F = ma
        // a1 = G(m2/r²)u
        // a2 = -G(m1/r²)u

        // STEP 4 Update the velocities
        // Assuming a small time step Dt = 1 second
        // v1' = v1 + a1*Dt
        // v2' = v2 + a2*Dt

        // STEP 5 Update the positions
        // r1' = r1 + v1'*Dt
        // r2' = r2 + v2'*Dt
    }

    draw(){
        this.bodies.forEach(b => b.draw())
    }

    initialize(){
        this.bodies.push(new CelestialBody(this.context, 30, 50, 10, -1, 1000))
        this.bodies.push(new CelestialBody(this.context, 400, 400, 0, 0, 10000))
    }

    //=================================================================
    //==================== ALL PURPOSE FUNCTIONS ======================
    //=================================================================

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