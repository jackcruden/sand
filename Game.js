import Air from '/elements/Air.js'
import Block from '/elements/Block.js'

import Water from '/elements/Water.js'
import Sand from '/elements/Sand.js'
import Fire from '/elements/Fire.js'
import Oil from '/elements/Oil.js'

import Mutator from '/Mutator.js'

let Elements = {
    'Air': Air,
    'Block': Block,

    'Water': Water,
    'Sand': Sand,
    'Fire': Fire,
    'Oil': Oil,
}

export default class Game {
    // Setup
    canvas
    context
    width
    height
    particles = []
    particle_size
    playing = false
    iteration = 0

    // Mouse
    selection = 'Sand'
    clicked = false
    mouse_x = 1
    mouse_y = 1

    constructor(canvas, width, height) {
        // Set up the canvas
        this.canvas = canvas
        this.context = this.canvas.getContext('2d', { alpha: false })
        this.width = width
        this.height = height
        this.particle_size = this.particle_size = canvas.width / this.width

        // Initialise particles
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.particles[x * this.height + y] = new Air()
            }
        }
    }

    play() {
        this.playing = true
        this.step()
    }

    pause() {
        this.playing = false
    }

    updateMousePosition(event) {
        let bounding = this.canvas.getBoundingClientRect()

        this.mouse_x = event.clientX - bounding.left
        this.mouse_y = event.clientY - bounding.top
    }

    updateSelection(selection) {
        this.selection = selection
    }

    paint(x, y) {
        let nx = Math.round(x / this.particle_size)
        let ny = Math.round(y / this.particle_size)

        let cursor_size = Math.floor(this.width / 20)
        for (let i = -cursor_size; i < cursor_size / 2; i++) {
            for (let j = -cursor_size; j < cursor_size / 2; j++) {
                if (this.selection === 'Air') {
                    this.setParticle(nx, ny, i, j, new Elements[this.selection]())
                } else {
                    if (this.getParticle(nx, ny, i, j) && this.getParticle(nx, ny, i, j).element === 'Air') {
                        this.setParticle(nx, ny, i, j, new Elements[this.selection]())
                    }
                }
            }
        }
    }

    step() {
        if (!this.playing) return

        // If mouse down
        if (this.clicked) {
            this.paint(this.mouse_x, this.mouse_y)
        }

        // Increment the iterator
        this.iteration++

        // Step particles
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.particles[x * this.width + y].iterated(this.iteration)) {
                    continue
                }

                let mutator = new Mutator(this.particles, this.width, x, y, this.iteration)

                // Gravity
                if (
                    mutator.isNotFixed('self') &&
                    mutator.isNotFixed('below') &&
                    mutator.heavierThan('below')
                ) {
                    mutator.swap('self', 'below')
                } else if (
                    mutator.isNotFixed('self') &&
                    mutator.isLiquid('self') &&
                    mutator.is(mutator.randomDirection(), 'Air')
                ) {
                    mutator.swap('self', mutator.randomDirection())
                } else if (
                    mutator.isNotFixed('self') &&
                    mutator.isSolid('self') &&
                    mutator.is(mutator.randomBelowDirection(), 'Air')
                ) {
                    mutator.swap('self', mutator.randomBelowDirection())
                }

                // Liquid
                if (
                    mutator.isLiquid('self') &&
                    mutator.is(mutator.randomBelowDirection(), 'Air')
                ) {
                    mutator.swap('self', mutator.randomBelowDirection())
                }

                // Burning
                if (mutator.isBurning()) {
                    // Decrease durability
                    if (mutator.self().durability !== 100) {
                        mutator.self().durability--
                    }

                    // Die if out of durability
                    if (mutator.self().durability < 0) {
                        if (mutator.is('self', 'Fire')) {
                            mutator.die()
                        } else {
                            mutator.self(new Fire())
                        }

                        this.particles = mutator.particles
                        continue

                    // Give off fire
                    } else if (
                        ! mutator.is('self', 'Fire') &&
                        mutator.is('above', 'Air')
                    ) {
                        mutator.above(new Fire())
                    }
                }

                // If not Air, step
                if (! mutator.is('self', 'Air')) {
                    this.particles = this.particles[x * this.width + y].step(mutator, this.iteration).particles
                }
            }
        }

        this.draw()

        window.setTimeout(() => {
            this.step()
        })
    }

    draw() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.context.fillStyle = this.particles[x * this.width + y].getColour()
                this.context.fillRect(x * this.particle_size, y * this.particle_size, this.particle_size, this.particle_size)
            }
        }
    }

    setParticle(x, y, ox, oy, particle) {
        let nx = x + ox
        let ny = y + oy

        this.particles[nx * this.width + ny] = particle
    }

    getParticle(x, y, ox, oy) {
        let nx = x + ox
        let ny = y + oy

        return this.particles[nx * this.width + ny]
    }
}

