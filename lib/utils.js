
var bluebird = require('bluebird')
var prettyjson = require('prettyjson')
var c = require('chalk')


exports.promisify = function (web3) {
  web3.eth.compile.solidity = bluebird.promisify(web3.eth.compile.solidity)
}

exports.pick = function (a, b) {
  if (typeof a === 'string') {
    return a
  }
  else if (typeof b === 'string') {
    return b
  }
  if (typeof a === 'number') {
    return a
  }
  else if (typeof b === 'number') {
    return b
  }
  if (typeof a === 'boolean') {
    return a
  }
  else if (typeof b === 'boolean') {
    return b
  }
}

exports.debug = function () {
  var debug = {}
  if (process.env.DEBUG) {
    process.env.DEBUG.split(',').forEach(function (flag) {
      debug[flat] = true
    })
  }
  return debug
}

// log

function timestamp () {
  var hours = (new Date).getHours()
    , minutes = (new Date).getMinutes()

  if (minutes < 10) {
    minutes = '0' + minutes
  }

  return '[' + hours + ':' + minutes + ']'
}

function json (obj) {
  var options = {
    keysColor: 'blue',
    stringColor: 'grey'
  }
  return prettyjson.render(obj, options)
}

exports.log = function (type, value, isJson) {
  var args = [c.grey(timestamp()), c.blue(type)]

  if (isJson) {
    args.push('\n' + json(value))
  }
  else {
    args.push(c.grey(value))
  }

  return args
}
