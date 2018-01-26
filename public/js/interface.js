let canvas, canvas2d, surfaceAreaP, transactionDataBundle, transactionHash, surfaceArea, interval, distance, postSurfaceAreaInterval

getSettings()
setupUserInterface()
renderUserInterface()

function getSettings() {
  let request = new XMLHttpRequest()

  request.open('get', '/getsettings', true)
  request.onload = function() {
    settings = JSON.parse(request.responseText)
    interval = settings.interval
    distance = settings.distance

    clearInterval(postSurfaceAreaInterval)
    postSurfaceAreaInterval = setInterval(postSurfaceArea, interval * 60000)
  }
  request.send()
}

function setupUserInterface() {
  canvas = document.getElementById('canvas')
  canvas2d = canvas.getContext('2d')

  surfaceAreaP = document.getElementById('surface-area')
  transactionP = document.getElementById('transaction')
  transactionHashP = document.getElementById('transaction-hash')
}

function renderUserInterface() {
  surfaceAreaP.innerHTML = surfaceArea
  transactionP.innerHTML = transactionDataBundle
  transactionHashP.innerHTML = transactionHash

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

function postSurfaceArea() {
  let request = new XMLHttpRequest()

  request.open('post', '/postsurfacearea', true)
  request.setRequestHeader('content-type', 'text/plain')
  request.send(surfaceArea)

  getSettings()
  getTransactionDataBundle()
  getTransactionHash()
}

function getTransactionDataBundle() {
  let request = new XMLHttpRequest()

  request.open('get', '/gettransactiondatabundle', true)
  request.onload = function() {
    transactionDataBundle = request.responseText
  }
  request.send()
}

function getTransactionHash() {
  let request = new XMLHttpRequest()

  request.open('get', '/gettransactionhash', true)
  request.onload = function() {
    if (request.status === 403) {
      setTimeout(getTransactionHash, 3000)
    } else {
      transactionHash = request.responseText
    }
  }
  request.send()
}
