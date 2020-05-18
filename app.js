'use strict'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d', {
    alpha: false
})

// Declare types
let Type = {
    Empty: 'Empty',
    Wall: 'Wall',

    Sand: 'Sand',
    Water: 'Water',
    Ice: 'Ice',
    Plant: 'Plant',

    Tap: 'Tap',
}

class Particle {
    constructor(type, iteration = 0) {
        this.type = type
        this.iteration = iteration
        this.brightness = 0.9 + Math.random() * 0.1

        // Specific to Tap
        this.dispenses = undefined
    }

    // Calculate colour
    colour() {
        let colour = {
            r: 255,
            g: 255,
            b: 255,
        }

        if (this.type === Type.Empty) {
            return 'rgb(255, 255, 255)'
        } else if (this.type === Type.Wall) {
            colour = { r: 100, g: 100, b: 100 }
        } else if (this.type === Type.Sand) {
            colour = { r: 150, g: 150, b: 0 }
        } else if (this.type === Type.Water) {
            colour = { r: 0, g: 0, b: 200 }
        } else if (this.type === Type.Tap) {
            colour = { r: 0, g: 0, b: 0 }
        } else if (this.type === Type.Ice) {
            colour = { r: 150, g: 150, b: 255}
        } else if (this.type === Type.Plant) {
            colour = { r: 50, g: 200, b: 50}
        }

        // Apply brightness
        colour.r = colour.r * this.brightness
        colour.g = colour.g * this.brightness
        colour.b = colour.b * this.brightness

        return 'rgb(' + colour.r + ',' + colour.g + ',' + colour.b + ')'
    }

    // Determine if particle has been stepped this iteration
    iterated(iteration) {
        return this.iteration === iteration
    }
}

class Game {
    constructor(canvas, size, options) {
        console.log('constructor()')

        this.context = canvas.getContext('2d', {
            alpha: false
        })
        this.options = options
        this.size = size
        this.particle_size = canvas.width / this.size
        this.playing = false
        this.particles = new Array(this.size * this.size)
        this.selection = Type.Wall
        this.iteration = 0
        this.last_iteration = 0
        this.fps = 0
        this.last = Date.now()
        this.clicked = false
        this.mouse_x = 0
        this.mouse_y = 0

        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                this.particles[x * this.size + y] = new Particle(Type.Empty)
            }
        }

        // Initialise background white
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, canvas.width, canvas.height)

        window.setInterval(() => {
            game.countIterations()
        }, 1000)
    }

    play() {
        console.log('play()')

        this.playing = true
        this.step()
    }

    pause() {
        console.log('pause()')

        this.playing = false
    }

    /**
     * Called every second.
     */
    countIterations() {
        this.fps = this.iteration - this.last_iteration

        this.last_iteration = this.iteration
    }

    getNeighbour(x, y, ox, oy) {
        let nx = x + ox
        let ny = y + oy

        // Bottom boundary
        if (
            (y === this.size - 1 && oy === 1) || // Bottom
            (x === 0 && ox === -1) || // Left
            (x === this.size - 1 && ox === 1) // Right
        ) {
            return new Particle(Type.Wall)
        }

        return this.particles[nx * this.size + ny]
    }

    setNeighbour(x, y, direction, particle) {
        if (direction === 'top' || direction === 'all') {
            this.setParticle(x, y, 0, -1, particle)
        }
        if (direction === 'left' || direction === 'all') {
            this.setParticle(x, y, -1, 0, particle)
        }
        if (direction === 'right' || direction === 'all') {
            this.setParticle(x, y, 1, 0, particle)
        }
        if (direction === 'bottom' || direction === 'all') {
            this.setParticle(x, y, 0, 1, particle)
        }
    }

    setParticle(x, y, ox, oy, particle) {
        let nx = x + ox
        let ny = y + oy

        this.particles[nx * this.size + ny] = particle
        this.particles[nx * this.size + ny].iteration = this.iteration
    }

    setParticleIf(x, y, ox, oy, if_type, particle) {
        if (this.getNeighbour(x, y, ox, oy).type === if_type) {
            this.setParticle(x, y, ox, oy, particle)
            this.getNeighbour(x, y, ox, oy).iteration = this.iteration
        }
    }

    step() {
        if (!this.playing) return

        // Determine if we should iterate
        if (this.last + this.options.interval > Date.now()) {
            window.setTimeout(() => {
                game.step()
            })

            return
        } else {
            this.last = Date.now()
        }

        this.iteration++

        // If mouse down
        if (this.clicked) {
            this.paint(this.mouse_x, this.mouse_y)
        }

        // Step particles
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (
                    this.particles[x * this.size + y].type !== Type.Empty &&
                    this.particles[x * this.size + y].type !== Type.Wall &&
                    !this.particles[x * this.size + y].iterated(this.iteration)
                ) {
                    let current = this.getNeighbour(x, y, 0, 0)
                    let chance = Math.random() * 100
                    let direction = Math.floor(Math.random() * Math.floor(3)) - 1

                    // If sand
                    if (current.type === Type.Sand) {
                        // If can fall
                        if (this.getNeighbour(x, y, 0, 1).type === Type.Empty) {
                            this.setParticle(x, y, 0, 1, current)
                            this.setParticle(x, y, 0, 0, new Particle(Type.Empty))

                        // If can fall through water
                        } else if (this.getNeighbour(x, y, 0, 1).type === Type.Water) {
                            let below = this.getNeighbour(x, y, 0, 1)
                            this.setParticle(x, y, 0, 1, current)
                            this.setParticle(x, y, 0, 0, below)

                        // If can fall sideways
                        } else if (this.getNeighbour(x, y, direction, 1).type === Type.Empty) {
                            this.setParticle(x, y, direction, 1, current)
                            this.setParticle(x, y, 0, 0, new Particle(Type.Empty))
                        }

                    // If water
                    } else if (current.type === Type.Water) {
                        // If can fall
                        if (this.getNeighbour(x, y, 0, 1).type === Type.Empty) {
                            this.setParticle(x, y, 0, 1, current)
                            this.setParticle(x, y, 0, 0, new Particle(Type.Empty))

                        // If can fall sideways
                        } else if (this.getNeighbour(x, y, direction, 1).type === Type.Empty) {
                            this.setParticle(x, y, direction, 1, current)
                            this.setParticle(x, y, 0, 0, new Particle(Type.Empty))

                        // If can move sideways
                        } else if (this.getNeighbour(x, y, direction, 0).type === Type.Empty) {
                            this.setParticle(x, y, direction, 0, current)
                            this.setParticle(x, y, 0, 0, new Particle(Type.Empty))
                        }

                    // If tap
                    } else if (current.type === Type.Tap) {
                        // If we don't have something to dispense, look for it
                        if (!current.dispenses) {
                            // Look up
                            if (this.getNeighbour(x, y, 0, -1).type !== Type.Empty) {
                                if (this.getNeighbour(x, y, 0, -1).type === Type.Tap) {
                                    current.dispenses = this.getNeighbour(x, y, 0, -1).dispenses
                                } else {
                                    current.dispenses = this.getNeighbour(x, y, 0, -1).type
                                }

                            // Look left
                            } else if (this.getNeighbour(x, y, -1, 0).type !== Type.Empty) {
                                if (this.getNeighbour(x, y, -1, 0).type === Type.Tap) {
                                    current.dispenses = this.getNeighbour(x, y, -1, 0).dispenses
                                } else {
                                    current.dispenses = this.getNeighbour(x, y, -1, 0).type
                                }

                            // Look right
                            } else if (this.getNeighbour(x, y, 1, 0).type !== Type.Empty) {
                                if (this.getNeighbour(x, y, 1, 0).type === Type.Tap) {
                                    current.dispenses = this.getNeighbour(x, y, 1, 0).dispenses
                                } else {
                                    current.dispenses = this.getNeighbour(x, y, 1, 0).type
                                }

                            // Look down
                            } else if (this.getNeighbour(x, y, 0, 1).type !== Type.Empty) {
                                if (this.getNeighbour(x, y, 0, 1).type === Type.Tap) {
                                    current.dispenses = this.getNeighbour(x, y, 0, 1).dispenses
                                } else {
                                    current.dispenses = this.getNeighbour(x, y, 0, 1).type
                                }
                            }

                        // We do have something to dispense
                        } else {
                            // Dispense down
                            if (this.getNeighbour(x, y, 0, 1).type === Type.Empty) {
                                this.setParticle(x, y, 0, 1, new Particle(current.dispenses))
                            }

                            // Dispense left
                            if (this.getNeighbour(x, y, -1, 0).type === Type.Empty) {
                                this.setParticle(x, y, -1, 0, new Particle(current.dispenses))
                            }

                            // Dispense right
                            if (this.getNeighbour(x, y, 1, 0).type === Type.Empty) {
                                this.setParticle(x, y, 1, 0, new Particle(current.dispenses))
                            }

                            // Dispense up
                            if (this.getNeighbour(x, y, 0, -1).type === Type.Empty) {
                                this.setParticle(x, y, 0, -1, new Particle(current.dispenses))
                            }
                        }

                    // Ice
                    } else if (current.type === Type.Ice && chance > 94) {
                        // Look up
                        if (this.getNeighbour(x, y, 0, -1).type === Type.Water) {
                            this.setParticle(x, y, 0, -1, new Particle(Type.Ice))

                        // Look left
                        } else if (this.getNeighbour(x, y, -1, 0).type === Type.Water) {
                            this.setParticle(x, y, -1, 0, new Particle(Type.Ice))

                        // Look right
                        } else if (this.getNeighbour(x, y, 1, 0).type === Type.Water) {
                            this.setParticle(x, y, 1, 0, new Particle(Type.Ice))

                        // Look down
                        } else if (this.getNeighbour(x, y, 0, 1).type === Type.Water) {
                            this.setParticle(x, y, 0, 1, new Particle(Type.Ice))
                        }

                    // Plant
                    } else if (current.type === Type.Plant && chance > 80) {
                        // Look up
                        if (this.getNeighbour(x, y, 0, -1).type === Type.Water) {
                            this.setParticle(x, y, 0, -1, new Particle(Type.Plant))
                            // Set other neighbours to empty
                            this.setParticleIf(x, y, -1, 0, Type.Water, new Particle(Type.Empty))
                            this.setParticleIf(x, y, 1, 0, Type.Water, new Particle(Type.Empty))
                            this.setParticleIf(x, y, 0, 1, Type.Water, new Particle(Type.Empty))

                        // Look left
                        } else if (this.getNeighbour(x, y, -1, 0).type === Type.Water) {
                            this.setParticle(x, y, -1, 0, new Particle(Type.Plant))
                            // Set other neighbours to empty
                            this.setParticleIf(x, y, 0, -1, Type.Water, new Particle(Type.Plant))
                            this.setParticleIf(x, y, 1, 0, Type.Water, new Particle(Type.Plant))
                            this.setParticleIf(x, y, 0, 1, Type.Water, new Particle(Type.Plant))

                        // Look right
                        } else if (this.getNeighbour(x, y, 1, 0).type === Type.Water) {
                            this.setParticle(x, y, 1, 0, new Particle(Type.Plant))
                            // Set other neighbours to empty
                            this.setParticleIf(x, y, 0, -1, Type.Water, new Particle(Type.Plant))
                            this.setParticleIf(x, y, -1, 0, Type.Water, new Particle(Type.Plant))
                            this.setParticleIf(x, y, 0, 1, Type.Water, new Particle(Type.Plant))

                        // Look down
                        } else if (this.getNeighbour(x, y, 0, 1).type === Type.Water) {
                            this.setParticle(x, y, 0, 1, new Particle(Type.Plant))
                            // Set other neighbours to empty
                            this.setParticleIf(x, y, 0, -1, Type.Water, new Particle(Type.Plant))
                            this.setParticleIf(x, y, -1, 0, Type.Water, new Particle(Type.Plant))
                            this.setParticleIf(x, y, 1, 0, Type.Water, new Particle(Type.Plant))
                        }
                    }
                }
            }
        }

        this.draw()

        window.setTimeout(() => {
            game.step()
        })
    }

    draw() {
        if (!this.playing) return

        // Only draw white background if we're drawing from scratch
        // Clear background
        // this.context.fillStyle = 'white';
        // this.context.fillRect(0, 0, this.particle_size * this.size, this.particle_size * this.size)

        // Draw particles
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                // Only draw all particles if we're drawing from scratch
                // if (this.particles[x * this.size + y].type !== Type.Empty) {
                //     ctx.fillStyle = this.particles[x * this.size + y].colour()
                //     ctx.fillRect(x * this.particle_size, y * this.particle_size, this.particle_size, this.particle_size)
                // }

                if (this.particles[x * this.size + y].iterated(this.iteration)) {
                    ctx.fillStyle = this.particles[x * this.size + y].colour()
                    ctx.fillRect(x * this.particle_size, y * this.particle_size, this.particle_size, this.particle_size)
                }
            }
        }

        // Draw overlay
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, 120, 40)
        this.context.fillStyle = 'white';
        this.context.font = '20px sans-serif'
        this.context.fillText(this.fps + '/' + Math.round(1000 / this.options.interval) + ' FPS', 10, 25)
    }

    // Update the known mouse position
    updateMousePosition(x, y) {
        this.mouse_x = x
        this.mouse_y = y
    }

    // Overwrite particles at given position
    paint(x, y) {
        x = Math.round(x / this.particle_size)
        y = Math.round(y / this.particle_size)

        let cursor_size = Math.floor(this.size / 20)
        for (let i = -cursor_size; i < cursor_size / 2; i++) {
            for (let j = -cursor_size; j < cursor_size / 2; j++) {
                this.setParticle(x, y, i, j, new Particle(this.selection))
            }
        }
    }
}

let game = new Game(canvas, 200,{
    interval: 1000 / 60, // FPS
})

game.play()

function getMousePos(canvas, event) {
    let rect = canvas.getBoundingClientRect()
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

function mousemove(event) {
    let pos = getMousePos(canvas, event)

    game.updateMousePosition(pos.x, pos.y)
}
window.addEventListener('mousedown', () => {
    game.clicked = true
}, false)
window.addEventListener('mouseup', () => {
    game.clicked = false
}, false)
window.addEventListener('mousemove', mousemove, false)
window.addEventListener('keypress', event => {
    if (event.key === '1') {
        game.selection = Type.Empty
    } else if (event.key === '2') {
        game.selection = Type.Wall
    } else if (event.key === 's') {
        game.selection = Type.Sand
    } else if (event.key === 'w') {
        game.selection = Type.Water
    } else if (event.key === '3') {
        game.selection = Type.Tap
    } else if (event.key === 'i') {
        game.selection = Type.Ice
    }
})


