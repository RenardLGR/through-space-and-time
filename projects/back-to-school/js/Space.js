import { WIDTH, HEIGHT, CELL_SIZE, period } from './constants.js';

import Boid from './Boid.js';

export default class Space {
    constructor(context){
        this.context = context
        this.boids = []
        this.dt = 0.1 // increase for bigger movements per refresh, decrease for smaller movements per refresh

        this.flockRadius = 100 // in px, an individual boid maneuvers based on the positions and velocities its nearby flockmates, flockRadius put a value to "nearby"
        this.steeringMaxForce = 0.5 // steering is a force to incentivize a boid to move alongside its flockmates

        this.initialize()
    }

    next(){
        //align
        this.boids.forEach(b => {
            b.acceleration = this.getSteeringForce(b)
        })

        this.boids.forEach(b => {
            b.next()
        })
    }
    
    // (Boid) : [number, number]
    // steering is a force to incentivize a boid to move alongside its flockmates, it will change the acceleration of a boid
    // it is the difference between the desired velocity (an average of the flockmates' velocities) and the current velocity
    getSteeringForce(boid){
        let steeringForce = [0, 0]
        let ct = 0
        for(let i=0 ; i<this.boids.length ; i++){
            // The strict equality operator checks for reference equality when it comes to objects.
            // boid !== this.boids[i] 
            let distance = this.getDistanceBetweenTwoBoids(boid, this.boids[i])
            if(distance <= this.flockRadius){
                ct++
                steeringForce[0] += this.boids[i].velocity[0]
                steeringForce[1] += this.boids[i].velocity[1]
            }
        }

        // averaging
        if(ct > 0){
            steeringForce[0] /= ct
            steeringForce[1] /= ct
        }

        //difference between the desired velocity and the current velocity
        steeringForce[0] -= boid.velocity[0]
        steeringForce[1] -= boid.velocity[1]

        //TODO limit the length of the vector to the maximum steering force
        return steeringForce
    }

    // (Boid, Boid) : number
    getDistanceBetweenTwoBoids(boid1, boid2){
        let [px1, py1] = boid1.position
        let [px2, py2] = boid2.position

        return Math.sqrt(Math.pow(px1-px2, 2) + Math.pow(py1-py2, 2))
    }

    initialize(){
        for(let i=0 ; i<30 ; i++){
            this.boids.push(new Boid(this.context, this.dt, [0, 0], [this.randomNumberBetween(-20, 20), this.randomNumberBetween(-20, 20)], [this.randomNumberBetween(1, WIDTH), this.randomNumberBetween(1, HEIGHT)], 1))
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