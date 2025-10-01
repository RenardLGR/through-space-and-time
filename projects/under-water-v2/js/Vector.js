export default class Vector{
    constructor(x = 0, y = 0){
        this.x = x
        this.y = y
    }

    add(v){
        this.x += v.x
        this.y += v.y
        return this
    }

    sub(v){
        this.x -= v.x
        this.y -= v.y
        return this
    }

    mult(n){
        this.x *= n
        this.y *= n
        return this
    }

    div(n){
        this.x /= n
        this.y /= n
        return this
    }

    // norm => for a vector (x,y), magnitude = sqrt(x²+y²)
    mag(){
        return Math.hypot(this.x, this.y)
    }

    setMag(n){
        return this.normalize().mult(n)
    }

    // scales it so its magnitude becomes exactly 1, without changing its direction. for a vector v = (x,y), v_normalized = v / mag(v)
    normalize(){
        let m = this.mag()
        if(m !== 0) this.div(m)
        return this
    }

    // limits the magnitude to max, but keeps the direction the same
    limit(max){
        if(this.mag() > max){
            this.setMag(max)
        }
        return this
    }

    dist(v){
        return Math.hypot(this.x - v.x, this.y - v.y)
    }

    copy(){
        return new Vector(this.x, this.y)
    }

    //returns a unit vector (norm = 1) pointing at a random direction
    static random2D(){
        let angle = Math.random() * Math.PI * 2 // random from 0 to 2π
        return new Vector(Math.cos(angle), Math.sin(angle))
    }
}