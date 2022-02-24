'use strict'

import {State} from '../global.js'
import Particle from './Particle.js'

export default class Wood extends Particle {
    constructor() {
        super(
            State.Solid,
            { r: 145, g: 90, b: 10 },
            true,
            100,
            50,
            50,
            70 + Math.floor(Math.random() * 25),
        )
    }
}
