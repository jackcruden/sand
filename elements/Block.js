'use strict'

import {State} from '/global.js'
import Particle from '/elements/Particle.js'

export default class Block extends Particle {
    constructor() {
        super(
            State.Solid,
            { r: 50, g: 50, b: 50 },
            true,
            100,
            0,
            0,
        )
    }
}
