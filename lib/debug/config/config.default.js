module.exports = {
    testModel: {
        'http': null,
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
        }
    }
}