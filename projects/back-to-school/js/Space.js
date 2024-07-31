import { WIDTH, HEIGHT, CELL_SIZE, period } from './constants.js';

import Boid from './Boid.js';

export default class Space {
    constructor(context){
        this.context = context
        this.bodies = []
        this.dt = 0.1 // increase for bigger movements per refresh, decrease for smaller movements per refresh

        this.initialize()
    }

    

    //=================================================================
    //==================== ALL PURPOSE FUNCTIONS ======================
    //=================================================================

    // (number, number) : number
    randomNumberBetween(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    
}