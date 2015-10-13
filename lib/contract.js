
var web3 = require('web3')
  , c = require('chalk')
var log = require('./utils').log


exports.connect = function (host, port) {
  var addr = ['http://', host || 'localhost', ':', port || 6767].join('')
  log(c.blue('RPC address:'), c.grey(addr))

  web3.setProvider(new web3.providers.HttpProvider(addr))
}

exports.compile = function (source) {
  return web3.eth.compile.solidity(source)
}

exports.deploy = function (source, accountAddress, done) {
  var compiled = this.compile(source)
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
        log(c.blue('Contract transaction sent.'))
        log(
          c.blue('TransactionHash:'),
          c.grey(contract.transactionHash),
          c.blue('waiting to be mined...'))
      }
      else {
        log(c.blue('Contract mined!'))
        log(
          c.blue('Address:'),
          c.grey(contract.address))
        done(null, contract)
      }
  })
}

exports.instantiate = function (source, contractAddress) {
  var compiled = this.compile(source)
    , contractName = Object.keys(compiled)[0]
    , abiDefinition = compiled[contractName].info.abiDefinition

  return web3.eth.contract(abiDefinition).at(contractAddress)
}
