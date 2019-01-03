const testModelMap = ['http', 'cmq', 'ckafka', 'apigateway', 'helloworld']
const data = {
  entry: {
    defaultData: '',
    stdinData: './correctDemo.js'
  },
  handler: {
    defaultData: 'main_handler',
    stdinData: 'main'
  },
  timeout: {
    defaultData: 3,
    stdinData: 5
  },
  testModel: {
    defaultData: testModelMap[0],
    stdinData: ''
  }
}
const promps = [
  {
    type: 'input',
    name: 'entry',
    message: '请输入入口文件地址(相对路径)',
    validate: function(input) {
      if (!input) {
        return '请输入入口文件地址'
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'handler',
    default: 'main_hanlder',
    message: '请输入入口执行方法名称',
    validate: function(input) {
      return true
    }
  },
  {
    type: 'input',
    name: 'timeout',
    default: 3,
    message: '请输入超时时间限制(单位：s)',
    validate: function(input) {
      if (+input <= 30 && +input >= 1) {
        return true
      }
      return '请输入1-30s的数字'
    }
  },
  {
    type: 'list',
    name: 'testModel',
    choices: testModelMap,
    message: '请选择测试模版',
    validate: function(input) {
      return true
    }
  }
]

module.exports = {
  testModelMap, // 测试模型
  data, // 测试数据，包括默认数据和命令行输入数据
  promps // 交互式命令行
}
