const compose = require('koa-compose')

module.exports = function () {
    const fnMiddleWares = compose([...arguments])
    return async (ctx, next) => {
        return await fnMiddleWares(ctx).then((res) => {
            return next()
        })
    }
}