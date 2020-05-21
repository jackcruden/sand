import Block from './elements/Block.js'

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
            (this.x === 0 && ox === -1) || // Left
            (this.x === this.width - 1 && ox === 1) // Right
        ) {
            return new Block()
        }

        return this.particles[nx * this.width + ny]
    }

    self(particle) {
        if (particle) {
            return this.particles[this.x * this.width + this.y] = particle
        }
        return this.particles[this.x * this.width + this.y]
    }

    above(particle) {
        if (particle) {
            return this.particles[this.x * this.width + this.y - 1] = particle
        }
        return this.particles[this.x * this.width + this.y - 1]
    }

    below(particle) {
        if (particle) {
            return this.set(0, 1, particle)
        }
        return this.get(0, 1)

    }

    left(particle) {
        if (particle) {
            return this.set(-1, 0, particle)
        }
        return this.get(-1, 0)
    }

    belowLeft(particle) {
        if (particle) {
            return this.set(-1, 1, particle)
        }
        return this.get(-1, 1)
    }

    right(particle) {
        if (particle) {
            return this.set(1, 0, particle)
        }
        return this.get(1, 0)
    }

    belowRight(particle) {
        if (particle) {
            return this.set(1, 1, particle)
        }
        return this.get(1, 1)
    }

    belowRandom(particle) {
        if (typeof this.random_direction === 'undefined') {
            this.random_direction = Math.floor(Math.random() * 3) - 1
        }

        if (particle) {
            return this.set(this.random_direction, 1, particle)
        }
        return this.get(this.random_direction, 1)
    }

    is(direction, type) {
        return this[direction]().element === type
    }

    isFixed(direction) {
        return this[direction]().fixed
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
}