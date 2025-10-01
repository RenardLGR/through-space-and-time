import { WIDTH, HEIGHT, period } from './constants.js';
import Fish from "./FishPrey.js"
import Vector from "./Vector.js"
import FishPredator from './FishPredator.js';
import FishPrey from './FishPrey.js';

export default class Board {
    constructor(context){
        this.context = context

        this.numberOfFishes = 25 // How many fishes on screen
        this.fishes = []
        this.predators = []
        this.initialize()
    }

    initialize(){
    }

    
    //From the existing environment, this function generates the next generation
    next(){        
        this.fishes.forEach(fish => fish.next())
        this.predators.forEach(pred => pred.next())
        this.keepNumberOfFishesStable()

        this.fishes.forEach(f => {
            f.fishes = this.fishes
            f.predators = this.predators
        })
    }
    
    draw(){
        this.predators.forEach(pred => pred.draw())
        // this.obstacle.draw()
        this.fishes.forEach(fish => fish.draw())
    }
    
    // Get a fish from a side toward the center of the screen, as if it was appearing out of nowhere
    // (void) : Fish
    getFish(){
        let centerX = WIDTH / 2
        let centerY = HEIGHT / 2
        let delta = 25 //distance from the side of the screen in px where a fish will be spawned

        let direction = this.randomNumberBetween(1, 1) // every fishes come from the EAST
        let px
        let py
        let sign

        switch (direction) {
            //From North
            case 0:
                px = this.randomNumberBetween(0, WIDTH)
                py = - delta
                break;

            case 1:
                px = WIDTH + delta
                // py = this.randomNumberBetween(0, HEIGHT)
                py = this.randomNumberBetween(HEIGHT/4, 3*HEIGHT/4)
                break;

            case 2:
                px = this.randomNumberBetween(0, WIDTH)
                py = HEIGHT + delta
                break;

            case 3:
                px = - delta
                py = this.randomNumberBetween(0, HEIGHT)
                break;

            default:
                break;
        }

        sign = px > centerX ? -1 : 1
        let vx = sign * this.randomNumberBetween(1, 4)

        sign = py > centerY ? -1 : 1
        let vy = sign * this.randomNumberBetween(0, 0)
        
        let position = new Vector(px, py)
        let speed = new Vector(vx, vy)
        let fish = new Fish(this.context, position, speed)

        return fish
    }

    getFishPrey(){
        const fish = this.getFish()

        return new FishPrey(fish.context, fish.position, fish.speed, fish.acceleration)
    }

    getFishPredator(){
        const fish = this.getFish()

        return new FishPredator(fish.context, fish.position, fish.speed.mult(2), fish.acceleration)
    }

    // (Fish) : boolean
    isCloseToScreen(fish){
        let [px, py] = [fish.position.x, fish.position.y]
        let maxDistance = 50 // max distance from the side of the screen
        return (px>-maxDistance && px<maxDistance+WIDTH && py>-maxDistance && py<maxDistance+HEIGHT)
    }

    // Get rid of out of screen fishes, add new ones
    // (void) : void
    keepNumberOfFishesStable(){
        //Clean up
        this.fishes = this.fishes.filter(f => this.isCloseToScreen(f))
        this.predators = this.predators.filter(p => this.isCloseToScreen(p))

        let fishPerTurnLimit = 1
        //Add
        while(this.fishes.length < this.numberOfFishes && fishPerTurnLimit > 0){
            fishPerTurnLimit--
            let fishPrey = this.getFishPrey()
            
            this.fishes.push(fishPrey)
        }

        // 1 in 1000 chance to spawn a predator
        if(this.randomNumberBetween(0, 5000) <= 5){
            let fishPredator = this.getFishPredator()
            this.predators.push(fishPredator)
        }
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