'use strict'
exports.main_handler = (event, context, callback) => {
  throw Error('error')
  return 'sync-error'
}
