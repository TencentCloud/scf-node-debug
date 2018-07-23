// external depend
const koa = require('koa')
const path = require('path')

// internal depend
const utils = require('./helper/utils')
const logger = require('./lib/logger')
const config = require('./config')
const scfConfig = config.scfConfig
const bootstrap = require('./middlewares/bootstrap')
const extendForCtx = require('./middlewares/extendForCtx')
const testModel = require('./middlewares/testModel')

module.exports = {
  init(opts, cb) {
    const app = new koa()
    // 入口文件配置
    let entryOptions = {
      host: config.host,
      port: config.port,
      scfConfig
    }
    if (opts && opts.scfConfig) {
      entryOptions = Object.assign(entryOptions, opts)
    }
    /**************************************************
                       middleWares
    ***************************************************/
    // error Control
    app.use(async (ctx, next) => {
      try {
        await next()
        if (!utils.hasValue(ctx.body)) {
          ctx.status = 404
          ctx.body = {
            code: -1,
            message: 'no content body',
            data: null
          }
        } else {
          ctx.status = 200
        }
      } catch (e) {
        logger.error(e && e.toString && e.toString())
        ctx.body = {
          code: -1,
          message: e && e.toString && e.toString(),
          data: null
        }
      }
    })
    // 入参整理
    app.use(extendForCtx(testModel(entryOptions.scfConfig.testModel)))

    // timeout
    app.use(async (ctx, next) => {
      return Promise.race([
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject('timeout')
          }, entryOptions.scfConfig.timeout * 1000 + 500)
        }),
        next()
      ])
    })
    app.use(
      bootstrap(entryOptions.scfConfig.entry, entryOptions.scfConfig.handler)
    )

    return app.listen(entryOptions.port, cb || utils.empty.function)
  }
}
