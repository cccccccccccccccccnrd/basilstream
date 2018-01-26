let settings, interval, distance, backupMode

getSettings()

function getSettings() {

  let request = new XMLHttpRequest()

  request.open('get', '/getsettings', true)
  request.onload = function() {
    settings = JSON.parse(request.responseText)
    interval = settings.interval
    distance = settings.distance

    document.getElementById('interval').value = interval
    document.getElementById('distance').value = distance
  }
  request.send()
}

function postSettings() {
  interval = document.getElementById('interval').value
  distance = document.getElementById('distance').value
  set = document.getElementById('set')

  settings = {
    interval: interval,
    distance: distance
  }

  let request = new XMLHttpRequest()

  request.open('post', '/postsettings', true)
  request.setRequestHeader('content-type', 'text/plain')
  request.send(JSON.stringify(settings))

  set.innerHTML = 'Saved'
  set.style.backgroundColor = 'red'
  set.style.color = 'white'

  setTimeout(function() {
    set.innerHTML = 'Set'
    set.style.backgroundColor = 'black'
    set.style.color = 'red'
  }, 1250)
}
