'use strict'

import {State} from '../global.js'
import Particle from './Particle.js'

export default class Oil extends Particle {
    constructor() {
        super(
            State.Liquid,
            { r: 80, g: 60, b: 40 },
            false,
            40,
            80,
            50,
            40
        )
    }
}