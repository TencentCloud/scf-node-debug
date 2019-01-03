'use strict'
exports.main_handler = (event, context, callback) => {
  setTimeout(() => {
    console.log('test')
  }, 4000)
  return 'test123'
}
