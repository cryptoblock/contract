
var c = require('chalk')
var contract = require('./contract')
  , utils = require('./utils')
  , log = utils.log


exports.process = function (argv, state, done) {
  if (argv.h || argv.help) {
    utils.help()
    done()
  }

  // commands

  if (argv.c || argv.compile) {
    var compiled = contract.compile(state.source)
    utils.json(compiled)
    done()
  }

  else if (argv.d || argv.deploy) {
    var accountAddress = utils.pick(argv.a || argv.address) || web3.eth.accounts[0]

    contract.deploy(state.source, accountAddress, function (err, contract) {
      if (err) console.log(err)
      utils.json(contract)
      done()
    })
  }

  else if (argv.i || argv.instantiate) {
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
}
