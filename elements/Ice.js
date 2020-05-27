'use strict'

import {State} from '/global.js'
import Particle from '/elements/Particle.js'
import Water from '/elements/Water.js'

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
        if (mutator.chance(2/100)) {
            // If near water, change it to ice
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

            // If near fire, change self to water
            if (
                mutator.is('above', 'Fire') ||
                mutator.is('below', 'Fire') ||
                mutator.is('left', 'Fire') ||
                mutator.is('right', 'Fire')
            ) {
                mutator.self(new Water())
            }
        }

        return mutator
    }
}
