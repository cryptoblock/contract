#!/usr/bin/env node

var fs = require('fs')
  , path = require('path')
var web3 = require('web3')
var minimist = require('minimist')
  , inquirer = require('inquirer')
  , chalk = require('chalk')
var contract = require('./lib/contract')
  , prompt = require('./lib/prompt')
  , utils = require('./lib/utils')

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
  console.log('Specify contract file')
  process.exit()
}


contract.connect(argv.host, argv.p || argv.port)
console.log(chalk.red('Not connected!'))

setInterval(function () {
  var connected = web3.isConnected()
  if (connected) {
    if (connected !== state.connected) {
      state.connected = connected
      console.log(chalk.green('Connected!'))
      run()
    }
  }
  else {
    if (connected !== state.connected) {
      state.connected = connected
      console.log(chalk.red('Not connected!'))
    }
  }
}, 1000)

function run() {
  inquirer.prompt([state.cli], function (result) {
    if (!state.connected) {
      console.log(chalk.red('Not connected!'))
      run()
      return
    }
    if (state.cli.message === 'contract-tools$') {
      var argv = minimist(result.command.split(' '), {string: ['a', 'address']})
      prompt.process(argv, state, run)
    }
    else {
      console.log(result.command.replace(state.name, 'state.contract'))
      eval(result.command.replace(state.name, 'state.contract'))
      run()
    }
  })
}
