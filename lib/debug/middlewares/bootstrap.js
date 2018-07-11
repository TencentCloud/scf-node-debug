// external depend
const path = require('path')
const { fork, spawn } = require('child_process')
const ora = require('ora')

// internal depend
const { scfConfig } = require('../config')
const logger = require('../lib/logger')
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

    /**************************************************
                            启动子进程
    ***************************************************/
    try {
      childProcess = fork(path.join(__dirname, '../lib/wrapper'), {
        silent: true,
        env: {
          entry: path.resolve(process.cwd(), entry),
          handler,
          event: JSON.stringify(ctx.testModel)
        }
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
    // 接收子进程的console
    childProcess.stdout.on('data', data => {
      // logger.info(`stdout: ${data}`);
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

          logger.debug(`运行错误：${error}`)
          logger.debug(`运行结果：${returnVal}`)
          logger.debug(`进程返回码：${exitCode}`)

          resolve()
          next()
        }
        num++
      }, interval)
    })
  }
}
