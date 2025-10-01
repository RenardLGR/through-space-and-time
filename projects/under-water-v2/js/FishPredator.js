import Vector from "./Vector.js"
import Fish from "./Fish.js"

export default class FishPredator extends Fish {
    constructor(context, position, speed, acceleration){
        super(context, position, speed, acceleration)
        this.id = "FishPredator"
        this.fishes

        this.perception = 100 // radius representing the range of the fish's neighborhood

        this.maxForce = 0.1
        this.minSpeed = 1.0
        this.maxSpeed = 4

        this.angle = 0
        this.wiggleTime = 0 // phase counter for wiggle
    }

    next(){
        this.position.add(this.speed)
        this.wiggleTime += 0.15 // higher = faster tail movement
    }

    draw(){
        const options = { scale: 0.5 };
        const bodyWidth = (options.bodyWidth || 120) * options.scale;
        const bodyHeight = (options.bodyHeight || 50) * options.scale;
        const tailWidth = (options.tailWidth || 30) * options.scale;
        const tailHeight = (options.tailHeight || 40) * options.scale;
        const bodyColor = options.bodyColor || '#6897ad';
        const finColor = options.finColor || '#3c5f6f';

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
        const wiggle = Math.sin(this.wiggleTime) * 0.1 // between [-0.15, 0.15] radians (~8.5°)
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

        // Top fin
        ctx.beginPath();
        ctx.moveTo(tailWidth/2, 0);
        ctx.lineTo(0, -tailHeight);
        ctx.lineTo(-tailWidth/2, 0);
        ctx.closePath();
        ctx.fillStyle = finColor;
        ctx.fill();

        // Body
        ctx.beginPath();
        ctx.ellipse(0, 0, bodyWidth / 2, bodyHeight / 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = bodyColor;
        ctx.fill();

        // Side fin
        ctx.beginPath();
        ctx.moveTo(bodyWidth/8, bodyHeight/6);
        ctx.lineTo(2*bodyWidth/8, bodyHeight/6)
        ctx.lineTo(0, bodyHeight/4 + 3*tailHeight/6)
        ctx.closePath();
        ctx.fillStyle = finColor;
        ctx.fill();

        // Eye
        const eyeX = bodyWidth * 0.35;
        const eyeY = -bodyHeight * 0.12;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, Math.max(3, bodyHeight * 0.06), 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; // white
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeX + 1, eyeY, Math.max(1.6, bodyHeight * 0.025), 0, Math.PI * 2);
        ctx.fillStyle = '#000'; // black
        ctx.fill();

        // Teeth
        ctx.beginPath();
        ctx.moveTo(bodyWidth/2, 0)
        ctx.lineTo(bodyWidth/2 - bodyWidth/30, bodyHeight/10)
        ctx.lineTo(bodyWidth/2 - 2*bodyWidth/30, 0)
        ctx.lineTo(bodyWidth/2 - 3*bodyWidth/30, bodyHeight/10)
        ctx.lineTo(bodyWidth/2 - 4*bodyWidth/30, 0)
        ctx.strokeStyle = '#fff'; // white
        ctx.stroke();

        ctx.restore();
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
}