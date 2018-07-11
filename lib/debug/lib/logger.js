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

function Logger(level = 2, prefix = '') {
  this.setLevel.call(this, level)
  this.prefix = prefix
  this.levelMap = levelMap
}

function now() {
  return `[${moment().format()}] `
}

Logger.prototype.setLevel = function(level) {
  if (typeof level !== 'string' && typeof level !== 'number') level = 2
  if (typeof level === 'string') level = levelMap[level]
  return (this.level = level)
}

Logger.prototype.error = function(msg, pureText) {
  if (this.level >= levelMap['error']) {
    if (pureText) return this.prefix + now() + colors['error'](msg)
    console.log(this.prefix + now() + colors['error'](msg))
  }
}

Logger.prototype.warn = function(msg, pureText) {
  if (this.level >= levelMap['warn']) {
    if (pureText) return this.prefix + now() + colors['warn'](msg)
    console.log(this.prefix + now() + colors['warn'](msg))
  }
}

Logger.prototype.info = function(msg, pureText) {
  if (this.level >= levelMap['info']) {
    if (pureText) return this.prefix + now() + colors['info'](msg)
    console.log(this.prefix + now() + colors['info'](msg))
  }
}

Logger.prototype.debug = function(msg, pureText) {
  if (this.level >= levelMap['debug']) {
    if (pureText) return this.prefix + now() + colors['debug'](msg)
    console.log(this.prefix + now() + colors['debug'](msg))
  }
}

module.exports = new Logger(2, '[Weapp CLI]')