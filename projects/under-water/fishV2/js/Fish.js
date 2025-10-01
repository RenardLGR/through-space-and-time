import Vector from "./Vector.js"

export default class Fish {
    constructor(context, position, speed, acceleration){
            this.id = "Fish"
            this.context = context    
            this.position = position || new Vector(0, 0)
            this.speed = speed || new Vector(0, 0)
            this.acceleration = acceleration || new Vector(0, 0)
    }
}