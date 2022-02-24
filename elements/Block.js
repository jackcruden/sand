'use strict'

import {State} from '../global.js'
import Particle from './Particle.js'

export default class Block extends Particle {
    constructor() {
        super(
            State.Solid,
            { r: 150, g: 150, b: 150 },
            true,
            100,
            0,
            0,
            100
        )
    }
}
