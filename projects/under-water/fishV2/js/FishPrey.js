import Vector from "./Vector.js"
import Fish from "./Fish.js"

// https://www.red3d.com/cwr/boids/
// https://www.cs.toronto.edu/~dt/siggraph97-course/cwr87/

export default class FishPrey extends Fish {
    constructor(context, position, speed, acceleration){
        super(context, position, speed, acceleration)
        this.id = "FishPrey"
        
        this.fishes
        this.predators = []
        this.obstacle = {nodes : []}


        this.perception = 100 // radius representing the range of the fish's neighborhood

        this.maxForce = 0.1
        this.minSpeed = 1.0
        this.maxSpeed = 4

        this.angle = 0
        this.wiggleTime = 0 // phase counter for wiggle
    }

    next(){
        const alignWeight = 1.2
        const cohesionWeight = 0.6
        const separationWeight = 1.0
        const obstacleAvoidWeight = 1.5
        const predatorsAvoidWeight = 2

        let alignForce = this.alignment().mult(alignWeight)
        let cohesionForce = this.cohesion().mult(cohesionWeight)
        let separationForce = this.separation().mult(separationWeight)
        let obstacleAvoidForce = this.avoid().mult(obstacleAvoidWeight)
        let predatorsAvoidForce = this.avoidPredators().mult(predatorsAvoidWeight)

        this.acceleration = new Vector(0, 0)
            .add(alignForce)
            .add(cohesionForce)
            .add(separationForce)
            .add(obstacleAvoidForce)
            .add(predatorsAvoidForce)

        // Update velocity
        this.speed.add(this.acceleration)

        // Enforce min speed
        if (this.speed.mag() < this.minSpeed) {
            this.speed.setMag(this.minSpeed)
        }

        // Limit to max speed too
        if (this.speed.mag() > this.maxSpeed) {
            this.speed.setMag(this.maxSpeed)
        }

        // Update position
        this.position.add(this.speed)

        // Let deltaX and deltaY the difference in position between each refresh. The subsequent movement will have an angle theta where cos(theta) = deltaX and sin(theta) = deltaY => tan(theta) = deltaY/deltaX => theta = arctan(deltaY/deltaX)
        // We have deltaX = xSpeed and deltaY = ySpeed.
        this.angle = Math.atan2(this.speed.y, this.speed.x)
        // Increment wiggle time
        this.wiggleTime += 0.15 // higher = faster tail movement
    }

    draw(){
        const options = { scale: 0.2 };
        const bodyWidth = (options.bodyWidth || 120) * options.scale;
        const bodyHeight = (options.bodyHeight || 50) * options.scale;
        const tailWidth = (options.tailWidth || 40) * options.scale;
        const tailHeight = (options.tailHeight || 36) * options.scale;
        const bodyColor = options.bodyColor || '#ff8c42';
        const finColor = options.finColor || '#ffb77a';

        const ctx = this.context;
        const x = this.position.x
        const y = this.position.y

        ctx.save();
        ctx.translate(x, y);
        if(this.speed.x < 0){
            this.angle = Math.atan2(this.speed.y, -this.speed.x)
            ctx.scale(-1, 1) // flip horizontally
        }
        // Add small sinusoidal wiggle to the base angle
        const wiggle = Math.sin(this.wiggleTime) * 0.15 // between [-0.15, 0.15] radians (~8.5°)
        ctx.rotate(this.angle + wiggle)

        // Tail
        ctx.beginPath();
        const tailX = -bodyWidth / 2.5;
        ctx.moveTo(tailX, 0);
        ctx.lineTo(tailX - tailWidth, -tailHeight / 2);
        ctx.lineTo(tailX - tailWidth, tailHeight / 2);
        ctx.closePath();
        ctx.fillStyle = finColor;
        ctx.fill();

        // Body
        ctx.beginPath();
        ctx.ellipse(0, 0, bodyWidth / 2, bodyHeight / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = bodyColor;
        ctx.fill();

        // Eye
        const eyeX = bodyWidth * 0.30;
        const eyeY = -bodyHeight * 0.12;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, Math.max(3, bodyHeight * 0.06), 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; // white
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeX + 1, eyeY, Math.max(1.6, bodyHeight * 0.025), 0, Math.PI * 2);
        ctx.fillStyle = '#000'; // black
        ctx.fill();

        // Top fin
        ctx.beginPath();
        ctx.moveTo(-bodyWidth * 0.2, -bodyHeight * 0.45);
        ctx.quadraticCurveTo(bodyWidth * 0.05, -bodyHeight * 0.85, bodyWidth * 0.19, -bodyHeight * 0.45);
        ctx.fillStyle = finColor;
        ctx.fill();

        ctx.restore();
    }

    // Steer towards the average heading of local flockmates
    // Compute average velocity of nearby fish. Steer toward that average.
    alignment(){
        let avgSpeed = new Vector(0, 0)
        let total = 0

        // for(let other of this.fishes){
        //     if(other !== this){
        //         let dist = this.position.dist(other.position)
        //         if(dist < this.perception){
        //             avgSpeed.add(other.speed)
        //             total++
        //         }
        //     }
        // }

        // Weighted by inverse distance version
        for(let other of this.fishes){
            if(other !== this){
                let dist = this.position.dist(other.position)
                if(dist > 0 && dist < this.perception){
                    let otherSpeedCopy = other.speed.copy()
                    // normalized and weighted by inverse distance
                    otherSpeedCopy.normalize()
                    otherSpeedCopy.div(dist)
                    avgSpeed.add(otherSpeedCopy)
                    total++
                }
            }
        }

        if(total > 0){
            avgSpeed.div(total) // average velocity

            // Normalize & scale to maxSpeed
            avgSpeed.setMag(this.maxSpeed) // desired velocity

            // Steering = desired - velocity
            let steer = avgSpeed.sub(this.speed)

            // Limit to maxForce
            steer.limit(this.maxForce)

            return steer
        }

        // No steering in case fish is alone :(
        return new Vector(0, 0)
    }

    // Steer to move toward the average position of local flockmates
    // Compute the center of nearby fish positions. Steer toward that center.
    cohesion(){
        let avgPosition = new Vector(0, 0)
        let total = 0

        for(let other of this.fishes){
            if(other !== this){
                let dist = this.position.dist(other.position)
                if(dist < this.perception){
                    avgPosition.add(other.position)
                    total++
                }
            }
        }

        if(total > 0){
            avgPosition.div(total) // average position

            // Desired velocity, normalized and scaled to maxSpeed
            let desired = avgPosition.sub(this.position)
            desired.setMag(this.maxSpeed)

            // Steering = desired - velocity
            let steer = desired.sub(this.speed)

            // Limit to maxForce
            steer.limit(this.maxForce)

            return steer
        }

        // No steering in case fish is alone :(
        return new Vector(0, 0)
    }

    // Steer to avoid crowding local flockmates
    // Formula: sum of (position - neighbor.position) vectors, inversely proportional to distance.
    separation(){
        let desiredDistance = 40 // distance under which, two fishes are considered "too close"
        let sep = new Vector(0, 0)
        let total = 0

        for(let other of this.fishes){
            if(other !== this){
                let dist = this.position.dist(other.position)
                if(dist > 0 && dist < desiredDistance){
                    // vector pointing away from neighbor (repulsion vector), weighted by inverse distance
                    let diff = this.position.copy().sub(other.position)
                    diff.div(dist)
                    sep.add(diff)
                    total++
                }
            }
        }

        if(total > 0){
            sep.div(total) // vector pointing towards minimum crowding

            // desired = away vector, normalized & scaled to maxSpeed
            let desired = sep.setMag(this.maxSpeed)

            // Steering = desired - velocity
            let steer = desired.sub(this.speed)

            // Limit to maxForce
            steer.limit(this.maxForce)

            return steer
        }

        // No steering in case fish is alone :(
        return new Vector(0, 0)
    }

    // Steer to avoid obstacles
    // Formula: sum of (position - obstacle.position) vectors, inversely proportional to distance.
    avoid(){
        let sep = new Vector(0, 0)
        let total = 0
        let obstaclePerception = this.perception*1.5

        for(let node of this.obstacle.nodes){
            let dist = this.position.dist(node)
            if(dist > 0 && dist < obstaclePerception){
                // vector pointing away from obstacle (repulsion vector), weighted by inverse distance
                let diff = this.position.copy().sub(node)
                diff.div(dist)
                sep.add(diff)
                total++
            }
        }

        if(total > 0){
            sep.div(total) // vector pointing towards minimum crowding

            // desired = away vector, normalized & scaled to maxSpeed
            let desired = sep.setMag(this.maxSpeed)

            // Steering = desired - velocity
            let steer = desired.sub(this.speed)

            // Limit to maxForce
            steer.limit(this.maxForce)

            return steer
        }

        // No steering if no obstacle
        return new Vector(0, 0)
    }

    // Steer to avoid predators
    // Formula: sum of (position - predator.position) vectors, inversely proportional to distance.
    avoidPredators(){
        let sep = new Vector(0, 0)
        let total = 0
        let predatorPerception = this.perception*2.5

        for(let predator of this.predators){
            let dist = this.position.dist(predator.position)
            if(dist > 0 && dist < predatorPerception){
                // vector pointing away from obstacle (repulsion vector), weighted by inverse distance
                let diff = this.position.copy().sub(predator.position)
                diff.div(dist)
                sep.add(diff)
                total++
            }
        }

        if(total > 0){
            sep.div(total) // vector pointing towards minimum crowding

            // desired = away vector, normalized & scaled to maxSpeed
            let desired = sep.setMag(this.maxSpeed)

            // Steering = desired - velocity
            let steer = desired.sub(this.speed)

            // Limit to maxForce
            steer.limit(this.maxForce)

            return steer
        }

        // No steering if no obstacle
        return new Vector(0, 0)
    }

}