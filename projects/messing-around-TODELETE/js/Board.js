import { COLS, ROWS, CELL_SIZE, period } from './constants.js';

export default class Board {
    constructor(context){
        this.context = context
        this.grid = Array.from({length : ROWS}, _ => Array(COLS).fill(0)) // 1 is alive, 0 is dead
        this.nextGrid = Array.from({length : ROWS}, _ => Array(COLS).fill(0)) // 1 is alive, 0 is dead
        this.position = [200, 200]
        this.direction = "noth"
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
    }

    draw(){
        //horizontal line
        this.context.strokeStyle = "blue"

        this.context.beginPath()
        this.context.moveTo(150, 150)

        this.context.lineTo(200, 150)
        this.context.stroke()

        var img = new Image();
        img.src = './img/car_topview.svg'

        img.onload = () => drawRotatedImage(this.context, img, this.position[0], this.position[1], 14, 28, 90);

        // Function to draw the rotated image
        const drawRotatedImage = (ctx, image, x, y, width, height, angle) => {
            ctx.save(); // Save the current canvas state

            // Move the canvas origin to the image center
            ctx.translate(x + width / 2, y + height / 2);
        
            // Rotate the canvas by the specified angle
            ctx.rotate(angle * Math.PI / 180);
        
            // Draw the image, offsetting by half width and height to center it
            ctx.drawImage(image, -width / 2, -height / 2, width, height);
        
            ctx.restore(); // Restore the canvas state
        }

        // if(this.direction === "north"){
        //     //Img appears one page load
        //     img.onload = () => this.context.drawImage(img, this.position[0], this.position[1], 14, 28)
        //     //Img is redrawn every steps
        //     this.context.drawImage(img, this.position[0], this.position[1], 14, 28)
        // }
        // else{
        //     //Img appears one page load
        //     img.onload = function(){
        //         this.context.save();
        //         this.context.rotate(90*Math.PI/180);
        //         this.context.drawImage(img, 30, 30);
        //         this.context.restore();
        //       };
        //     this.context.rotate(Math.PI/2)
        //     //Img is redrawn every steps
        //     this.context.drawImage(img, this.position[0], this.position[1], 14, 28)
        // }
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