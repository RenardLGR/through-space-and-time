import { COLS, ROWS, CELL_SIZE, period } from './constants.js';

export default class Car{
    constructor(context, grid){
        this.context = context
        this.grid = grid
        this.direction = "north" // where the front of the car points to
        this.gridPosition = [] // [row, col]
        this.position = [0, 0] // [y, x] in pixels
        this.path = []
        this.target = [] // [row, col]
        this.start = [] // [row, col]

        this.tempPathingAttempt()
    }


    draw(){
        var img = new Image();
        img.src = './img/car_topview.svg'
        //Img appears one page load
        img.onload = () => this.context.drawImage(img, this.position[0], this.position[1], 14, 28)
        //Img is redrawn every steps
        this.context.drawImage(img, this.position[0], this.position[1], 14, 28)
    }

    //TODEL
    tempPathingAttempt(){
        let start = this.getRandomRoad()
        let target = this.getRandomRoad()
        this.calculatePath(start, target)
        console.log(`start : ${start} : ${this.grid[start[0]][start[1]].id}`)
        console.log(`target : ${target} : ${this.grid[target[0]][target[1]].id}`)
        console.log(this.path)
    }

    //TODEL
    drawPixelPath(){
        this.context.strokeStyle = "blue"
        let pixelPath = this.calculatePixelPath(this.path)
        console.log(pixelPath);

        this.context.beginPath()
        this.context.moveTo(pixelPath[0][1], pixelPath[0][0])
        pixelPath.forEach(([r, c]) => {
            this.context.lineTo(c, r) // c, r is NOT a typo
        })
        this.context.stroke()
    }

    // ([number, number], [number, number]) : void
    // calculate which cells should be visited in order to go from start to target
    calculatePath(start, target){
        //Arrow functions inherit the this context from the enclosing scope.
        const solve = (inP) => {
            if(inP.length >= pathMaxLength) return

            let visited = Array.from({length : ROWS}, _ => Array(COLS).fill(false))
            inP.forEach(([r, c]) => visited[r][c] = true)

            let [currRow, currCol] = inP[inP.length-1]

            if(currRow === targetRow && currCol === targetCol){
                pathMaxLength = inP.length
                this.path = inP
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


        const [startRow, startCol] = start
        const [targetRow, targetCol] = target
        let pathMaxLength = Infinity
        solve([start])
    }

    // (Array<Array<number>>) : Array<Array<number>>
    calculatePixelPath(path){
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