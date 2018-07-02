# SCF CLI
A cli For Test Your ServerLess Function
We provide serveral testModels for you to config the 'event' of Your ServerLess Function
And more properties is coming!

## Installation
```
npm install @tencent/SCF_CLI -g
```

## Quick Start
```
tcb init
```
### Options
* host The host To Start The Mock Server
* port The port To Start The Mock Server
* debug Start Supervisor.If set 'debug' to true, you would get the debug message of the MockServer from the bash.Or the MockServer would run as a backend process

### Command Line
* init Init The TestCli For Your App

### Configurations
* entry The entry of Your ServerLess Function File
* handler The handler of Your ServerLess Function File
* timeout Set the timeout For Your ServerLess Function. To control the execution time
* testModel To choose a testModel as the 'event' For Your ServerLess Function
    * http
    * apigateway
    * helloworld
    * cmq
    * ckafka

## TODO List
* Update Your ServerLess Function Localy
* Test Your ServerLess Function Localy in docker

## Licence
MIT
