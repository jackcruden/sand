import Mutator from '/Mutator.js'
import * as Elements from '/global.js'

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
    iteration_last = 0
    cursor_size = 10

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
                this.particles[x * this.height + y] = new Elements.Air()
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

    clear() {
        // Initialise particles
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.particles[x * this.height + y] = new Elements.Air()
            }
        }
    }

    updateMousePosition(event) {
        let bounding = this.canvas.getBoundingClientRect()

        this.mouse_x = event.clientX - bounding.left
        this.mouse_y = event.clientY - bounding.top
    }

    updateSelection(selection) {
        this.selection = selection
    }

    updateCursor() {
        let cursors = [
            this.width / 40,
            this.width / 20,
            this.width / 10,
            this.width / 5
        ]

        if (cursors.indexOf(this.cursor_size) === cursors.length - 1) {
            this.cursor_size = cursors[0]
        } else {
            this.cursor_size = cursors[cursors.indexOf(this.cursor_size) + 1]
        }
    }

    paint(x, y) {
        let nx = Math.round(x / this.particle_size)
        let ny = Math.round(y / this.particle_size)

        for (let i = -this.cursor_size; i < this.cursor_size / 2; i++) {
            for (let j = -this.cursor_size; j < this.cursor_size / 2; j++) {
                let distance = Math.sqrt(Math.pow(i, 2) + Math.pow(j, 2))

                if (distance > this.cursor_size / 4) {
                    continue
                }

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

    calculateStats() {
        // FPS
        let fps = this.iteration - this.iteration_last
        this.iteration_last = this.iteration

        return {
            state: this.playing ? 'Playing' : 'Paused',
            fps,
            selection: this.selection
        }
    }

    step() {
        if (!this.playing) return

        // If mouse down
        if (this.clicked) {
            this.paint(this.mouse_x, this.mouse_y)
        }

        this.old_particles = this.particles

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
                    mutator.is(mutator.randomDirection(), 'Gas')
                ) {
                    mutator.swap('self', mutator.randomDirection())
                } else if (
                    mutator.isNotFixed('self') &&
                    mutator.isSolid('self') &&
                    mutator.is(mutator.randomBelowDirection(), 'Gas')
                ) {
                    mutator.swap('self', mutator.randomBelowDirection())
                }

                // Liquid
                if (
                    mutator.isLiquid('self') &&
                    mutator.heavierThan(mutator.randomBelowDirection())
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
                            mutator.self(new Elements.Fire())
                        }

                        this.particles = mutator.particles
                        continue

                    // Give off fire
                    } else if (
                        ! mutator.is('self', 'Fire') &&
                        mutator.is('above', 'Air')
                    ) {
                        mutator.above(new Elements.Fire())
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
                if (this.particles[x * this.width + y].redraw) {
                    this.context.fillStyle = this.particles[x * this.width + y].getColour()
                    this.context.fillRect(x * this.particle_size, y * this.particle_size, this.particle_size, this.particle_size)

                    this.particles[x * this.width + y].redraw = false
                }
            }
        }
    }

    setParticle(x, y, ox, oy, particle) {
        let nx = x + ox
        let ny = y + oy

        // Set bounds of top and bottom
        if (
            (y < 0 - oy) || // Top
            (y > this.height - 1 - oy) // Bottom
        ) {
            return
        }

        this.particles[nx * this.width + ny] = particle
    }

    getParticle(x, y, ox, oy) {
        let nx = x + ox
        let ny = y + oy

        return this.particles[nx * this.width + ny]
    }
}

