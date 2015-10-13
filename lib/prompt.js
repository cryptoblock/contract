
var web3 = require('web3')
  , c = require('chalk')
var contract = require('./contract')
  , utils = require('./utils')
  , log = utils.log


exports.process = function (argv, state, done) {
  if (argv.h || argv.help) {
    utils.help()
    done()
  }

  if (argv.c || argv.compile) {
    this.compile(state, done)
  }

  else if (argv.d || argv.deploy) {
    this.deploy(state, done)
  }

  else if (argv.i || argv.instantiate) {
    this.instantiate(state, done)
  }
}

exports.compile = function (state, done) {
  var compiled = contract.compile(state.source)
  utils.json(compiled)
  done()
}

exports.deploy = function (state, done) {
  var accountAddress = utils.pick(argv.a || argv.address) || web3.eth.accounts[0]

  contract.deploy(state.source, accountAddress, function (err, contract) {
    if (err) console.log(err)
    utils.json(contract)
    done()
  })
}

exports.instantiate = function (state, done) {
  var contractAddress = utils.pick(argv.a || argv.address)
  if (!contractAddress) {
    log(c.red('Specify contract address!'))
    done()
    return
  }

  state.name = argv.i || argv.instantiate
  state.contract = contract.instantiate(state.source, contractAddress)
  state.cli.message = state.name + '$'
  log(state.contract)
  done()
}
