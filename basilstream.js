const IOTA = require('iota.lib.js')

function bundleData(surfaceArea) {
  let id = process.env.PLANTID
  let d = new Date()
  let timestamp = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getHours() + '-' + d.getMinutes()

  let dataBundle = {
    id: id,
    timestamp: timestamp,
    surface_area: surfaceArea
  }

  sendDataToTangle(dataBundle)
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
    console.log('\nTRANSACTION SUCCESSFUL: ' + JSON.stringify(bundle))

    let transactionHash = bundle[0].hash
    let passTransactionHash = true

    module.exports.transactionHash = transactionHash
    module.exports.passTransactionHash = passTransactionHash
  })
  module.exports.transactionDataBundle = transactionDataBundle
}

module.exports.bundleData = bundleData
