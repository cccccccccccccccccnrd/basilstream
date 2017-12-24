let sensorVars = [];
let logNum, trackedCanvas, logInterval, i, trackButton, areaText, logText, timestamp, sensorVar, sensorVarAvg;

// Sends transaction if true (connected to checkbox in gui)
let attachMode = false;

// Scaling factor to meassure surface area
let scaling = 5.6;

// Interval of measurements in seconds
let interval = 5;

let seed = "";
let basilAddress = "";
let basilTag = "LIFECYCLE BASILSTREAM";

let iota = new IOTA({
  "provider": "http://:14265"
});

function setup() {
  trackedCanvas = createCanvas(480, 320);
  trackedCanvas.id("trackedCanvas");
  trackButton = select("#trackButton");
  trackButton.mousePressed(startTracking);
  clearButton = select("#clearButton");
  clearButton.mousePressed(clearCanvas);
  areaText = select("#areaText");
  logText = select("#logText");
  logNumInput = select("#logNumInput");
}

function draw() {
  areaText.html(sensorVar + " mm&sup2;");
}

tracking.ColorTracker.registerColor("custom", function(r, g, b) {
  if ((g - r) >= 30 && (g - b) >= 10) {
    return true;
  }
});

let colors = new tracking.ColorTracker(["custom"]);

colors.on("track", function(event) {
  if (event.data.length === 0) {
    sensorVar = 0;
  } else {
    event.data.forEach(function(rect) {
      drawRect(rect.x, rect.y, rect.width, rect.height);
    });
  }
});

tracking.track("#webcamFeed", colors, {
  camera: true
});

function drawRect(x, y, width, height) {
  noFill();
  stroke("red");
  rect(x, y, width, height);
  sensorVar = Math.round((width * height) / scaling);
}

function getSensorVar(i) {
  clear();
  d = new Date();
  date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
  time = d.getHours() + "-" + d.getMinutes();
  timestamp = date + " " + time;
  logText.html("LOG-" + i + " " + timestamp + " " + sensorVar);

  // Pushes each measurement (log number, date, timestamp, value of surface area and if the measurement was a transaction) into an array
  sensorVars.push({
    "log-num": i,
    "date": date,
    "time": time,
    "value": sensorVar,
    "transaction": document.getElementById("attachModeInput").checked
  });

  // If the checkbox in the gui is checked, the measurement is being send to the tangle
  if (document.getElementById("attachModeInput").checked) {
    attachSensorVar(i, date, time, sensorVar);
  }
}

function saveSensorVar() {
  logNum = logNumInput.value();
  getSensorVar(logNum);
  logNum++;
  logNumInput.value(logNum);
}

function startTracking() {
  logInterval = setInterval(saveSensorVar, interval * 1000);
  saveSensorVar();
}

function clearCanvas() {
  clear();
  clearInterval(logInterval);
}

function attachSensorVar(attachLogNum, attachDate, attachTime, attachSensorVar) {
  let basilMessage = {
    "log-num": attachLogNum,
    "date": attachDate,
    "time": attachTime,
    "value": attachSensorVar
  }

  let basilMessageStringified = JSON.stringify(basilMessage);
  let basilMessageTrytes = iota.utils.toTrytes(basilMessageStringified);

  let transfer = [{
    "address": basilAddress,
    "value": 0,
    "message": basilMessageTrytes,
    "tag": basilTag
  }]

  iota.api.sendTransfer(seed, 1, 14, transfer, function(e, bundle) {
    if (e) throw e;
    console.log("Successfully sent transaction: ", bundle);
  })
}
