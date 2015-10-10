#!/usr/bin/env node

var fs = require('fs')
  , path = require('path')
var web3 = require('web3')
var minimist = require('minimist')
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
var source = fs.readFileSync(path.join(__dirname, argv.f || argv.file), 'utf8')


contract.connect(argv.host, argv.p || argv.port)

if (argv.c || argv.compile) {
  var compiled = contract.compile(source)
  utils.json(compiled)
  process.exit()
}

else if (argv.d || argv.deploy) {
  var accountAddress = utils.pick(argv.a || argv.address) || web3.eth.accounts[0]

  contract.deploy(source, accountAddress, function (err, contract) {
    if (err) console.log(err)
    utils.json(contract)
    process.exit()
  })
}

else if (argv.i || argv.instantiate) {
  console.log(argv)
  var contractAddress = utils.pick(argv.a || argv.address)
  if (!contractAddress) {
    console.log('Specify contract address')
    process.exit()
  }

  var contract = contract.instantiate(source, contractAddress)
  console.log(contract)
  process.exit()
}
