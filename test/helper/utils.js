// 偏函数
const _isType = function(type) {
  const typeMap = [
    'Number',
    'String',
    'Function',
    'Object',
    'Null',
    'Undefined',
    'Symbol',
    'Array'
  ]
  if (typeMap.indexOf(type) === -1) throw `传入类型不正确，可选${typeMap}`
  return obj => {
    return toString.call(obj) === `[object ${type}]`
  }
}

module.exports = {
  isObject: _isType('Object'),
  /**
   * 从对象中拉取对应的属性值
   * @param {*} object
   */
  getEntityByObject(object) {
    let selectedItem = ''
    let resObj = {}

    function _generate() {
      for (let key in object) {
        if (object.hasOwnProperty(key)) {
          resObj[key] = object[key][selectedItem]
        }
      }
      return resObj
    }

    function _value(key) {
      selectedItem = key
      return _generate()
    }

    return { value: _value }
  },

  /**
   * 对比输入的数据和输出的数据，看是否符合预期；输入为空则使用默认值，输入不为空则使用输入值
   * @param {*} defaultData
   * @param {*} stdinData
   * @param {*} answers
   */
  validate(defaultData, stdinData, answers) {
    let isValid = 1
    for (let item in stdinData) {
      // 输入不为空
      if (stdinData[item]) {
        // 是否与输出一致
        if (!stdinData[item] === answers[item]) {
          isValid = !1
          break
        }
      }
      // 输入为空
      else {
        // 是否与默认值一致
        if (!answers[item] === defaultData[item]) {
          isValid = !1
          break
        }
      }
    }
    return isValid
  }
}
