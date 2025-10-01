import { WIDTH, HEIGHT, period } from './constants.js';

export default class FractalPlant {
    constructor(
        context,
        {
            axiom = "-X",
            rules = {
                "X": "F+[[X]-X]-F[-FX]+X",
                "F": "FF",
            },
            angle = -25,
            generations = 5,
            length = 5,
            lengthDecay = 0.95
        } = {}) {
        this.context = context
        this.axiom = axiom
        this.rules = rules
        this.angle = angle
        this.generations = generations
        this.length = length
        this.lengthDecay = lengthDecay

        this.ct = 0
        this.angleOffset = 0
    }


    // Given the axiom, the rules and the generations, return the complete l-system
    generateLSystem(){
        let sentence = this.axiom
        for(let i=0 ; i<this.generations ; i++){
            let nextSentence = ""
            for(let char of sentence){
                nextSentence += this.rules[char] || char
            }
            sentence = nextSentence
        }

        return sentence
    }

    next(){
        this.ct++
        this.angleOffset = 2*Math.sin(this.ct / 100)
    }

    // TODO can the "newer generations" be a lighter shade of green?
    // Nope it cannot
    draw(startX = 4/5*WIDTH, startY = HEIGHT, initialAngle = 90){
        const sentence = this.generateLSystem()

        let x = startX
        let y = startY
        let angle = initialAngle
        const stack = []
        let depth = 0; // track "generation" depth

        const ctx = this.context
        let green = 128
        // ctx.strokeStyle = "green"
        ctx.strokeStyle = `rgba(0, ${green}, 0, 1)`
        ctx.beginPath()
        ctx.moveTo(x, y)

        for(let instruction of sentence){
            switch (instruction) {
                case "F":
                    // const effectiveLength = this.length * Math.pow(this.lengthDecay, depth) // taper by depth
                    const effectiveLength = this.length
                    const rad = angle * Math.PI / 180
                    const deltaX = effectiveLength * Math.cos(rad)
                    const deltaY = effectiveLength * Math.sin(rad)
                    const newX = x + deltaX
                    const newY = y - deltaY // canvas Y goes down

                    // green = 128 + 15 * depth
                    green = 128
                    ctx.strokeStyle = `rgba(0, ${green}, 0, 1)`
                    ctx.lineTo(newX, newY)

                    // Newer depth has a lighter shade of green
                    //! It actually doesn't work, newer generations are not newer leaves
                    // ctx.beginPath()
                    // ctx.moveTo(x, y)
                    // ctx.lineTo(newX, newY)
                    // ctx.stroke()

                    x = newX
                    y = newY
                    break;
    
                case "-":
                    angle -= this.angle
                    break;
    
                case "+":
                    angle += this.angle
                    break;
    
                case "[":
                    stack.push({ x, y, angle, depth }) // save state
                    ctx.moveTo(x, y) // prevent auto-connecting lines
                    angle += this.angleOffset
                    depth++
                    break;
    
                case "]":
                    const state = stack.pop();
                    ({ x, y, angle, depth } = state);
                    ctx.moveTo(x, y)
                    break;
    
                default:
                    break;
            }
        }

        ctx.stroke()
    }

    drawOneByOne(startX, startY, initialAngle = 90, stopAt){
        const sentence = this.generateLSystem()

        let x = startX
        let y = startY
        let angle = initialAngle
        const stack = []
        let depth = 0; // track "generation" depth
        let elementDrawn = 0
        let isFinished = true

        const ctx = this.context
        ctx.strokeStyle = "green"
        ctx.beginPath()
        ctx.moveTo(x, y)

        for(let instruction of sentence){
            if(elementDrawn > stopAt){
                isFinished = false
                break
            }

            switch (instruction) {
                case "F":
                    const effectiveLength = this.length * Math.pow(this.lengthDecay, depth); // taper by depth
                    const rad = angle * Math.PI / 180
                    const deltaX = effectiveLength * Math.cos(rad)
                    const deltaY = effectiveLength * Math.sin(rad)
                    const newX = x + deltaX
                    const newY = y - deltaY // canvas Y goes down

                    ctx.lineTo(newX, newY)
                    elementDrawn++

                    x = newX
                    y = newY
                    break;
    
                case "-":
                    angle -= this.angle
                    break;
    
                case "+":
                    angle += this.angle
                    break;
    
                case "[":
                    stack.push({ x, y, angle, depth }) // save state
                    ctx.moveTo(x, y) // prevent auto-connecting lines
                    depth++
                    break;
    
                case "]":
                    const state = stack.pop();
                    ({ x, y, angle, depth } = state);
                    ctx.moveTo(x, y)
                    break;
    
                default:
                    break;
            }
        }

        ctx.stroke()
        return isFinished
    }

}

