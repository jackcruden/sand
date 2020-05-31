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

    chance(odds) {
        return Math.random() < odds
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

    is(directions, types) {
        // Make direction an array
        if (! Array.isArray(directions)) {
            directions = [directions]
        }

        // Make type an array
        if (! Array.isArray(types)) {
            types = [types]
        }

        // Check each direction
        for (let direction of directions) {
            if (typeof direction === 'string') {
                direction = this[direction]()
            }

            // Try match element then state
            for (let type of types) {
                if (direction.element === type) return true
                if (direction.state === type) return true
            }
        }

        return false
    }

    isNot(direction, type) {
        return ! this.is(direction, type)
    }

    swap(subject, direction) {
        let tempDirection = this[direction]()
        let tempSubject = this[subject]()

        tempDirection.redraw = true
        tempSubject.redraw = true

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

    isBurning(particle = 'self') {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.burning
    }

    isFixed(particle = 'self') {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.fixed
    }

    isNotFixed(particle = 'self') {
        return ! this.isFixed(particle)
    }

    isGas(particle = 'self') {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.state === 'Gas'
    }

    isNotGas(particle = 'self') {
        return ! this.isGas(particle)
    }

    isLiquid(particle = 'self') {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.state === 'Liquid'
    }

    isNotLiquid(particle = 'self') {
        return ! this.isLiquid(particle)
    }

    isSolid(particle = 'self') {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.state === 'Solid'
    }

    isNotSolid(particle = 'self') {
        return ! this.isSolid(particle)
    }

    heavierThan(particle = 'self') {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return this.self().mass > particle.mass
    }

    lighterThan(particle = 'self') {
        return ! this.heavierThan(particle)
    }

    isCombustable(particle = 'self') {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.combustibility > 0
    }

    isFlammable(particle = 'self') {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.flammability > 0
    }

    burn(particle) {
        if (typeof particle === 'string') {
            particle = this[particle]()
        }

        return particle.burning = true
    }
}