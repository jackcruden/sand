'use strict'

import {State} from '../global.js'
import Particle from './Particle.js'

export default class Plant extends Particle {
    constructor() {
        super(
            State.Solid,
            { r: 10, g: 190, b: 50 },
            true,
            100,
            50,
            50,
            Math.floor(Math.random() * 25),
        )
    }

    step(mutator) {
        if (mutator.chance(5/100)) {
            if (mutator.is('above', 'Water')) {
                mutator.above(new Plant())
            }
            if (mutator.is('below', 'Water')) {
                mutator.below(new Plant())
            }
            if (mutator.is('left', 'Water')) {
                mutator.left(new Plant())
            }
            if (mutator.is('right', 'Water')) {
                mutator.right(new Plant())
            }
        }

        return mutator
    }
}
