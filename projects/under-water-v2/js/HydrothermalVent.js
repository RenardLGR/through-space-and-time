import { WIDTH, HEIGHT } from './constants.js';
import Vector from './Vector.js';

export default class HydrothermalVent{
    constructor(context){
        this.context = context
        this.nVents = 3
        this.strokePos = []
        this.tops = []
        this.bubbles = []
        this.initialize()
    }

    initialize(){
        const colWidth = 1/70 * WIDTH // px
        const posX = 2/5 * WIDTH // aprox. centered around middle column

        let x, y, colHeight

        // 1st - leftest
        x = posX - 3/4 * colWidth
        y = HEIGHT
        colHeight = 1/4 * HEIGHT
        this.createColumn(x, y, colHeight, colWidth)

        // 2nd - middle
        x = posX
        y = HEIGHT
        colHeight = 1/3 * HEIGHT
        this.createColumn(x, y, colHeight, colWidth)

        // 3rd - right
        x = posX + 3/4 * colWidth
        y = HEIGHT
        colHeight = 1/5 * HEIGHT
        this.createColumn(x, y, colHeight, colWidth)
    }

    // (x: Number, y: Number, colHeight: Number, colWidth: Number) :  void - this.strokePos mutated, this.tops mutated
    createColumn(x, y, colHeight, colWidth){
        for(let i=0 ; i<colHeight ; i++, y--){
            let pos = {from: undefined, to: undefined}
            pos.from = new Vector(x, y)
            pos.to = new Vector(x + colWidth, y)
            this.strokePos.push(pos)

            // Random walker on x
            x += this.randomNumberBetween(-1, 1)
            // Greater as we go higher
            if(i > 1/4*colHeight){
                x += this.randomNumberBetween(-1, 1)
            }
            if(i > 1/2*colHeight){
                x += this.randomNumberBetween(-1, 1)
            }
        }
        this.tops.push(new Vector(x + 1/2*colWidth, y))
    }

    // Update bubble's position
    next(){
        this.bubbles.forEach(b => b.next())
        this.bubbles = this.bubbles.filter(b => b.alpha > 0)

        // Random chance to spawn a bubble
        if(Math.random() < 0.05){
            this.bubbles.push(this.getBubble())
        }
    }

    getBubble(){
        // Choose a random vent
        const ventIdx = this.randomNumberBetween(0, this.nVents-1)
        const alpha = this.randomNumberBetween(0, 10) / 10
        const position = new Vector(this.tops[ventIdx].x, this.tops[ventIdx].y)

        return new Bubble(this.context, position, alpha)
    }

    draw(){
        const ctx = this.context
        // Drawing hydrothermal vents
        ctx.strokeStyle = "rgba(16, 30, 10, 1)"
        this.strokePos.forEach(stroke => {
           ctx.beginPath()
           ctx.moveTo(stroke.from.x, stroke.from.y)
           ctx.lineTo(stroke.to.x, stroke.to.y)
           ctx.stroke()
        })

        // Drawing bubbles
        this.bubbles.forEach(b => b.draw())
    }


    // (number, number) : number
    randomNumberBetween(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}

class Bubble{
    constructor(context, position, alpha){
        this.context = context
        this.position = position
        this.alpha = alpha || 1
    }

    next(){
        this.position.y -= 0.5
        this.position.x += Math.sin(this.position.y / 20) / 2
        this.alpha -= 0.002
    }

    draw(){
        const ctx = this.context
        const centerX = this.position.x
        const centerY = this.position.y
        const radius = 1/200 * WIDTH
        const color = `rgba(255, 255, 255, ${this.alpha})`

        const gradient = ctx.createRadialGradient(centerX, centerY, 1, centerX, centerY, radius)
        gradient.addColorStop(0, "transparent")
        gradient.addColorStop(1, color)

        ctx.fillStyle = gradient
        ctx.strokeStyle = color

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2*Math.PI)
        ctx.stroke()
        ctx.fill()
    }
}