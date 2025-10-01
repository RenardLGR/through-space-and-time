import { WIDTH, HEIGHT, period } from './constants.js';
import Vector from './Vector.js';


export default class Obstacle{
    constructor(context){
        this.context = context
        this.nodes = []

        this.initialization()
    }

    // Obstacle on the bottom left corner
    initialization(){
        const nNodesSide = 30 // number of nodes on a side of the obstacle
        let offsetX = WIDTH/100
        let offsetY
        let sign

        const start = new Vector(0, 3*HEIGHT/4)
        this.nodes.push(start)

        let node = start.copy()
        // Horizontal side
        for(let i=0 ; i<nNodesSide ; i++){
            offsetY = this.randomNumberBetween(HEIGHT/30, HEIGHT/25)
            sign = this.randomNumberBetween(0, 1) === 0 ? -1 : 1

            // prevent the obstacle from being too high
            if(node.y < 2*HEIGHT/3) sign = 1
            node = node.copy().add(new Vector(offsetX, offsetY*sign))
            this.nodes.push(node)
        }

        // Vertical side - cliff (keep the slope : offsetY)
        while(node.y < HEIGHT){
            sign = 1

            node = node.copy().add(new Vector(offsetX*sign, offsetY))
            this.nodes.push(node)
        }
    }


    draw(){
        const color = "firebrick"
        // this.context.strokeStyle = color
        this.context.fillStyle = color
        this.context.lineWidth = 5
        this.context.moveTo(0, HEIGHT) // move bottom left corner
        for(let node of this.nodes){
            this.context.lineTo(node.x, node.y)
        }
        this.context.closePath()
        this.context.fill()
    }


    // (number, number) : number
    randomNumberBetween(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}