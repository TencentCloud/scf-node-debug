// external depend
const path = require('path')
const { fork, spawn } = require('child_process')
const ora = require('ora')
const Table = require('cli-table')
const colors = require('colors/safe')

// internal depend
const { scfConfig } = require('../config')
const logger = require('../lib/logger')
const utils = require('../helper/utils')
logger.setLevel(3)

let childProcess

function kill(process) {
  return process.kill()
}

module.exports = function(entry, handler) {
  return async function(ctx, next) {
    if (ctx.request.url === '/favicon.ico') {
      return next()
    }
    /**************************************************
                            子进程状态
    ***************************************************/
    let isDone = false // 子进程是否已经完成；同异步均完成/抛出错误/调用callback/return
    let error = null // 捕捉错误
    let returnVal = undefined // 入口脚本返回值
    let exitCode = 0 // exit code
    let log = [] 
    let MAX_BYTES = 6*1024*1024 // 云函数日志字节上限
    let headCell = [colors.green('Time'),colors.green('LogText')]
    const logTable = new Table({// 捕捉云函数日志
      head: headCell,
      colWidths: [30,80]
    })
    /**************************************************
                            启动子进程
    ***************************************************/

    let parentTaskEvn ={
      http_proxy: process.env.http_proxy,
      https_proxy:process.env.https_proxy,
      HTTP_PROXY:process.env.HTTP_PROXY,
      HTTPS_PROXY:process.env.HTTPS_PROXY,
    }

    let childTaskEnv =  {
      entry: path.resolve(process.cwd(), entry),
      handler,
      event: JSON.stringify(ctx.testModel)
    }

    try {
      childProcess = fork(path.join(__dirname, '../lib/wrapper'), {
        silent: true,
        env: Object.assign(parentTaskEvn,childTaskEnv)
      })
    } catch (e) {
      logger.error(e)
    }

    /**************************************************
                            监听子进程
    ***************************************************/
    // 接收到信息就代表进程结束
    childProcess.on('message', data => {
      isDone = true
      returnVal = data.returnVal
      error = data.error
      exitCode = data.exitCode
    })
    // 接收子进程的console，这里只捕捉云函数内的日志
    // 单条日志（console）不超过6M，超过部分会被截断
    // 总大小不超过6M，超过部分会被截断
    childProcess.stdout.on('data', data => {
      if(data.length>MAX_BYTES)  logger.warn(`请注意日志输出长度不要大于${MAX_BYTES}M,超出部分将被丢弃`)
      if(log.length<MAX_BYTES){
        log.push([
          logger.now(),
          data.slice(0,MAX_BYTES-log.length).toString()
        ])
      } else {
        logger.warn(`收集到的日志总量已经达到${MAX_BYTES}M,此后产生的日志将被丢弃`)
      }
      // logger.info(`stdout: ${data}`)
    })
    // 捕捉子进程的syntaxError
    childProcess.stderr.on('data', err => {
      logger.error(`运行错误: ${err}`)
      isDone = true
      error = err.toString()
    })
    childProcess.on('beforeExit', code => {
      // console.log('beforeExit: ', code)
    })
    // 如果子进程因为出错退出，则提前结束
    childProcess.on('exit', code => {
      isDone = true
      exitCode = code
    })
    childProcess.on('rejectionHandled', err => {
      // console.log('child rejectionHandled', err)
    })
    childProcess.on('unhandledRejection', err => {
      // console.log('child unhandledRejection', err)
    })
    childProcess.on('warning', err => {
      // console.log('child warning', err)
    })
    childProcess.on('error', err => {
      // console.log('child error', err)
    })
    childProcess.on('close', code => {
      // console.log('child close', code)
    })

    /**************************************************
                            处理返回结果
    ***************************************************/
    // 轮询获取子进程状态，超时/完成则kill子进程
    await new Promise((resolve, reject) => {
      let num = 0
      let timeout = false
      let interval = 100
      let printReturnVal
      const isObject = utils.isObject
      const isArray = utils.isArray

      const spinner = ora({
        text: logger.debug('SCF运行状态: pending... \n', true)
      }).start()

      let timer = setInterval(async () => {
        timeout = num > (scfConfig.timeout * 1000) / interval

        // 超时
        if (timeout || isDone) {
          clearInterval(timer)
          kill(childProcess)

          ctx.body = returnVal

          if (timeout) {
            spinner.fail(logger.error('SCF运行状态: rejected', true))
          }
          if (isDone) {
            spinner[error ? 'fail' : 'succeed'](
              logger[error ? 'error' : 'debug'](
                `SCF运行状态: ${error ? 'rejected' : 'resolved'}`,
                true
              )
            )
          }

          // 出错捕捉
          if (error) {
            ctx.body = error
          }

          // 超时控制
          if (timeout) logger.warn('SCF运行超时')
          if (!timeout) logger.debug('SCF运行结束')

          // 对象/数组做序列化，优化展示
          if (utils.isObject(returnVal) || utils.isArray(returnVal)) {
            printReturnVal = JSON.stringify(returnVal)
          } else if (utils.isFunction(returnVal)) {
            printReturnVal = returnVal.toString()
          } else {
            printReturnVal = returnVal
          }

         
          const hasLog = log.length!==0
          logger.debug(`运行错误：${error}`)
          logger.debug(`运行结果：${printReturnVal}`)
          logger.debug(`进程返回码：${exitCode}`)
          logger.debug(`日志内容：${hasLog?'':'没有日志输出'}`)
          if(hasLog){
            logTable.push(
              ...log
            )
            console.log(`${logTable.toString()}`)
          }

          resolve()
          next()
        }
        num++
      }, interval)
    })
  }
}
