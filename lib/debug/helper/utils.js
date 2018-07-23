const config = require('../config/config.development')

// 生成
module.exports = {
  // uuidV4生成requestID
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    )
  },
  /**
   * 值判断，为undefined|null则返回false，其余返回true
   * @param {*} str
   * @return {boolean}
   */
  hasValue(str) {
    return str ? true : str === undefined || str === null ? false : true
  },
  /**
   * 根据类型整理入参
   * @param {*} eventType
   */
  generateEvent(ctx, eventType) {
    if (eventType === 'http') return ctx
    const res = config.mock.testModel[eventType]
    if (!res)
      throw ReferenceError(
        '该事件测试模版没有进行过预定义，请先编写测试事件模版'
      )
    return res
  },
  empty: {
    function: () => {}
  }
}
