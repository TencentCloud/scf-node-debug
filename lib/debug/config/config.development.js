module.exports = {
  host: 'localhost',
  port: 3000, // 启动端口
  debug: true, // 命令行是否为后台运行
  scfConfig: { // 云函数配置
    entry: './demo.js', // 入口文件
    handler: 'main_handler', // 执行方法
    timeout: 3, // 超时时间
    memorySize: 256, // 执行内存
    testModel: ['cmq'] // http|apigateway|helloworld|cmq|ckafka
  },
  mock: {
    // 建议跟控制台保持一致
    testModel: {
      'http': null, // 默认为ctx
      'apigateway': {
        "requestContext": {
          "serviceName": "testsvc",
          "path": "/test/{path}",
          "httpMethod": "POST",
          "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
          "identity": {
            "secretId": "abdcdxxxxxxxsdfs"
          },
          "sourceIp": "10.0.2.14",
          "stage": "prod"
        },
        "headers": {
          "Accept-Language": "en-US,en,cn",
          "Accept": "text/html,application/xml,application/json",
          "Host": "service-3ei3tii4-251000691.ap-guangzhou.apigateway.myqloud.com",
          "User-Agent": "User Agent String"
        },
        "body": "{\"test\":\"body\"}",
        "pathParameters": {
          "path": "value"
        },
        "queryStringParameters": {
          "foo": "bar"
        },
        "headerParameters": {
          "Refer": "10.0.2.14"
        },
        "stageVariables": {
          "stage": "test"
        },
        "path": "/test/value?foo=bar",
        "httpMethod": "POST"
      },
      'helloworld': {
        "key1": "test value 1",
        "key2": "test value 2"
      },
      'cmq': {
        "Records": [
          {
            "CMQ": {
              "type": "topic",
              "topicOwner": '120xxxxx',
              "topicName": "testtopic",
              "subscriptionName": "xxxxxx",
              "publishTime": "1970-01-01T00:00:00.000Z",
              "msgId": "123345346",
              "requestId": "123345346",
              "msgBody": "Hello from CMQ!",
              "msgTag": ["tag1", "tag2"]
            }
          }
        ]
      },
      'ckafka': {
        "Records": [
          {
            "Ckafka": {
              "topic": "test-topic", // 消息topic
              "partition": "",   // 来源partition
              "offset": 123456,  // 本消息offset
              "msgKey": "asdfwasdfw",   // 本消息key， 可选，如无key可以无此项或为None
              "msgBody": "Hello from CMQ!" // 消息内容
            }
          }
        ]
      },

    }
  }
}
