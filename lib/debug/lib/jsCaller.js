const { fork } = require('child_process')
const path = require('path')

module.exports = env => {
  return fork(path.join(__dirname, './wrapper'), {
    silent: true,
    env
  })
}
