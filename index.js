#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var web3 = require('web3')
var minimist = require('minimist')
var vorpal = require('vorpal')
var RPC = require('./lib/rpc')
var Contract = require('./lib/contract')
var utils = require('./lib/utils')
require('babel/polyfill')

var argv = minimist(process.argv.slice(2), {string: ['a', 'address']})

if (argv.h || argv.help) {
  // log.help()
  process.exit()
}

if (!argv.f && !argv.file) {
  console.log('Specify contract file')
  process.exit()
}

utils.promisify()

var cli = vorpal()

function log (type, value, json) {
  cli.log.apply(cli, utils.log(type, value, json))
}

var account = {}

// RPC

var rpc = new RPC({host: argv.host, port: argv.p || argv.port})

rpc.on('connection', function (connected) {
  if (connected) {
    log('RPC', 'Connected!')
  }
  else {
    log('RPC', 'Disconnected!')
  }
})

log('RPC', rpc.url)
log('RPC', 'Disconnected!')
rpc.connect()
rpc.watch()

// Contract

var source = fs.readFileSync(path.join(__dirname, argv.f || argv.file), 'utf8')
var contract = new Contract(source)

contract.on('deploying', function (contract) {
  log('Contract', 'Transaction sent!')
  log('Transaction', contract.transactionHash) // waiting to be mined...
})

contract.on('deployed', function (contract) {
  log('Contract', 'Mined!')
  log('Contract', contract, true)
})

// CLI

cli
  .command('compile', 'Compile contract')
  .action(async (args, done) => {
    var compiled = await contract.compile()
    log('Contract', compiled, true)
    done()
  })
cli
  .command('deploy', 'Deploy contract')
  .option('-a, --address', 'Account address')
  .types({string: ['a', 'address']})
  .action(function (args, done) {
    var input = utils.pick(args.options.a || args.options.address)
    var accountAddress = input || web3.eth.accounts[0]
    // currently stored on deploy
    account.address = accountAddress
    contract.deploy(accountAddress)
    done()
  })
cli
  .command('init', 'Instantiate contract')
  .option('-a, --address', 'Contract address')
  .types({string: ['a', 'address']})
  .action(function (args, done) {
    var input = utils.pick(args.options.a || args.options.address)
    var contractAddress = input
    contract.init(contractAddress)
    done()
  })
cli
  .command('name <name>', 'Specify contract name')
  .action(function (args, done) {
    registerREPL(args.name)
    contract.name = args.name
    done()
  })
cli
  .delimiter('contract$')
  .show()


function registerREPL (name) {
  cli
    .mode(name)
    .delimiter(name + ':')
    .action(function (input, done) {
      input = 'contract.instance.' + input
      if (/.*\.watch$/.test(input)) {
        input += '(' + contractWatch.toString() + ')'
      }
      eval(input)
      done()
    })
}

// used for watching contract filters
function contractWatch (err, result) {
  if (err) {
    console.log(err)
  }
  else {
    log('Event', result, true)
  }
}
