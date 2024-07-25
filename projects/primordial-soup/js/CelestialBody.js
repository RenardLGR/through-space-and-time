export default class CelestialBody{
    constructor(context, px, py, vx, vy, mass){
        this.context = context
        //position
        this.px = px
        this.py = py
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
        this.context.arc(this.px, this.py, radius, 0, 2 * Math.PI);

        // Set the fill color to red
        this.context.fillStyle = 'red';

        // Fill the circle
        this.context.fill();
    }
}