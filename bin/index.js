#!/usr/bin/env node

// external depend
const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const _ = require('lodash')
const path = require('path')

// internal depend
const pkgJson = require('../package.json')
const config = require('../lib/debug/config/config.development')
const logo = require('../lib/debug/widget/slogan')
const testCli = require('../lib/debug/bootstrap')
const logger = require('../lib/debug/lib/logger')

// scf配置
const DEFAULT_SCF_CONFIG = config.scfConfig
// 全局配置
const DEFAULT_GLOBAL_CONFIG = {
  host: config.host,
  port: config.port,
  mock: config.mock
}
const testModelMap = Object.keys(DEFAULT_GLOBAL_CONFIG.mock.testModel)

// 辅助信息
program
  .version(pkgJson.version)
  .description(`${pkgJson.description}\n${logo}`)
  .usage('init|i [options]')

// 初始化调试工具
program
  .command('init [host][port][debug]')
  .alias('i')
  .description('Init The TestCli For Your App')
  .option('-h, --host [host]', 'Input the host To Start The Mock Server')
  .option('-p, --port [port]', 'Input the port To Start The Mock Server')
  .option('-d, --debug [debug]', 'Start Supervisor')
  .action(function(env, options) {
    /**************************************************
                		start of interactive
    ***************************************************/
    let promps = []
    // entry
    promps.push({
      type: 'input',
      name: 'entry',
      message: '请输入入口文件地址(相对路径)',
      validate: function(input) {
        const scriptPath = require.resolve(path.resolve(process.cwd(), input))
        if (!input) {
          return '请输入入口文件地址'
        }
        return true
      }
    })
    // handler
    promps.push({
      type: 'input',
      name: 'handler',
      default: DEFAULT_SCF_CONFIG.handler,
      message: '请输入入口执行方法名称',
      validate: function(input) {
        return true
      }
    })
    // timeout
    promps.push({
      type: 'input',
      name: 'timeout',
      default: DEFAULT_SCF_CONFIG.timeout,
      message: '请输入超时时间限制(单位：s)',
      validate: function(input) {
        if (+input <= 30 && +input >= 1) {
          return true
        }
        return '请输入1-30s的数字'
      }
    })
    // testModel
    promps.push({
      type: 'list',
      name: 'testModel',
      choices: testModelMap.map((item, index) => {
        return {
          name: item,
          value: item,
          checked: index === 0
        }
      }),
      message: '请选择测试模版',
      validate: function(input) {
        return true
      }
    })
    /**************************************************
                		end of interactive
    ***************************************************/

    inquirer.prompt(promps).then(answers => {
      const commandConfig = {
        host: options.host || DEFAULT_GLOBAL_CONFIG.host,
        port: options.port || DEFAULT_GLOBAL_CONFIG.port,
        debug: options.debug,
        scfConfig: answers
      }
      testCli.init(commandConfig, data => {
        logger.info(
          `Server has listened [IP]:${commandConfig.host} [PORT]:${
            commandConfig.port
          }. http://${commandConfig.host}:${commandConfig.port}`
        )
      })
    })
  })

// no command
if (!process.argv.slice(2).length) {
  program.outputHelp(txt => {
    return txt
  })
}

// error on unknown commands
program.on('command:*', function() {
  console.warn(
    'Invalid command: %s\nSee --help for a list of available commands.',
    program.args.join(' ')
  )

  program.outputHelp(txt => {
    return txt
  })
})

program.parse(process.argv)
