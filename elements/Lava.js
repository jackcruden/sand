'use strict'

import {State} from '/global.js'
import Particle from '/elements/Particle.js'
import Fire from '/elements/Fire.js'

export default class Lava extends Particle {
    constructor() {
        super(
            State.Liquid,
            { r: 180, g: 5, b: 5},
            false,
            100,
            0,
            0,
            100,
        )

        super.burning = true
    }

    step(mutator) {
        // Emit fire
        if (mutator.is('above', 'Air')) {
            mutator.above(new Fire(2))
        }

        // Light above particle on fire
        if (mutator.isFlammable('above')) {
            mutator.above().burning = true
        }

        return mutator
    }
}