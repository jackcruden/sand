'use strict'

import {State} from '../global.js'
import Particle from './Particle.js'

export default class Vapor extends Particle {
    constructor() {
        super(
            State.Gas,
            { r: 200, g: 0, b: 250},
            false,
            0,
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