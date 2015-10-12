
var prettyjson = require('prettyjson')
  , columnify = require('columnify')
  , c = require('chalk')
var flags = require('../config/flags')


exports.pick = function (a, b) {
  if (typeof a === 'string') {
    return a
  }
  else if (typeof b === 'string') {
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

exports.json = function (obj) {
  var options = {
    keysColor: 'blue',
    stringColor: 'grey'
  }
  this.log(prettyjson.render(obj, options))
}

exports.help = function () {
  console.log(columnify(flags, {
    minWidth: 20
  }))
}

exports.log = function () {
  var hours = (new Date).getHours()
  var minutes = (new Date).getMinutes()
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  var time = ['[', hours, ':', minutes, ']'].join('')
  var args = [].slice.call(arguments)
  console.log.apply(console, [c.grey(time)].concat(args))
}
