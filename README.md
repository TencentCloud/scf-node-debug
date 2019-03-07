# SCF CLI

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![NPM Version](https://img.shields.io/npm/v/scf-cli.svg?style=flat)](https://www.npmjs.com/package/scf-cli)
[![NODE Version](https://img.shields.io/node/v/scf-cli.svg)](https://www.npmjs.com/package/scf-cli)
[![Travis CI](https://travis-ci.org/TencentCloud/scf-node-debug.svg?branch=master)](https://travis-ci.org/TencentCloud/scf-node-debug.svg?branch=master)

这是一个用于本地测试运行云函数的小工具，我们提供了几种测试模型作为云函数的入参'event'，持续更新中。
本工具需要 node8.1.4 以上版本以支持 ES2015，async function 和 koa。

[English DOC](https://github.com/Lighting-Jack/scf-node-debug/blob/master/README_en.md)
[中文版文档](https://github.com/Lighting-Jack/scf-node-debug/blob/master/README.md)

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

## 常见问题

- [如何设置本地 web 代理？](https://github.com/TencentCloud/scf-node-debug/wiki/%E5%A6%82%E4%BD%95%E8%AE%BE%E7%BD%AE%E6%9C%AC%E5%9C%B0web%E4%BB%A3%E7%90%86%EF%BC%9F)
- 本地云函数的环境变量如何设置？（云函数在运行时，已经拥有了命令行启动所在进程空间的所有环境变量。）
- [如何调试云函数的运行？](https://github.com/TencentCloud/scf-node-debug/wiki/%E5%A6%82%E4%BD%95%E8%B0%83%E8%AF%95%E4%BA%91%E5%87%BD%E6%95%B0%E7%9A%84%E8%BF%90%E8%A1%8C%EF%BC%9F)

## TODO List

- 本地更新、部署、管理云函数
- 本地启用 docker 来测试云函数，让本地测试和云上运行保持更高的一致性

## Licence

MIT
