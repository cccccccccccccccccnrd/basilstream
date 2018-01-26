let mongoose = require('mongoose')
let IOTA = require('iota.lib.js')

function bundleData(surfaceArea) {
  let id = process.env.PLANTID
  let d = new Date()
  let timestamp = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getHours() + '-' + d.getMinutes()

  let dataBundle = {
    id: id,
    timestamp: timestamp,
    surface_area: surfaceArea
  }

  let backupMode
  console.log(backupMode)

  if (backupMode === true) {
    sendDataToTangle(dataBundle)
    sendDataToMongoDB(dataBundle)
  } else {
    sendDataToTangle(dataBundle)
  }
}

function sendDataToTangle(dataBundle) {
  let seed = process.env.SEED
  let address = process.env.ADDRESS

  let iota = new IOTA({
    'provider': process.env.NODE
  });

  let stringifiedData = JSON.stringify(dataBundle)

  let transfers = [{
    'address': address,
    'value': 0,
    'message': iota.utils.toTrytes(stringifiedData)
  }]

  let transactionDataBundle = JSON.stringify(dataBundle)

  iota.api.sendTransfer(seed, 4, 14, transfers, function(err, bundle) {
    if (err) throw err
    console.log(bundle)

    let transactionHash = bundle[0].hash
    let passTransactionHash = true

    module.exports.transactionHash = transactionHash
    module.exports.passTransactionHash = passTransactionHash
  })
  module.exports.transactionDataBundle = transactionDataBundle
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
    console.log('Stored:' + data)
  })
}

module.exports.bundleData = bundleData
