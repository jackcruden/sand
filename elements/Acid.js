'use strict'

import {State} from '../global.js'
import Particle from './Particle.js'
import Air from './Air.js'

export default class Acid extends Particle {
    constructor() {
        super(
            State.Liquid,
            { r: 100, g: 250, b: 100},
            false,
            50,
            0,
            0,
            100,
        )
    }

    step(mutator) {
        if (
            mutator.isNot('above', 'Air') &&
            mutator.isNot('above', 'Block') &&
            mutator.isNot('above', 'Acid')
        ) {
            mutator.above(new Air())
            mutator.die()
        }
        if (
            mutator.isNot('below', 'Air') &&
            mutator.isNot('below', 'Block') &&
            mutator.isNot('below', 'Acid')
        ) {
            mutator.below(new Air())
            mutator.die()
        }
        if (
            mutator.isNot('left', 'Air') &&
            mutator.isNot('left', 'Block') &&
            mutator.isNot('left', 'Acid')
        ) {
            mutator.left(new Air())
            mutator.die()
        }
        if (
            mutator.isNot('right', 'Air') &&
            mutator.isNot('right', 'Block') &&
            mutator.isNot('right', 'Acid')
        ) {
            mutator.right(new Air())
            mutator.die()
        }

        return mutator
    }
}