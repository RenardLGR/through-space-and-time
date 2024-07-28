import { WIDTH, HEIGHT, CELL_SIZE, period } from './constants.js';

import CelestialBody from './CelestialBody.js';

export default class Board {
    constructor(context){
        this.context = context
        this.bodies = []
        this.G = 5 // Gravitational constant, increase to have a more "powerful" gravity
        this.dt = 0.1 // increase for bigger movements per refresh, decrease for smaller movements per refresh
        this.criticalMass = 100000 // the mass needed for a body to "explode"

        this.initialize()
    }

    //From the existing environment, this function generates the next generation
    next(){
        // STEP 1 Initial data
        // Positions: Let the initial positions of the two celestial bodies be r1 = (x1, y1) and r2 = (x2, y2)
        // Velocities: Let the initial velocities of the two celestial bodies be v1 = (v1x, v1y) and v2 = (v2x, v2y)
        // Masses: Let the initial masses of the two celestial bodies be m1 and m2

        // STEP 2 Calculate the gravitational force
        // F12 = G(m1m2/r²)u
        // where :
        // F12 is the force on body 1 due to body 2
        // G is the gravitational constant
        // r is the distance between the bodies r = sqrt((x1-x2)² + (y1-y2)²)
        // u is the unit vector from body 1 to body 2 u = (r2-r1)/r = (x2-x1, y2-y1)/r
        // Finally, we have F12 = F1 = -F2

        // STEP 3 Calculate the acceleration
        // Using Newton's second law F = ma
        // a1 = G(m2/r²)u
        // a2 = -G(m1/r²)u

        // STEP 4 Update the velocities
        // Assuming a small time step Dt = 1 second
        // v1' = v1 + a1*Dt
        // v2' = v2 + a2*Dt

        // STEP 5 Update the positions
        // r1' = r1 + v1'*Dt
        // r2' = r2 + v2'*Dt

        let accelerations = []
        for(let i=0 ; i<this.bodies.length ; i++){
            let ai = [0, 0]
            for(let j=0 ; j<this.bodies.length ; j++){
                if(i !== j){
                    let aFromJ = this.acceleration(this.bodies[i], this.bodies[j])
                    ai[0] += aFromJ[0]
                    ai[1] += aFromJ[1]
                }
            }
            accelerations.push(ai)
        }

        accelerations.forEach((a, i) => {
            this.bodies[i].acceleration = a
            this.bodies[i].next() // updates speed and position
        })

        //Check for collision
        this.checkingCollision()

        //Check for critical mass
        this.checkingCriticalMass()

        //Low bodies
        this.lowBodies()
    }

    // Calculate the acceleration on body1 by body2
    // (CelestialBody, CelestialBody) : [number, number]
    acceleration(body1, body2){
        let [px1, py1] = body1.position
        let [px2, py2] = body2.position
        let r = Math.sqrt(Math.pow(px1-px2, 2) + Math.pow(py1-py2, 2))
        let u = [(px2-px1)/r, (py2-py1)/r] // in [x, y]
        let F12 = [u[0]*this.G*(body2.mass/Math.pow(r, 2)) , u[1]*this.G*(body2.mass/Math.pow(r, 2))] // in [x, y]

        // F12 is the force on body 1 due to body 2
        return F12
    }

    // When there is very little bodies on the screen, get rid of those who are too far away, add new ones
    // (void) : void
    lowBodies(){
        //Clean up
        this.bodies = this.bodies.filter((b => this.isCloseToScreen(b)))

        //Add
        let minBodies = 10
        while(this.bodies.length < minBodies){
            let body = this.getIncomingBody()
            
            this.bodies.push(body)
        }
    }

    // Get a celestial body from a side toward the center of the screen, as if it was appearing out of nowhere
    // (void) : CelestialBody
    getIncomingBody(){
        let centerX = WIDTH / 2
        let centerY = HEIGHT / 2
        let delta = 50 //distance from the side of the screen in px where a body will be spawned

        let direction = this.randomNumberBetween(0, 3)
        let px
        let py
        let sign

        switch (direction) {
            //From North
            case 0:
                px = this.randomNumberBetween(0, WIDTH)
                py = - delta
                break;

            case 1:
                px = WIDTH + delta
                py = this.randomNumberBetween(0, HEIGHT)
                break;

            case 2:
                px = this.randomNumberBetween(0, WIDTH)
                py = HEIGHT + delta
                break;

            case 3:
                px = - delta
                py = this.randomNumberBetween(0, HEIGHT)
                break;

            default:
                break;
        }

        sign = px > centerX ? -1 : 1
        let vx = sign * this.randomNumberBetween(5, 25)

        sign = py > centerY ? -1 : 1
        let vy = sign * this.randomNumberBetween(5, 25)

        return new CelestialBody(this.context, this.dt, [0, 0], [vx, vy], [px, py], this.randomNumberBetween(50, 2000))
    }

    // (CelestialBody) : boolean
    isCloseToScreen(body){
        let [px, py] = body.position
        let maxDistance = 100 // max distance from the side of the screen
        return (px>-maxDistance && px<maxDistance+WIDTH && py>-maxDistance && py<maxDistance+HEIGHT)
    }

    // When a critical mass is detected, it explodes in multiple bodies adding up to its original mass
    // (void) : void
    checkingCriticalMass(){
        for(let i=0 ; i<this.bodies.length ; i++){
            if(this.isCriticalMass(this.bodies[i])){
                let newBodies = this.getCriticalMassResult(this.bodies[i])
                this.bodies.splice(i ,1)
                this.bodies = this.bodies.concat(newBodies)
            }
        }
    }

    // When a body reaches a critical mass, it explodes in multiple bodies adding up to its original mass
    // (CelestialBody) : boolean
    isCriticalMass(body){
        return body.mass > this.criticalMass
    }

    // When a body reaches a critical mass, it explodes in multiple bodies adding up to its original mass
    // (CelestialBody) : Array <CelestialBody>
    getCriticalMassResult(body){
        // Tbh what happens here is not very crucial as the distance between bodies will be so small, their acceleration will be immense and hard to predict. The viewing effect is however quite pleasing
        let m = body.mass
        let [px, py] = body.position

        let res = []
        for(let i=0 ; i<this.randomNumberBetween(1, 3) ; i++){
            let randMass = this.randomNumberBetween(50, m)
            m -= randMass
            res.push(new CelestialBody(this.context, this.dt, [0, 0], [this.randomNumberBetween(-5, 5), this.randomNumberBetween(-5, 5)], [px+this.randomNumberBetween(-10, 10), py+this.randomNumberBetween(-10, 10)], Math.max(50, randMass)))
        }

        res.push(new CelestialBody(this.context, this.dt, [0, 0], [this.randomNumberBetween(-5, 5), this.randomNumberBetween(-5, 5)], [px+this.randomNumberBetween(-10, 10), py+this.randomNumberBetween(-10, 10)], Math.max(50, m)))
        return res
    }


    // When a collision is detected, a new celestial body should be created combining the mass and the velocity of the bodies. Furthermore, recheck if the new body has any collision, in which case repeat the process.
    // (void) : void
    checkingCollision(){
        for(let i=0 ; i<this.bodies.length ; i++){
            for(let j=0 ; j<this.bodies.length ; j++){
                //Delete i and j bodies
                if(i !== j && this.areColliding(this.bodies[i], this.bodies[j])){
                    let body = this.getCollisionResult(this.bodies[i], this.bodies[j])
                    this.bodies.splice(j ,1)
                    this.bodies.splice(i ,1)
                    this.bodies.push(body)
                    this.checkingCollision()
                }
            }
        }
    }

    // Check if two celestial bodies are colliding
    // (CelestialBody, CelestialBody) : boolean
    areColliding(body1, body2){
        // Two circles are colliding if the sum of the radii is greater than the distance between the two centers.
        let [px1, py1] = body1.position
        let [px2, py2] = body2.position
        let r1 = body1.radius
        let r2 = body2.radius

        let d = Math.sqrt(Math.pow(px1-px2, 2) + Math.pow(py1-py2, 2))
        let sigmaR = r1 + r2

        return d <= sigmaR
    }

    // Get a new celestial body resulting of the collision
    // (CelestialBody, CelestialBody) : CelestialBody
    getCollisionResult(body1, body2){
        let m1 = body1.mass
        let m2 = body2.mass
        let m = m1 + m2

        //the resulting initial position will be a weighted average based on their masses
        let [px1, py1] = body1.position
        let [px2, py2] = body2.position
        let px = (m1*px1 + m2*px2) / (m1 + m2)
        let py = (m1*py1 + m2*py2) / (m1 + m2)

        //the resulting initial velocity will be a weighted average based on their masses
        let [vx1, vy1] = body1.velocity
        let [vx2, vy2] = body2.velocity
        let vx = (m1*vx1 + m2*vx2) / (m1 + m2) 
        let vy = (m1*vy1 + m2*vy2) / (m1 + m2)

        return new CelestialBody(this.context, this.dt, [0, 0], [vx, vy], [px, py], m)
    }

    draw(){
        this.bodies.forEach(b => b.draw())
    }

    initialize(){
        //(context, dt, acceleration, velocity, position, mass)
        // Big ones
        for(let i=0 ; i<10 ; i++){
            this.bodies.push(new CelestialBody(this.context, this.dt, [0, 0], [this.randomNumberBetween(-10, 10), this.randomNumberBetween(-10, 10)], [this.randomNumberBetween(0, WIDTH), this.randomNumberBetween(0, HEIGHT)], this.randomNumberBetween(50, 2000)))
        }

        //Small ones
        for(let i=0 ; i<10 ; i++){
            this.bodies.push(new CelestialBody(this.context, this.dt, [0, 0], [this.randomNumberBetween(-40, 40), this.randomNumberBetween(-40, 40)], [this.randomNumberBetween(0, WIDTH), this.randomNumberBetween(0, HEIGHT)], this.randomNumberBetween(10, 200)))
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