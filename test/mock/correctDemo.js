'use strict'

const delay = (interval = 1000) => {
  return new Promise(resolve => {
    setTimeout(resolve, interval)
  })
}

exports.main_handler = (event, context, callback) => {
  delay().then(res => {
    callback(null, 'sync-correct')
  })
  return 'sync-correct'
}
