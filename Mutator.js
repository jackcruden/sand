import Block from './elements/Block.js'
import Air from './elements/Air.js'

export default class Mutator {
    particles

    constructor(particles, width, x, y, iteration) {
        this.particles = particles
        this.width = width
        this.x = x
        this.y = y
        this.iteration = iteration
    }

    set(ox, oy, particle) {
        let nx = this.x + ox
        let ny = this.y + oy

        this.particles[nx * this.width + ny] = particle
        this.particles[nx * this.width + ny].iteration = this.iteration
    }

    get(ox, oy) {
        let nx = this.x + ox
        let ny = this.y + oy

        if (
            (this.y === this.width - 1 && oy === 1) || // Bottom
            (this.y === 0 && oy === -1) || // Top
            (this.x === 0 && ox === -1) || // Left
            (this.x === this.width - 1 && ox === 1) // Right
        ) {
            return new Block()
        }

        return this.particles[nx * this.width + ny]
    }

    die(particle = 'self') {
        this[particle](new Air())
    }

    particle(ox, oy, particle) {
        if (particle) {
            return this.set(ox, oy, particle)
        }

        return this.get(ox, oy)
    }

    aboveLeft(particle) {
        return this.particle(-1, -1, particle)
    }

    above(particle) {
        return this.particle(0, -1, particle)
    }

    aboveRight(particle) {
        return this.particle(1, -1, particle)
    }

    left(particle) {
        return this.particle(-1, 0, particle)
    }

    self(particle) {
        return this.particle(0, 0, particle)
    }

    right(particle) {
        return this.particle(1, 0, particle)
    }

    belowLeft(particle) {
        return this.particle(-1, 1, particle)
    }

    below(particle) {
        return this.particle(0, 1, particle)
    }

    belowRight(particle) {
        return this.particle(1, 1, particle)
    }

    aboveRandom(particle) {
        if (typeof this.random_direction === 'undefined') {
            this.random_direction = Math.floor(Math.random() * 3) - 1
        }

        this.particle(this.random_direction, -1, particle)
    }

    random(particle) {
        if (typeof this.random_direction === 'undefined') {
            this.random_direction = Math.floor(Math.random() * 3) - 1
        }

        this.particle(this.random_direction, 0, particle)
    }

    belowRandom(particle) {
        if (typeof this.random_direction === 'undefined') {
            this.random_direction = Math.floor(Math.random() * 3) - 1
        }

        this.particle(this.random_direction, 1, particle)
    }

    is(direction, type) {
        if (typeof direction === 'string') {
            direction = this[direction]()
        }

        return direction.element === type
    }

    swap(subject, direction) {
        let tempDirection = this[direction]()
        let tempSubject = this[subject]()

        this[direction](tempSubject)
        this[subject](tempDirection)
    }

    randomDirection() {
        if (typeof this.random_direction === 'undefined') {
            this.random_direction = Math.floor(Math.random() * 3) - 1
        }

        if (this.random_direction === -1) return 'left'
        if (this.random_direction === 0) return 'self'
        if (this.random_direction === 1) return 'right'
    }

    randomBelowDirection() {
        if (typeof this.random_direction === 'undefined') {
            this.random_direction = Math.floor(Math.random() * 3) - 1
        }

        if (this.random_direction === -1) return 'belowLeft'
        if (this.random_direction === 0) return 'below'
        if (this.random_direction === 1) return 'belowRight'
    }

    randomAboveDirection() {
        if (typeof this.random_direction === 'undefined') {
            this.random_direction = Math.floor(Math.random() * 3) - 1
        }

        if (this.random_direction === -1) return 'aboveLeft'
        if (this.random_direction === 0) return 'above'
        if (this.random_direction === 1) return 'aboveRight'
    }

    isFixed(particle) {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.fixed
    }

    isNotFixed(particle) {
        return ! this.isFixed(particle)
    }

    isGas(particle) {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.state === 'Gas'
    }

    isNotGas(particle) {
        return ! this.isGas(particle)
    }

    isLiquid(particle) {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.state === 'Liquid'
    }

    isNotLiquid(particle) {
        return ! this.isLiquid(particle)
    }

    isSolid(particle) {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.state === 'Solid'
    }

    isNotSolid(particle) {
        return ! this.isSolid(particle)
    }

    heavierThan(particle) {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return this.self().mass > particle.mass
    }

    lighterThan(particle) {
        return ! this.heavierThan(particle)
    }

    combustable(particle) {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.combustibility > 0
    }

    flammable(particle) {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.flammability > 0
    }
}