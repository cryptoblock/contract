
import EventEmitter from 'events'
import util from 'util'
import Web3 from 'web3'
import request from 'request'
import async from 'async'


class RPC extends EventEmitter {
  constructor (options) {
    super()
    this.url = ['http://', options.host || 'localhost', ':', options.port || 6767].join('')
    this.connected = false
  }

  connect () {
    // web3.setProvider(new web3.providers.HttpProvider(this.url))
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.url))
    return this.web3
  }

  isConnectedAsync (done) {
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

  watch () {
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
}

export default RPC
