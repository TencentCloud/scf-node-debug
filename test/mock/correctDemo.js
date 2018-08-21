'use strict'
exports.main_handler = (event, context, callback) => {
  console.log(event)
  setTimeout(()=>{},10*1000)
  return 'hello world'
}
