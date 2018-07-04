# SCF CLI

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![NPM Version](https://img.shields.io/npm/v/scf-cli.svg?style=flat)](https://www.npmjs.com/package/scf-cli)

这是一个用于本地测试运行云函数的小工具，我们提供了几种测试模型作为云函数的入参'event'，持续更新中。

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

- host 用于开启本地服务的 host
- port 用于开启本地服务的 port
- debug 开启调试模式。一旦开启，你将在 bash 控制台看到关于云函数运行的详情，比如错误信息、错误码、返回内容

### Command Line

- init 初始化调试工具，包括入参、测试模型等

### Configurations

- entry 云函数的入口文件
- handler 云函数入口文件的执行方法，调试工具内部会选择该执行方法作为
- timeout 云函数的超时时间，用于控制函数执行时间
- testModel 选择云函数的入参'event'的模式
  - http 和公有云函数标准一致
  - apigateway 以 apigateway 的模式模拟入参
  - helloworld 入参为最简单的 json 格式
  - cmq 以 cmq 的模式模拟入参
  - ckafka 以 ckafka 的模式模拟入参

## TODO List

- 本地更新、部署、管理云函数
- 本地启用 docker 来测试云函数，让本地测试和云上运行保持更高的一致性

## Licence

MIT
