'use strict'
const delay = (interval = 1000) => {
  return new Promise(resolve => {
    setTimeout(resolve, interval)
  })
}

exports.main_handler = async (event, context, callback) => {
  await delay()
  return 'async-correct'
}
