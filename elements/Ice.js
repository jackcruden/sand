'use strict'

import {State} from '../global.js'
import Particle from './Particle.js'
import Water from './Water.js'

export default class Ice extends Particle {
    constructor() {
        super(
            State.Solid,
            { r: 110, g: 220, b: 250 },
            true,
            100,
            0,
            0,
            100,
        )
    }

    step(mutator) {
        // If near water, change it to ice
        if (mutator.chance(2/100)) {
            if (mutator.is('above', 'Water')) {
                mutator.above(new Ice())
            }
            if (mutator.is('below', 'Water')) {
                mutator.below(new Ice())
            }
            if (mutator.is('left', 'Water')) {
                mutator.left(new Ice())
            }
            if (mutator.is('right', 'Water')) {
                mutator.right(new Ice())
            }
        }

        // If near fire, change self to water
        if (mutator.chance(5/100)) {
            if (
                mutator.isBurning('above') ||
                mutator.isBurning('below') ||
                mutator.isBurning('left') ||
                mutator.isBurning('right')
            ) {
                mutator.self(new Water())
            }
        }

        return mutator
    }
}
