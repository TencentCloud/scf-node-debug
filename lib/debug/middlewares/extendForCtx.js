const utils = require('../helper/utils')

module.exports = function({ eventType = 'http' }) {
  return async function(ctx, next) {
    // 扩展requestId
    ctx.requestId = utils.guid()
    // 扩展testModel
    ctx.testModel = utils.generateEvent(ctx, eventType)
    // 重写toJSON，返回更多参数
    if (eventType === 'http') {
      const tmpRequestStringify = JSON.stringify(ctx.testModel.request)
      ctx.testModel.request.toJSON = () => {
        return Object.assign(JSON.parse(tmpRequestStringify), {
          body: ctx.request.body,
          files: ctx.request.files
        })
      }

      const tmpCtxStringify = JSON.stringify(ctx.testModel)
      ctx.testModel.toJSON = () => {
        return Object.assign(JSON.parse(tmpCtxStringify), {
          request: Object.assign(JSON.parse(tmpRequestStringify), {
            body: ctx.request.body
          }),
          requestId: ctx.requestId,
          query: ctx.query,
          // for koa-body
          body: ctx.request.body,
          files: ctx.request.files
        })
      }
    }
    await next()
  }
}
