let mongoose = require('mongoose')
let IOTA = require('iota.lib.js')

let attachMode = true

function bundleData(surfaceArea) {
  let id = 'first-prototype@home'
  let d = new Date()
  let timestamp = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getHours() + '-' + d.getMinutes()

  let dataBundle = {
    id: id,
    timestamp: timestamp,
    surface_area: surfaceArea
  }

  if (attachMode === false) {
    sendDataToMongoDB(dataBundle)
  } else {
    //sendDataToMongoDB(dataBundle)
    sendDataToTangle(dataBundle)
  }
}

function sendDataToMongoDB(dataBundle) {
  mongoose.connect(process.env.MONGODB, {
    useMongoClient: true
  })
  mongoose.Promise = global.Promise

  let schema = new mongoose.Schema({
    id: String,
    timestamp: String,
    surface_area: Number
  })

  let basilstreamCollection = mongoose.model('basilstream', schema)

  let newestBasilstreamItem = basilstreamCollection(dataBundle).save(function(err, data) {
    if (err) throw err
    console.log('Successfully stored data: ' + JSON.stringify(data))
  })
}

function sendDataToTangle(dataBundle) {
  let seed = process.env.SEED
  let address = process.env.ADDRESS

  let iota = new IOTA({
    'provider': 'http://178.238.237.200:14265'
  });

  let stringifiedData = JSON.stringify(dataBundle)

  let transfers = [{
    'address': address,
    'value': 0,
    'message': iota.utils.toTrytes(stringifiedData)
  }]

  console.log('Prepared transaction: ' + JSON.stringify(dataBundle))
  let transactionDataBundle = JSON.stringify(dataBundle)

  iota.api.sendTransfer(seed, 4, 14, transfers, function(err, bundle) {
    if (err) throw err
    console.log('Successfully sent transaction: ', bundle)
    let transactionHash = bundle[0].hash
    module.exports.transactionHash = transactionHash
  })
  module.exports.transactionDataBundle = transactionDataBundle
}

module.exports.bundleData = bundleData
