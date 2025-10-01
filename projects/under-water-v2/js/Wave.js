import { WIDTH, HEIGHT } from './constants.js';
import Vector from './Vector.js';

export default class Wave {
    constructor(context){
        this.context = context
        this.width = WIDTH
        this.height = HEIGHT
        this.amplitude = 25
        this.wavelength = 1/30 // period of 40 PI
        this.origin = 0

        this.coords = []

        this.balloonRadius = 30
        this.balloonRotateAngle = 20
        this.balloonX = Math.floor(3/4*this.width)

        this.sign = 1
        this.ct = 0
    }

    //From the existing environment, this function generates the next generation
    next(){
        this.ct++
        if(this.ct % 80 === 0) this.sign = -this.sign
        const epsilonA = this.randomNumberBetween(0, 1000) / 1000000 // <0.1%
        // const epsilonW = this.randomNumberBetween(0, 1000) / 1000000 // <0.1%
        this.amplitude += epsilonA * this.amplitude * this.sign // a modification within the range of epsilon of precedent value
        // this.wavelength += epsilonW * this.wavelength * this.sign // a modification within the range of epsilon of precedent value
        this.origin += 0.01
        this.balloonRotateAngle -= 0.2
    }

    draw(){        
        const imageData = this.context.createImageData(this.width, this.height)
        const pixelNumber = this.width * this.height
        // imageData.data is pixelNumber * 4 long, since 1 pixel takes 4 bytes and 1 element of data is 1 byte
        // For example, the 0th pixel is stored over data[0], data[1], data[2] and data[3]

        // The wave is about at the top 1/8
        const waveYPosition = Math.floor(1/8 * this.height) // line of the wave
        let dataStart = waveYPosition * this.width * 4

        let balloonY

        this.coords = []
        for(let x=0 ; x<this.width ; x++, dataStart += 4){
            const wave = this.amplitude * Math.sin(x * this.wavelength + this.origin)
            const wave2 = this.amplitude/2 * Math.sin(x * this.wavelength/2)
            const wave3 = this.amplitude/4 * Math.cos(x * this.wavelength/7)
            const combinedWave = Math.floor(wave + wave2 + wave3)
            const yOffset = combinedWave // yOffset - the combined wave is actually the y offset

            const position = new Vector(x, waveYPosition + yOffset)
            this.coords.push(position)

            const pixelOffset = yOffset * this.width
            const dataOffset = pixelOffset * 4

            // Each pixel takes 4 entries in the imageData.data array (RGBA)

            // Top of the wave pixels
            imageData.data[dataStart + dataOffset + 0] = 255; // R value
            imageData.data[dataStart + dataOffset + 1] = 255; // G value
            imageData.data[dataStart + dataOffset + 2] = 255; // B value
            imageData.data[dataStart + dataOffset + 3] = 255; // A value

            // Under the wave pixels
            for(let i=dataStart + dataOffset + this.width * 4 ; i<imageData.data.length ; i += this.width*4){
                const pixel = i/4
                const xCoord = pixel % this.width // x coord is the remainder of pixel / width
                const yCoord = Math.floor(pixel / this.width) // y coord is the Euclidean quotient of pixel / width
                const gradient = (yCoord / this.height) * 100 // gradient is a value between 0-100 depending on the deepness

                // blue(y) = ay + b
                // blue(0) = 255 => full blue for the 0th line => b = 255
                // blue(height) = 0 => full black for the last line => a = -255/height
                // blue(y) = -255/height + 255
                const blue = -255/yCoord + 255

                imageData.data[i + 0] = 0; // R value
                imageData.data[i + 1] = 0; // G value
                imageData.data[i + 2] = 200 - gradient; // B value
                // imageData.data[i + 2] = blue; // B value
                imageData.data[i + 3] = 255; // A value
            }

            // Calculate balloon y
            if(x === this.balloonX){
                balloonY = waveYPosition + yOffset - this.balloonRadius
            }
        }
        this.context.putImageData(imageData, 0, 0)
        this.drawBalloon(this.balloonX, balloonY, this.balloonRadius)
    }

    drawBalloon(centerX, centerY, radius){        
        this.context.strokeStyle = "black"

        // White arc
        this.context.fillStyle = "white"
        this.context.beginPath()
        this.context.moveTo(centerX, centerY)
        this.context.arc(centerX, centerY, radius, (20+this.balloonRotateAngle)/180*Math.PI, (320+this.balloonRotateAngle)/180*Math.PI, true) // If true, draws the arc counter-clockwise between the start and end angles.
        this.context.lineTo(centerX, centerY)
        this.context.closePath()
        this.context.stroke()
        this.context.fill()

        // Yellow arc
        this.context.fillStyle = "yellow"
        this.context.beginPath()
        this.context.moveTo(centerX, centerY)
        this.context.arc(centerX, centerY, radius, (320+this.balloonRotateAngle)/180*Math.PI, (260+this.balloonRotateAngle)/180*Math.PI, true) // If true, draws the arc counter-clockwise between the start and end angles.
        this.context.lineTo(centerX, centerY)
        this.context.closePath()
        this.context.stroke()
        this.context.fill()

        // White arc
        this.context.fillStyle = "white"
        this.context.beginPath()
        this.context.moveTo(centerX, centerY)
        this.context.arc(centerX, centerY, radius, (260+this.balloonRotateAngle)/180*Math.PI, (200+this.balloonRotateAngle)/180*Math.PI, true) // If true, draws the arc counter-clockwise between the start and end angles.
        this.context.lineTo(centerX, centerY)
        this.context.closePath()
        this.context.stroke()
        this.context.fill()

        // Lime arc
        this.context.fillStyle = "lime"
        this.context.beginPath()
        this.context.moveTo(centerX, centerY)
        this.context.arc(centerX, centerY, radius, (200+this.balloonRotateAngle)/180*Math.PI, (140+this.balloonRotateAngle)/180*Math.PI, true) // If true, draws the arc counter-clockwise between the start and end angles.
        this.context.lineTo(centerX, centerY)
        this.context.closePath()
        this.context.stroke()
        this.context.fill()

        // White arc
        this.context.fillStyle = "white"
        this.context.beginPath()
        this.context.moveTo(centerX, centerY)
        this.context.arc(centerX, centerY, radius, (140+this.balloonRotateAngle)/180*Math.PI, (80+this.balloonRotateAngle)/180*Math.PI, true) // If true, draws the arc counter-clockwise between the start and end angles.
        this.context.lineTo(centerX, centerY)
        this.context.closePath()
        this.context.stroke()
        this.context.fill()

        // Aqua arc
        this.context.fillStyle = "Aqua"
        this.context.beginPath()
        this.context.moveTo(centerX, centerY)
        this.context.arc(centerX, centerY, radius, (80+this.balloonRotateAngle)/180*Math.PI, (20+this.balloonRotateAngle)/180*Math.PI, true) // If true, draws the arc counter-clockwise between the start and end angles.
        this.context.lineTo(centerX, centerY)
        this.context.closePath()
        this.context.stroke()
        this.context.fill()

        // Red center dot
        this.context.fillStyle = "red"
        this.context.beginPath()
        this.context.moveTo(centerX, centerY)
        this.context.arc(centerX, centerY, 1/5*radius, 0/180*Math.PI, 360/180*Math.PI, true) // If true, draws the arc counter-clockwise between the start and end angles.
        this.context.lineTo(centerX, centerY)
        this.context.closePath()
        // this.context.stroke()
        this.context.fill()

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