export default class CelestialBody{
    constructor(context, dt, acceleration, velocity, position, mass){
        this.context = context
        this.dt = dt
        //acceleration as a vector with components in the x and y directions
        this.acceleration = acceleration
        //position as a vector with components in the x and y directions
        this.position = position
        //velocity as a vector with components in the x and y directions
        this.velocity = velocity
        this.mass = mass
        this.color = "red"
    }

    //Getters

    next(){
        const [ax, ay] = this.acceleration

        let v = [this.velocity[0] + ax*this.dt , this.velocity[1] + ay*this.dt] // velocity in [x, y]
        this.velocity = v

        let r = [this.position[0] + this.velocity[0]*this.dt , this.position[1] + this.velocity[1]*this.dt] // position in [x, y]
        this.position = r
    }

    draw(){
        let radius = Math.cbrt(this.mass)

        this.context.beginPath();
        this.context.arc(this.position[0], this.position[1], radius, 0, 2 * Math.PI);
        this.context.fillStyle = 'red';
        this.context.fill();
    }
}