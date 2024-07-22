import { COLS, ROWS, CELL_SIZE, period } from './constants.js';

export default class Car{
    constructor(context, grid){
        this.context = context
        this.grid = grid
        this.carWidth = 14
        this.carHeight = 28
        this.isMoving = true
        this.direction = "north" // where the front of the car points to
        this.gridPosition = [] // [row, col]
        this.position = [] // [y, x] in pixels
        this.cellPath = [] // cell path in [row, col]
        this.pixelPath = [] // pixel path in [y, x]
        this.target = [] // [row, col]
        this.start = [] // [row, col]
        this.speed = 5 // in px/refresh

        this.initialize()
    }

    next(){
        const [nearestCheckpointY, nearestCheckpointX] = this.pixelPath[0]
        const [currY, currX] = this.position
        if(currX-nearestCheckpointX > 0){
            this.direction = "west"
            this.position[1] = Math.max(currX-this.speed, nearestCheckpointX)
        }
        if(currX-nearestCheckpointX < 0){
            this.direction = "east"
            this.position[1] = Math.min(currX+this.speed, nearestCheckpointX)
        }
        if(currY-nearestCheckpointY > 0){
            this.direction = "north"
            this.position[0] = Math.max(currY-this.speed, nearestCheckpointY)
        }
        if(currY-nearestCheckpointY < 0){
            this.direction = "south"
            this.position[0] = Math.min(currY+this.speed, nearestCheckpointY)
        }


        //Check if the checkpoint is reached, to which case checkpoint is removed and we can go to the next
        if(this.position[0]===nearestCheckpointY && this.position[1]===nearestCheckpointX){
            this.pixelPath.shift()
        }

        //Check if the target is reached, in which case get a new target
        if(this.pixelPath.length === 0){
            this.newTarget()
        }
    }

    initialize(){
        this.start = this.getRandomRoad()
        this.target = this.getRandomRoad()
        // this.cellPath = this.calculateCellPath(this.start, this.target)
        this.cellPath = this.calculateCellPathDijkstra(this.start, this.target)
        // console.log("cell path:", this.cellPath);
        this.pixelPath = this.calculatePixelPath(this.cellPath)
        this.position = [this.pixelPath[0][0], this.pixelPath[0][1]]
        // console.log("pixel path:", this.pixelPath);
        // console.log("position:", this.position);
    }

    //Once a taxi mission has been completed, get a new mission
    newTarget(){
        this.start = this.target
        this.target = this.getRandomRoad()
        // this.cellPath = this.calculateCellPath(this.start, this.target)
        this.cellPath = this.calculateCellPathDijkstra(this.start, this.target)
        this.pixelPath = this.calculatePixelPath(this.cellPath)
        this.position = [this.pixelPath[0][0], this.pixelPath[0][1]]
    }

    draw(){
        // Function to draw the rotated car image
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

        var img = new Image();
        img.src = './img/car_topview.svg'

        const [y, x] = this.position
        switch (this.direction) {
            case "north":
                //Car is facing North
                img.onload = () => drawRotatedImage(this.context, img, x-this.carWidth/2, y-this.carHeight/2, this.carWidth, this.carHeight, 0)
                break;

            case "east":
                img.onload = () => drawRotatedImage(this.context, img, x-this.carWidth/2, y-this.carHeight/2, this.carWidth, this.carHeight, 90)
                break;

            case "south":
                img.onload = () => drawRotatedImage(this.context, img, x-this.carWidth/2, y-this.carHeight/2, this.carWidth, this.carHeight, 180)
                break;

            case "west":
                img.onload = () => drawRotatedImage(this.context, img, x-this.carWidth/2, y-this.carHeight/2, this.carWidth, this.carHeight, 270)
                break;
        
            default:
                throw new Error("Error : direction unknown, trying read direction : " + this.direction)
                break;
        }
    }

    // (void) : void
    // Debug/visualizing purposes : Draw the path the taxi will take
    drawPixelPath(){
        this.context.strokeStyle = "blue"

        this.context.beginPath()
        this.context.moveTo(this.pixelPath[0][1], this.pixelPath[0][0])
        this.pixelPath.forEach(([r, c]) => {
            this.context.lineTo(c, r) // c, r is NOT a typo
        })
        this.context.stroke()
    }

    // ([number, number], [number, number]) : Array<Array<number>>
    // calculate which cells should be visited in order to go from start to target
    //! DEPRECATED
    calculateCellPath(start, target){
        console.log(`start : ${start}, target : ${target}`)
        //Arrow functions inherit the this context from the enclosing scope.
        const solve = (inP) => {
            iterations++
            if(inP.length >= pathMaxLength) return

            let visited = Array.from({length : ROWS}, _ => Array(COLS).fill(false))
            inP.forEach(([r, c]) => visited[r][c] = true)

            let [currRow, currCol] = inP[inP.length-1]

            if(currRow === targetRow && currCol === targetCol){
                pathMaxLength = inP.length
                res = inP
                return
            }


            //From the current position, loop through connected cells and build the recursion
            const connectedTo = []
            //Is North connected ?
            if(currRow-1>=0 && this.grid[currRow][currCol].roadConnections.includes("north")){
                connectedTo.push([currRow-1, currCol])
            }
            //Is East connected ?
            if(currCol+1<COLS && this.grid[currRow][currCol].roadConnections.includes("east")){
                connectedTo.push([currRow, currCol+1])
            }
            //Is South connected ?
            if(currRow+1<ROWS && this.grid[currRow][currCol].roadConnections.includes("south")){
                connectedTo.push([currRow+1, currCol])
            }
            //Is West connected ?
            if(currCol-1>=0 && this.grid[currRow][currCol].roadConnections.includes("west")){
                connectedTo.push([currRow, currCol-1])
            }
            if(connectedTo.length === 0) throw new Error("Error : How can a road have no connections????" + `Check row=${currRow}, col=${currCol}`)

            for(let [connectionRow, connectionCol] of connectedTo){
                if(!visited[connectionRow][connectionCol] && inP.length<pathMaxLength){
                    solve([...inP, [connectionRow, connectionCol]])
                }
            }
        }

        let iterations = 0

        const [targetRow, targetCol] = target
        let res = []
        let pathMaxLength = Infinity
        solve([start])
        console.log(`start : ${start}, target : ${target}, iteration : ${iterations}`)
        return res
    }

    calculateCellPathDijkstra(start, target){
        const [startRow, startCol] = start
        const [targetRow, targetCol] = target

        let visited = Array.from({length : ROWS}, _ => Array(COLS).fill(false))
        // visited[startRow][startCol] = true

        //Distance of a current cell from the start
        let distances = Array.from({length : ROWS}, _ => Array(COLS).fill(Infinity))
        distances[startRow][startCol] = 0

        let predecessor = Array.from({length : ROWS}, _ => Array(COLS).fill(undefined))
        predecessor[startRow][startCol] = [startRow, startCol]

        while(true){
            let minDistance = Infinity
            let current = null

            // Find the unvisited cell with the smallest distance
            for(let row=0 ; row<ROWS ; row++){
                for(let col=0 ; col<COLS ; col++){
                    if(this.grid[row][col].id !== "void" && !visited[row][col] && distances[row][col]<minDistance){
                        minDistance = distances[row][col]
                        current = [row, col]
                    }
                }
            }

            if(current === null){
                //no more cells to visit
                break
            }

            const [currRow, currCol] = current
            visited[currRow][currCol] = true

            // Update distances of neighbors, knowing our current distance from the start
            //Is North connected ?
            if(currRow-1>=0 && this.grid[currRow][currCol].roadConnections.includes("north")){
                // Update distance of nbrs if needed
                let newDistance = distances[currRow][currCol] + 1
                if(newDistance < distances[currRow-1][currCol]){
                    distances[currRow-1][currCol] = distances[currRow][currCol] + 1
                    predecessor[currRow-1][currCol] = current
                }
            }
            //Is East connected ?
            if(currCol+1<COLS && this.grid[currRow][currCol].roadConnections.includes("east")){
                let newDistance = distances[currRow][currCol] + 1
                if(newDistance < distances[currRow][currCol+1]){
                    distances[currRow][currCol+1] = distances[currRow][currCol] + 1
                    predecessor[currRow][currCol+1] = current
                }
            }
            //Is South connected ?
            if(currRow+1<ROWS && this.grid[currRow][currCol].roadConnections.includes("south")){
                let newDistance = distances[currRow][currCol] + 1
                if(newDistance < distances[currRow+1][currCol]){
                    distances[currRow+1][currCol] = distances[currRow][currCol] + 1
                    predecessor[currRow+1][currCol] = current
                }
            }
            //Is West connected ?
            if(currCol-1>=0 && this.grid[currRow][currCol].roadConnections.includes("west")){
                let newDistance = distances[currRow][currCol] + 1
                if(newDistance < distances[currRow][currCol-1]){
                    distances[currRow][currCol-1] = distances[currRow][currCol] + 1
                    predecessor[currRow][currCol-1] = current
                }
            }
        }

        //In order to get the path, from the end, find the predecessor, keep doing it until we reach the start
        let res = [target]
        let [currCellRow, currCellCol] = target

        console.log("predecessor Array :", predecessor);

        while(currCellRow!==startRow || currCellCol!==startCol){ // Or !(currCellRow===startRow && currCellCol===startCol)
            res.unshift(predecessor[currCellRow][currCellCol])
            // [currCellRow, currCellCol] = [...predecessor[currCellRow][currCellCol]]
            let newCurCellRow = predecessor[currCellRow][currCellCol][0]
            let newCurCellCol = predecessor[currCellRow][currCellCol][1]
            currCellRow = newCurCellRow
            currCellCol = newCurCellCol
        }
        // res.unshift(start)

        console.log("start :", start)
        console.log("target :", target)
        console.log("path :", res)
        return res
    }

    // (Array<Array<number>>) : Array<Array<number>>
    //Once a cell path has been found, convert it to a pixel path our car can follow
    calculatePixelPath(path){
        //middle of cell -> side of cell -> middle of next cell -> etc. -> middle of target
        let res = []

        for(let i=0 ; i<path.length ; i++){
            let [row, col] = path[i]
            let middle = [row*CELL_SIZE + 1/2*CELL_SIZE, col*CELL_SIZE + 1/2*CELL_SIZE]
            res.push(middle)
            if(i === path.length-1) break

            //if there IS a next cell, go to the side toward this cell
            let [nextRow, nextCol] = path[i+1]
            let side = []
            //If next cell is on North
            if(row-nextRow === 1){
                side = [row*CELL_SIZE, col*CELL_SIZE + 1/2*CELL_SIZE]
            }
            //If next cell is on East
            if(col-nextCol === -1){
                side = [row*CELL_SIZE + 1/2*CELL_SIZE, col*CELL_SIZE + CELL_SIZE]
            }
            //If next cell is on South
            if(row-nextRow === -1){
                side = [row*CELL_SIZE + CELL_SIZE, col*CELL_SIZE + 1/2*CELL_SIZE]
            }
            //If next cell is on West
            if(col-nextCol === 1){
                side = [row*CELL_SIZE + 1/2*CELL_SIZE, col*CELL_SIZE]
            }

            res.push(side)
        }

        return res
    }

    // () : Array<number>
    getRandomRoad(){
        while(true){
            const row = this.randomNumberBetween(0, ROWS-1)
            const col = this.randomNumberBetween(0, COLS-1)
            if(this.grid[row][col].id !== "void"){
                return [row, col]
            }
        }
    }

    //=================================================================
    //==================== ALL PURPOSE FUNCTIONS ======================
    //=================================================================

    // (number, number) : number
    randomNumberBetween(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

}