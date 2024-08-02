import { WIDTH, HEIGHT, CELL_SIZE, period } from './constants.js';

import Boid from './Boid.js';

export default class Space {
    constructor(context){
        this.context = context
        this.boids = []
        this.dt = 0.1 // increase for bigger movements per refresh, decrease for smaller movements per refresh

        this.flockRadius = 200 // in px, an individual boid maneuvers based on the positions and velocities its nearby flockmates, flockRadius put a value to "nearby"
        this.steeringMaxForce = 0.5 // steering is a force to incentivize a boid to move alongside its flockmates

        this.initialize()
    }

    next(){
        this.boids.forEach(b => {
            b.acceleration = this.getSteeringForce(b)
        })

        this.boids.forEach(b => {
            b.next()
        })
    }
    
    // (Boid) : [number, number]
    // steering is a force to incentivize a boid to move alongside its flockmates, it will change the acceleration of a boid
    // it is the difference between the current velocity and the desired velocity (an average of the flockmates' velocities)
    getSteeringForce(boid){
        let steeringForce = [0, 0]
        let ct = 0
        for(let i=0 ; i<this.boids.length ; i++){
            // The strict equality operator checks for reference equality when it comes to objects.
            let distance = this.getDistanceBetweenTwoBoids(boid, this.boids[i])
            if(boid !== this.boids[i] && distance <= this.flockRadius){
                ct++
                steeringForce[0] += boid.velocity[0]
                steeringForce[1] += boid.velocity[1]
            }
        }

        // averaging
        steeringForce[0] /= ct
        steeringForce[1] /= ct

        steeringForce[0] = boid.velocity[0] - steeringForce[0]
        steeringForce[1] = boid.velocity[1] - steeringForce[1]

        return steeringForce
    }

    // (Boid, Boid) : number
    getDistanceBetweenTwoBoids(boid1, boid2){
        let [px1, py1] = boid1.position
        let [px2, py2] = boid2.position

        return Math.sqrt(Math.pow(px1-px2, 2) + Math.pow(py1-py2, 2))
    }

    initialize(){
        for(let i=0 ; i<40 ; i++){
            this.boids.push(new Boid(this.context, this.dt, [0, 0], [this.randomNumberBetween(1, 5), this.randomNumberBetween(1, 5)], [this.randomNumberBetween(1, WIDTH), this.randomNumberBetween(1, HEIGHT)], 1))
        }
    }

    draw(){
        this.boids.forEach(b => b.draw())
    }


    //=================================================================
    //==================== ALL PURPOSE FUNCTIONS ======================
    //=================================================================

    // (number, number) : number
    randomNumberBetween(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    
}