export default class CelestialBody{
    constructor(context, x, y, vx, vy, mass){
        this.context = context
        //position
        this.x = x
        this.y = y
        //velocity as a vector with components in the x and y directions
        this.vx = vx
        this.vy = vy
        this.mass = mass
    }

    next(){

    }

    draw(){
        //TODO : the radius increases with the mass
        // Begin a new path
        this.context.beginPath();

        let radius = this.mass/100

        // Draw the circle using the arc method
        // arc(x, y, radius, startAngle, endAngle, anticlockwise)
        this.context.arc(this.x, this.y, radius, 0, 2 * Math.PI);

        // Set the fill color to red
        this.context.fillStyle = 'red';

        // Fill the circle
        this.context.fill();
    }
}