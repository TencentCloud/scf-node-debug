const config = require('../config/config.development')
const util = require('util')

const mixin = {
  isType(type) {
    const typeMap = [
      'Number',
      'String',
      'Function',
      'Null',
      'Undefined',
      'Array',
      'Object',
      'Symbol'
    ]
    if (typeMap.indexOf(type) === -1) throw `type must in ${typeMap}`
    return obj => toString.call(obj) == `[object ${type}]`
  }
}

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
   * 克隆一个普通对象，不适合复杂对象
   * @param {*} obj
   */
  clone(obj) {
    try {
      return JSON.parse(
        JSON.stringify(a, (key, value) => {
          if (typeof value === 'function') {
            return value.toString()
          }
          return value
        })
      )
    } catch (e) {
      return a
    }
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
    if (eventType === 'http') return this.clone(ctx)
    const res = config.mock.testModel[eventType]
    if (!res)
      throw ReferenceError(
        '该事件测试模版没有进行过预定义，请先编写测试事件模版'
      )
    return res
  },
  empty: {
    function: () => {}
  },
  /**
   * 复制一个对象的所有属性，返回新对象
   * @param {*} sourceObj
   */
  clone(sourceObj) {
    let destObj = {}
    for (let prop in sourceObj) {
      destObj[prop] = sourceObj[prop]
    }
    return destObj
  },

  isObject: mixin.isType('Object'),
  isArray: mixin.isType('Array'),
  isFunction: mixin.isType('Function'),
  isNull: mixin.isType('Null')
}
