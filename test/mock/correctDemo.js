'use strict'
exports.main_handler = (event, context, callback) => {
  setTimeout(() => {
    console.log('test')
  }, 2000)
  return 'test'
}
