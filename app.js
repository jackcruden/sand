const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d', {
    alpha: false
})

// Set white background
ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)

// Draw rect
ctx.fillStyle = 'green'
ctx.fillRect(10, 10, 150, 100)

draw()

function draw()
{
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let pixels = imageData.data

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let pixel = (y * canvas.width + x) * 4
            let value = x * y & 0xff
            pixels[pixel] = value // red
            pixels[pixel++] = value // green
            pixels[pixel++] = value // blue
            pixels[pixel++] = 255 // alpha
        }
    }

    ctx.putImageData(imageData, 0, 0)
}
