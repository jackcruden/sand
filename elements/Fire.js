'use strict'

import {State} from '../global.js'
import Particle from './Particle.js'

export default class Fire extends Particle {
    constructor(durability) {
        if (! durability) {
            durability = Math.floor(Math.random() * 30)
        }

        super(
            State.Gas,
            { r: 250, g: 100, b: 100},
            false,
            0,
            0,
            0,
            durability
        )

        super.burning = true
    }

    step(mutator) {
        // Burn neighbours
        if (mutator.isFlammable('above')) {
            mutator.burn('above')
        }
        if (mutator.isFlammable('below')) {
            mutator.burn('below')
        }
        if (mutator.isFlammable('left')) {
            mutator.burn('left')
        }
        if (mutator.isFlammable('right')) {
            mutator.burn('right')
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