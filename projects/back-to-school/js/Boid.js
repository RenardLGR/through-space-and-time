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
        this.radius = Math.cbrt(this.mass)
        this.color = "red"
    }
}