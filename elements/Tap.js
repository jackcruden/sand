'use strict'

import {State} from '../global.js'
import Particle from './Particle.js'
import * as Elements from '../global.js'

export default class Tap extends Particle {
    constructor() {
        super(
            State.Solid,
            { r: 160, g: 50, b: 230 },
            true,
            100,
            0,
            0,
            100
        )

        // Default to no output
        this.output = false
    }

    step(mutator) {
        if (! this.output) {
            // Copy nearby taps
            if (mutator.is('above', 'Tap') && mutator.above().output) {
                this.output = mutator.above().output
            }
            if (mutator.is('below', 'Tap') && mutator.below().output) {
                this.output = mutator.below().output
            }
            if (mutator.is('left', 'Tap') && mutator.left().output) {
                this.output = mutator.left().output
            }
            if (mutator.is('right', 'Tap') && mutator.right().output) {
                this.output = mutator.right().output
            }

            // Clone nearest element
            if (mutator.isNot('above', ['Tap', 'Air', 'Block'])) {
                this.output = mutator.above().element
            }
            if (mutator.isNot('below', ['Tap', 'Air', 'Block'])) {
                this.output = mutator.below().element
            }
            if (mutator.isNot('left', ['Tap', 'Air', 'Block'])) {
                this.output = mutator.left().element
            }
            if (mutator.isNot('right', ['Tap', 'Air', 'Block'])) {
                this.output = mutator.right().element
            }
        } else {
            if (mutator.is('above', 'Air')) {
                mutator.above(new Elements[this.output]())
            }
            if (mutator.is('below', 'Air')) {
                mutator.below(new Elements[this.output]())
            }
            if (mutator.is('left', 'Air')) {
                mutator.left(new Elements[this.output]())
            }
            if (mutator.is('right', 'Air')) {
                mutator.right(new Elements[this.output]())
            }
        }

        return mutator
    }
}
