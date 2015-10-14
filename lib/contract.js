
var events = require('events')
var util = require('util')
var web3 = require('web3')


function Contract (source) {
  this.source = source
  this.instance = null
  this.name = ''
  this.deploying = false
}
util.inherits(Contract, events.EventEmitter)


Contract.prototype.compile = function () {
  return web3.eth.compile.solidity(this.source)
}

Contract.prototype.deploy = function (accountAddress) {
  var self = this

  var compiled = self.compile()
    , contractName = Object.keys(compiled)[0]
    , Contract = web3.eth.contract(compiled[contractName].info.abiDefinition)

  Contract.new(
    0, // (uint initialValue)
    {
      from: accountAddress,
      data: compiled[contractName].code,
      gas: 1000000
    },
    function (err, contract) {
      if (err) return done(err)

      if (!contract.address) {
        self.deploying = true
        self.emit('deploying', contract)
      }
      else {
        self.instance = contract
        self.deploying = false
        self.emit('deployed', self.instance)
      }
  })
}

Contract.prototype.init = function (contractAddress) {
  var compiled = this.compile()
    , contractName = Object.keys(compiled)[0]
    , abiDefinition = compiled[contractName].info.abiDefinition

  this.instance = web3.eth.contract(abiDefinition).at(contractAddress)
}

module.exports = Contract
