const utils = require('../helper/utils')

module.exports = (eventType) => {
    return async (ctx, next) => {
        // 扩展requestId
        ctx.requestId = utils.guid()
        // 扩展testModel
        ctx.testModel = utils.generateEvent(ctx, eventType)

        next()
    }
}