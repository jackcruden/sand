'use strict'

import {State} from '../global.js'

export default class Particle {
    /**
     * Last time this particle was stepped.
     * @type {number}
     */
    iteration = 0

    /**
     * The state of matter.
     */
    state

    /**
     * The element's colour.
     */
    colour

    /**
     * Is the element fixed in space
     * @type {boolean}
     */
    fixed

    /**
     * The mass of the element.
     * Out of 100.
     *
     * @type {number}
     */
    mass

    /**
     * How easily the element will combust.
     * Out of 100.
     *
     * @type {number}
     */
    flammability

    /**
     * How combustible the element is.
     * Out of 100.
     *
     * @type {number}
     */
    combustibility

    /**
     * How durable the element is.
     * Out of 100.
     *
     * @type {number}
     */
    durability

    /**
     * Is the element burning.
     *
     * @type {boolean}
     */
    burning

    /**
     * Create the element.
     *
     * @param state
     * @param colour
     * @param fixed
     * @param mass
     * @param flammability
     * @param combustibility
     * @param durability
     */
    constructor(state, colour, fixed, mass, flammability, combustibility, durability) {
        this.state = state
        this.colour = colour
        this.fixed = fixed
        this.mass = mass
        this.flammability = flammability
        this.combustibility = combustibility
        this.durability = durability
        this.burning = false
        this.redraw = true

        // Set colour variation
        if (this.state !== 'Liquid' && this.element !== 'Block') {
            let variation = Math.round(Math.sin(new Date().getMilliseconds()) * 20) + 20

            this.colour.r += variation
            this.colour.g += variation
            this.colour.b += variation
        }

        // Check to see if all properties were set
        Object.getOwnPropertyNames(this).forEach(property => {
            if (typeof this[property] === 'undefined') {
                console.error('Uninitialised property "' + property + '" in ' + this.element + ' class.')
            }
        })
    }

    /**
     * Has the particle been stepped
     * @param iteration
     * @returns {boolean}
     */
    iterated(iteration) {
        return this.iteration === iteration
    }

    /**
     * Get the type of element.
     *
     * @returns string
     */
    get element() {
        return this.constructor.name
    }

    /**
     * Should the element be removed.
     *
     * @returns {boolean}
     */
    isDead() {
        return false
    }

    /**
     * Get the element's colour.
     *
     * @returns {string}
     */
    getColour() {
        return 'rgb(' + this.colour.r + ', ' + this.colour.g + ', ' + this.colour.b + ')'
    }

    /**
     * Step the given grid.
     * @param mutator
     * @param iteration
     */
    step(mutator, iteration) {
        this.iteration = iteration

        return mutator
    }
}