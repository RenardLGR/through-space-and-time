import { COLS, ROWS, CELL_SIZE, period } from './constants.js';

import CelestialBody from './CelestialBody.js';

export default class Board {
    constructor(context){
        this.context = context
        this.bodies = []
        this.G = 9 // Gravitational constant, increase to have a more "powerful" gravity
        this.dt = 0.3 // increase for bigger movements per refresh, decrease for smaller movements per refresh

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
        // u is the unit vector from body 1 to body 2 u = (r2-r1)/r = (x2-x1, y2-y1)/r
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

        let accelerations = []
        for(let i=0 ; i<this.bodies.length ; i++){
            let ai = [0, 0]
            for(let j=0 ; j<this.bodies.length ; j++){
                if(i !== j){
                    let aFromJ = this.acceleration(this.bodies[i], this.bodies[j])
                    ai[0] += aFromJ[0]
                    ai[1] += aFromJ[1]
                }
            }
            console.log(i, ai);
            accelerations.push(ai)
        }

        accelerations.forEach((a, i) => {
            this.bodies[i].acceleration = a
            this.bodies[i].next() // updates speed and position
        })
    }

    // (CelestialBody, CelestialBody) : [number, number]
    acceleration(body1, body2){
        let [px1, py1] = body1.position
        let [px2, py2] = body2.position
        let r = Math.sqrt(Math.pow(px1-px2, 2) + Math.pow(py1-py2, 2))
        let u = [(px2-px1)/r, (py2-py1)/r] // in [x, y]
        let F12 = [u[0]*this.G*(body2.mass/Math.pow(r, 2)) , u[1]*this.G*(body2.mass/Math.pow(r, 2))] // in [x, y]

        // F12 is the force on body 1 due to body 2
        return F12
    }


    // When a collision is detected, a new celestial body should be created combining the mass and the velocity of the bodies. Furthermore, recheck if the new body has any collision, in which case repeat the process.
    collision(){
        for(let i=0 ; i<this.bodies.length ; i++){
            let ai = [0, 0]
            for(let j=0 ; j<this.bodies.length ; j++){
                if(i !== j && this.areSuperposed(this.bodies[i], this.bodies[j])){

                }
            }
        }
    }

    areColliding(body1, body2){
        // Two circles are colliding if the sum of the radii is greater than the distance between the two centers.
    }

    draw(){
        console.log(JSON.stringify(this.bodies))
        this.bodies.forEach(b => b.draw())
    }

    initialize(){
        //(context, dt, acceleration, velocity, position, mass)
        // this.bodies.push(new CelestialBody(this.context, this.dt, [0, 0], [10, -1], [40, 50], 1000))
        // this.bodies.push(new CelestialBody(this.context, this.dt, [0, 0], [0, 0], [400, 400], 10000))
        // this.bodies.push(new CelestialBody(this.context, this.dt, [0, 0], [5, -4], [200, 800], 15000))

        this.bodies.push(new CelestialBody(this.context, this.dt, [0, 0], [5, 2], [100, 300], 15000))
        this.bodies.push(new CelestialBody(this.context, this.dt, [0, 0], [-5, 2], [500, 300], 15000))
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