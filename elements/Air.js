'use strict'

import {State} from '../global.js'
import Particle from './Particle.js'

export default class Air extends Particle {
    constructor() {
        super(
            State.Gas,
            { r: 255, g: 255, b: 255 },
            false,
            0,
            0,
            0,
            100,
        )
    }
}
