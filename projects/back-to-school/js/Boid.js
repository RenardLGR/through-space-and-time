import { HEIGHT, WIDTH } from "./constants.js"

export default class Boid{
    constructor(context, dt, acceleration, velocity, position, mass){
        this.id = "boid"
        this.context = context
        this.dt = dt
        //acceleration as a vector with components in the x and y directions
        this.acceleration = acceleration
        //position as a vector with components in the x and y directions
        this.position = position
        //velocity as a vector with components in the x and y directions
        this.velocity = velocity
        this.mass = mass
        this.radius = 10
        this.color = "red"
        this.absMinAcceleration = 5
    }


    next(){
        let [ax, ay] = this.acceleration
        //Get them a minimum speed
        //TODO delete if you find a better trick to avoid boids from having the average global speed, i.e. not moving bcs speeds will cancel each other out
        ax = Math.sign(ax) * Math.max(Math.abs(ax), this.absMinAcceleration)
        ay = Math.sign(ay) * Math.max(Math.abs(ay), this.absMinAcceleration)

        let v = [this.velocity[0] + ax*this.dt , this.velocity[1] + ay*this.dt] // velocity in [x, y]
        this.velocity = v
        

        let r = [this.position[0] + this.velocity[0]*this.dt , this.position[1] + this.velocity[1]*this.dt] // position in [x, y]
        this.position = r

        //edges are wrapping around
        if(this.position[0] < 0){
            this.position[0] = WIDTH-1
        }
        if(this.position[0] >= WIDTH){
            this.position[0] = 0
        }
        if(this.position[1] < 0){
            this.position[1] = HEIGHT-1
        }
        if(this.position[1] >= HEIGHT){
            this.position[1] = 0
        }
    }

    draw(){
        this.context.beginPath();
        this.context.arc(this.position[0], this.position[1], this.radius, 0, 2 * Math.PI);
        this.context.fillStyle = this.color
        this.context.fill();
    }
}