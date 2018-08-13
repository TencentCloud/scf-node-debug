# SCF CLI

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![NPM Version](https://img.shields.io/npm/v/scf-cli.svg?style=flat)](https://www.npmjs.com/package/scf-cli)
[![NODE Version](https://img.shields.io/node/v/scf-cli.svg)](https://www.npmjs.com/package/scf-cli)

A cli For Test Your ServerLess Function
We provide serveral testModels for you to config the 'event' of Your ServerLess Function
And more properties is coming!
This cli requires node v8.1.4 or higher for ES2015 , async function support and koa.

[English DOC](./README_en.md)
[中文版文档](./README.md)

## Installation

```
npm install scf-cli -g
```

## Quick Start

```
scf init
```

### Options

- host The host To Start The Mock Server
- port The port To Start The Mock Server
- debug Start Supervisor.If set 'debug' to true, you would get the debug message of the MockServer from the bash.Or the MockServer would run as a backend process

### Command Line

- init Init The TestCli For Your App

### Configurations

- entry The entry of Your ServerLess Function File
- handler The handler of Your ServerLess Function File
- timeout Set the timeout For Your ServerLess Function. To control the execution time
- testModel To choose a testModel as the 'event' For Your ServerLess Function
  - http
  - apigateway
  - helloworld
  - cmq
  - ckafka

## TODO List

- Update Your ServerLess Function Localy
- Test Your ServerLess Function Localy in docker

## Licence

MIT
