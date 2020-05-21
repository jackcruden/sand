'use strict'

import {State} from '/global.js'
import Particle from '/elements/Particle.js'

export default class Fire extends Particle {
    constructor() {
        super(
            State.Gas,
            { r: 250, g: 100, b: 100},
            false,
            0,
            0,
            0,
        )
    }

    step(mutator) {
        //

        return mutator
    }
}