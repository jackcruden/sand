'use strict'

import {State} from '/global.js'
import Particle from '/elements/Particle.js'
import Fire from '/elements/Fire.js'

export default class Nitro extends Particle {
    constructor() {
        super(
            State.Liquid,
            { r: 50, g: 250, b: 50},
            false,
            80,
            100,
            100,
            0
        )
    }

    step(mutator) {
        if (mutator.isBurning('above')) {
            mutator.burn('self')
        }
        if (mutator.isBurning('below')) {
            mutator.burn('self')
        }
        if (mutator.isBurning('left')) {
            mutator.burn('self')
        }
        if (mutator.isBurning('right')) {
            mutator.burn('self')
        }

        return mutator
    }
}