import CelestialBody from './CelestialBody.js';

export default class BlackHole extends CelestialBody{
    constructor(context, dt, acceleration, velocity, position, mass){
        super(context, dt, acceleration, velocity, position, mass)
        this.id = "black-hole"

        this.mass = Math.max(50000000, mass) // thats 50 millions
        this.radius = 3
        this.color = "black"
    }
}