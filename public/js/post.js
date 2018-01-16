let canvas, canvas2d, surfaceAreaP

let surfaceArea = 0
let distance = 5
let interval = 0.1 // In minutes

//setInterval(post, interval * 60000)

setupUserInterface()
renderUserInterface()

function setupUserInterface() {
  canvas = document.getElementById('canvas')
  canvas2d = canvas.getContext('2d')

  surfaceAreaP = document.getElementById('surface-area')
}

function renderUserInterface() {
  surfaceAreaP.innerHTML = surfaceArea

  requestAnimationFrame(renderUserInterface)
}

tracking.ColorTracker.registerColor('custom', function(r, g, b) {
  if ((g - r) >= 30 && (g - b) >= 10) {
    return true
  }
})

let colors = new tracking.ColorTracker(['custom'])

colors.on('track', function(event) {
  if (event.data.length === 0) {
    canvas2d.clearRect(0, 0, canvas.width, canvas.height)
    surfaceArea = 0
  } else {
    event.data.forEach(function(rect) {
      canvas2d.clearRect(0, 0, canvas.width, canvas.height)
      drawRect(rect.x, rect.y, rect.width, rect.height)
    })
  }
})

tracking.track('#video', colors, {
  camera: true
})

function drawRect(x, y, width, height) {
  surfaceArea = Math.round((width * height) / distance)

  canvas2d.beginPath()
  canvas2d.rect(x, y, width, height)
  canvas2d.stroke()
  canvas2d.lineWidth = 2
  canvas2d.strokeStyle = 'red'
}

function post() {
  let request = new XMLHttpRequest()

  request.open('post', '/post', true)
  request.setRequestHeader('content-type', 'text/plain')
  request.send(surfaceArea)

  console.log('Sent surface area: ' + surfaceArea)
}
