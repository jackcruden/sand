'use strict'

import {State} from '/global.js'
import Particle from '/elements/Particle.js'

export default class Water extends Particle {
    constructor() {
        super(
            State.Liquid,
            { r: 50, g: 50, b: 100},
            false,
            50,
            0,
            0,
            100,
        )
    }
}