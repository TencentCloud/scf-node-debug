'use strict'
exports.main_handler = (event, context, callback) => {
  let rpa = require('request-promise-any')
  rpa('https://gank.io/api/xiandu/categories').then(json => {
    console.log(json)
  })
  return 123
}
