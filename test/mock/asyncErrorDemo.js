'use strict'
exports.main_handler = async (event, context, callback) => {
  throw Error('error')
  return 'async-error'
}
