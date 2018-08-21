// external depend
const koa = require('koa')
const path = require('path')
const bodyParser = require('koa-body')

// internal depend
const utils = require('./helper/utils')
const logger = require('./lib/logger')
const config = require('./config')
const scfConfig = config.scfConfig
const bootstrap = require('./middlewares/bootstrap')
const extendForCtx = require('./middlewares/extendForCtx')

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
    // bodyParser
    app.use(
      bodyParser({
        multipart: true,
        formidable: { maxFields: 5000 },
        formLimit: '5mb',
        jsonLimit: '5mb'
      })
    )
    // 入参扩展
    app.use(extendForCtx({ eventType: entryOptions.scfConfig.testModel }))

    // timeout
    app.use(async (ctx, next) => {
      return Promise.race([
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject('timeout')
          }, entryOptions.scfConfig.timeout * 1000 + 500)
        }),
        await next()
      ])
    })
    app.use(
      bootstrap(entryOptions.scfConfig.entry, entryOptions.scfConfig.handler,entryOptions.scfConfig.timeout)
    )

    return app.listen(entryOptions.port, cb || utils.empty.function)
  }
}
