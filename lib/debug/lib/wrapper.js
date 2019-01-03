// external depend
const path = require('path')
const EventEmitter = require('events')

// internal depend
const utils = require('../helper/utils')
const logger = require('./logger')
logger.setLevel(1)
/**************************************************
                    环境变量
***************************************************/
const envList = process.env
const entry = envList.entry // 入口文件
const handler = envList.handler // 入口函数
const event = JSON.parse(envList.event) // 请求主体
// const cb = JSON.parse(envList.cb) // 响应请求
/**************************************************
                    scf执行状态
***************************************************/
const entryScript = require(path.resolve(__dirname, entry)) // 入口执行脚本
let returnVal = undefined // 入口脚本返回值
let exitCode = 0 // exit code
let error = null // 错误

/**************************************************
            scf入参context/callback
***************************************************/
// context对象
const context = {
  done: callback,
  request_id: utils.guid()
}

// 结束本次执行并返回内容
function callback(err, data) {
  error = err
  // const tmpBuffer = new Buffer(1073741824)
  returnVal = JSON.stringify(data)
  logger.debug('child_process callback')
  // 这里用emit('exit')、send不奏效
  ipcSend({ error, returnVal, exitCode }, () => {
    logger.info('---Has send from ipc---')
    process.exit(0)
  })
}

// 通过ipc与父进程通信
function ipcSend({ error, returnVal, exitCode }, cb) {
  try {
    process.send({ error, returnVal, exitCode }, cb)
  } catch (e) {
    logger.debug(`ipcSend has occured error: ${e}`)
  }
}

/**************************************************
                    scf状态监听
***************************************************/
// 同步错误捕捉
try {
  returnVal = entryScript[handler](event, context, callback)
  logger.debug(`returnVal: ${returnVal}`)

  // 返回object
  if (typeof returnVal === 'object') {
    // async执行完返回一个object
    if (returnVal instanceof Promise) {
      returnVal.then(res => {
        if (typeof res === 'function') {
          returnVal = null
        } else {
          returnVal = res
        }
      })
    }
  }
  // 返回function，置于null
  if (typeof returnVal === 'function') {
    returnVal = null
  }
} catch (syncErr) {
  // 已知类型的错误
  if (syncErr.stack) {
    throw syncErr
  }
  // 未知类型的错误默认Error
  else {
    throw Error(syncErr)
  }
}
// promise错误捕捉
process.on('unhandledRejection', asyncErr => {
  logger.debug(`child_process unhandledRejection: ${asyncErr}`)
  // 已知类型的错误
  if (asyncErr.stack) {
    throw asyncErr
  }
  // 未知类型的错误默认Error
  else {
    throw Error(asyncErr)
  }
})
// 兜底捕捉
process.on('uncaughtException', err => {
  logger.debug(`child_process uncaughtException: ${err}`)
  // 已知类型的错误
  if (err.stack) {
    throw err
  }
  // 未知类型的错误默认Error
  else {
    throw Error(err)
  }
})

process.on('close', err => {
  logger.debug(`child_process close: ${err}`)
})

process.on('error', err => {
  logger.debug(`child_process error: ${err}`)
  ipcSend({ error, returnVal, exitCode }, () => {
    logger.debug('---Has send from ipc---')
  })
})

process.on('rejectionHandled', err => {
  logger.debug(`child_process rejectionHandled: ${err}`)
})

process.on('warning', err => {
  logger.debug(`child_process warning: ${err}`)
})

// FIX: 这里node在9.7.0版本下有bug，console.log本质也是异步实现，这里会进入死循环
process.on('beforeExit', code => {
  // logger.debug(`child_process beforeExit: ${code}`)
})

process.on('exit', code => {
  logger.debug(`child_process exit: ${code}`)
  exitCode = code
  ipcSend({ error, returnVal, exitCode }, () => {
    logger.debug('---Has send from ipc---')
  })
})
