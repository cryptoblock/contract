#!/usr/bin/env node

var fs = require('fs')
  , path = require('path')
var web3 = require('web3')
var minimist = require('minimist')
  , inquirer = require('inquirer')
  , c = require('chalk')
  , async = require('async')
var contract = require('./lib/contract')
  , prompt = require('./lib/prompt')
  , utils = require('./lib/utils')
  , log = utils.log

var argv = minimist(process.argv.slice(2), {string: ['a', 'address']})

var state = {
  connected: false,
  source: fs.readFileSync(path.join(__dirname, argv.f || argv.file), 'utf8'),
  name: '',
  contract: null,
  cli: {
    type: 'input',
    name: 'command',
    message: 'contract-tools$'
  }
}


if (argv.h || argv.help) {
  utils.help()
  process.exit()
}

if (!argv.f && !argv.file) {
  log(c.red('Specify contract file'))
  process.exit()
}


contract.connect(argv.host, argv.p || argv.port)
log(c.red('Not connected!'))

async.forever(function (done) {
  setTimeout(function () {
    utils.isConnectedAsync(argv.host, argv.p || argv.port, function (connected) {
      if (connected) {
        if (connected !== state.connected) {
          state.connected = connected
          log(c.green('Connected!'))
          run()
        }
      }
      else {
        if (connected !== state.connected) {
          state.connected = connected
          log(c.red('Not connected!'))
        }
      }
      done()
    })
  }, 1000)
})

function run() {
  inquirer.prompt([state.cli], function (result) {
    if (!state.connected) {
      log(c.red('Not connected!'))
      run()
      return
    }
    if (state.cli.message === 'contract-tools$') {
      var argv = minimist(result.command.split(' '), {string: ['a', 'address']})
      prompt.process(argv, state, run)
    }
    else {
      log(result.command.replace(state.name, 'state.contract'))
      eval(result.command.replace(state.name, 'state.contract'))
      run()
    }
  })
}
