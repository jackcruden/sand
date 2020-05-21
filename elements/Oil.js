'use strict'

import {State} from '/global.js'
import Particle from '/elements/Particle.js'

export default class Oil extends Particle {
    constructor() {
        super(
            State.Liquid,
            { r: 100, g: 100, b: 100},
            false,
            60,
            80,
            50,
        )
    }
}