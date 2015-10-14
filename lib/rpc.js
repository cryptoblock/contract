
var events = require('events')
var util = require('util')
var web3 = require('web3')
var request = require('request')
var async = require('async')


function RPC (options) {
  this.url = ['http://', options.host || 'localhost', ':', options.port || 6767].join('')
  this.connected = false
}
util.inherits(RPC, events.EventEmitter)
module.exports = RPC

RPC.prototype.connect = function () {
  web3.setProvider(new web3.providers.HttpProvider(this.url))
}

RPC.prototype.isConnectedAsync = function (done) {
  request({
    uri: this.url,
    form: {
      id: 9999999999,
      jsonrpc: '2.0',
      method: 'net_listening',
      params: []
    }
  }, function (err, res, body) {
    if (err) {
      done(false)
    }
    else {
      done(true)
    }
  })
}

RPC.prototype.watch = function () {
  var self = this

  async.forever(function (done) {
    setTimeout(function () {
      self.isConnectedAsync(function (connected) {
        if (connected !== self.connected) {
          self.connected = connected
          self.emit('connection', self.connected)
        }
        done()
      })
    }, 1000)
  })
}
