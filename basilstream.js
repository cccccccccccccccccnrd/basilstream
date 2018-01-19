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
  mongoose.connect('mongodb://basil:stre4m@ds251737.mlab.com:51737/basilstream', {
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
  let seed = 'LJVMKLB9H9MLSMWUPIOTWIWDRAS9KNIECSTTIXAYBJ9GPXLBBCDFCYDLVEP9OWQNVWGHVVTYSI9VZIHOU'
  let address = 'ODRPQSM9MJJNUDHKAFSGGMFVDRVKCPOLSUBIOTYRLVSXRZLWXMKSZYFUSVYQ99RCBN9HKYCHEXMHDAILWCXNINLVCZ'

  let iota = new IOTA({
    'provider': 'http://iri1.iota.fm:80'
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
