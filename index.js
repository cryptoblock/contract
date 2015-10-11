#!/usr/bin/env node

var fs = require('fs')
  , path = require('path')
var web3 = require('web3')
var minimist = require('minimist')
  , inquirer = require('inquirer')
var contract = require('./lib/contract')
  , utils = require('./lib/utils')


var argv = minimist(process.argv.slice(2), {string: ['a', 'address']})

if (argv.h || argv.help) {
  utils.help()
  process.exit()
}

if (!argv.f && !argv.file) {
  console.log('Specify contract file')
  process.exit()
}

var state = {
  source: fs.readFileSync(path.join(__dirname, argv.f || argv.file), 'utf8'),
  name: '',
  contract: null
}

contract.connect(argv.host, argv.p || argv.port)


function _process (argv, done) {
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
      console.log('Specify contract address')
      done()
      return
    }

    state.name = argv.i || argv.instantiate
    state.contract = contract.instantiate(state.source, contractAddress)
    cli[0].message = state.name + '$'
    console.log(state.contract)
    done()
  }
}

var cli = [
  {
    type: 'input',
    name: 'command',
    message: 'contract-tools$'
  }
]

function run() {
  inquirer.prompt(cli, function (result) {
    if (cli[0].message === 'contract-tools$') {
      var argv = minimist(result.command.split(' '), {string: ['a', 'address']})
      _process(argv, run)
    }
    else {
      console.log(result.command.replace(state.name, 'state.contract'))
      eval(result.command.replace(state.name, 'state.contract'))
      run()
    }
  })
}

run()
