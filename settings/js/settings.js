let settings, interval, distance, backupMode

getSettings()

function getSettings() {

  let request = new XMLHttpRequest()

  request.open('get', '/getsettings', true)
  request.onload = function() {
    settings = JSON.parse(request.responseText)
    interval = settings.interval
    distance = settings.distance
    backupMode = settings.backupMode

    document.getElementById('interval').value = interval
    document.getElementById('distance').value = distance
    document.getElementById('backup-mode').checked = backupMode
  }
  request.send()
}

function postSettings() {
  interval = document.getElementById('interval').value
  distance = document.getElementById('distance').value
  backupMode = document.getElementById('backup-mode').checked

  settings = {
    interval: interval,
    distance: distance,
    backupMode: backupMode
  }

  let request = new XMLHttpRequest()

  request.open('post', '/postsettings', true)
  request.setRequestHeader('content-type', 'text/plain')
  request.send(JSON.stringify(settings))

  console.log('Sent settings: ' + JSON.stringify(settings))
}
