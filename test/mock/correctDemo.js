'use strict'
exports.main_handler = (event, context, callback) => {
  event.request['header']['user-agent'] =
    event.request['header']['user-agent'] +
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
  console.log(event)
  setTimeout(() => {}, 1 * 1000)
  return 'hello world'
}
