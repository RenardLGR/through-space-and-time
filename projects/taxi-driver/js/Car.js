import { COLS, ROWS, CELL_SIZE, period } from './constants.js';

export default class Car{
    constructor(context, grid){
        this.context = context
        this.grid = grid
        this.direction = "north" // where the front of the car points to
        this.gridPosition = [] // [row, col]
        this.position = [] // [y, x] in pixels
        this.path = []
        this.target = [] // [row, col]
        this.start = [] // [row, col]

        this.tempPathingAttempt()
    }


    draw(){
        var img = new Image();
        img.src = './img/car_topview.svg'
        //Img appears one page load
        img.onload = () => this.context.drawImage(img, this.car[0], this.car[1], 15, 30)
        //Img is redrawn every steps
        this.context.drawImage(img, this.car[0], this.car[1], 15, 30)
    }

    tempPathingAttempt(){
        let start = this.getRandomRoad()
        let target = this.getRandomRoad()
        this.calculatePath(start, target)
        console.log(`start : ${start} : ${this.grid[start[0]][start[1]].id}`)
        console.log(`target : ${target} : ${this.grid[target[0]][target[1]].id}`)
        console.log(this.path)
    }

    // ([number, number], [number, number]) : void
    calculatePath(start, target){
        //Arrow functions inherit the this context from the enclosing scope.
        const solve = (inP) => {
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