const colors = require('colors/safe')
const moment = require('moment')

colors.setTheme({
  info: 'green',
  warn: 'yellow',
  debug: 'cyan',
  error: 'red'
})

const levelMap = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
}

Object.freeze(levelMap)

const DEFAULT_PREFIX = '[Weapp CLI]'

function Logger(level = 2, prefix = DEFAULT_PREFIX) {
  this.setLevel.call(this, level)
  this.prefix = prefix
  this.levelMap = levelMap
}

function now() {
  return `[${moment().format()}] `
}

Logger.prototype.setLevel = function(level = 2) {
  return (this.level = level)
}

Logger.prototype.setPrefix = function(prefix = DEFAULT_PREFIX) {
  return (this.prefix = prefix)
}

Logger.prototype.error = function(msg, pureText) {
  if (this.level >= levelMap['error']) {
    if (pureText) {
      return this.prefix + now() + colors['error'](msg)
    } else {
      console.log(this.prefix + now() + colors['error'](msg))
    }
  }
}

Logger.prototype.warn = function(msg, pureText) {
  if (this.level >= levelMap['warn']) {
    if (pureText) {
      return this.prefix + now() + colors['warn'](msg)
    } else {
      console.log(this.prefix + now() + colors['warn'](msg))
    }
  }
}

Logger.prototype.info = function(msg, pureText) {
  if (this.level >= levelMap['info']) {
    if (pureText) {
      return this.prefix + now() + colors['info'](msg)
    } else {
      console.log(this.prefix + now() + colors['info'](msg))
    }
  }
}

Logger.prototype.debug = function(msg, pureText) {
  if (this.level >= levelMap['debug']) {
    if (pureText) {
      return this.prefix + now() + colors['debug'](msg)
    } else {
      console.log(this.prefix + now() + colors['debug'](msg))
    }
  }
}

Logger.prototype.now = function() {
  return now()
}

module.exports = new Logger(2)
