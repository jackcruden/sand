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

        this.life = Math.floor(Math.random() * 50)
    }

    step(mutator) {
        // Decrease life
        this.life--

        // Check if dead
        if (this.life < 0) {
            mutator.die()

            return mutator
        }

        // Float up
        if (mutator.is(mutator.randomAboveDirection(), 'Air')) {
            mutator.swap('self', mutator.randomAboveDirection())
        } else if (mutator.is(mutator.randomDirection(), 'Air')) {
            mutator.swap('self', mutator.randomDirection())
        }

        return mutator
    }
}