/**************************************************
            				strin/strout
***************************************************/
// external depend
const path = require('path')
const EOL = require('os').EOL
const CliTest = require('command-line-test')
const assert = require('assert')
const bddStdin = require('bdd-stdin')
const inquirer = require('inquirer')

// internal depend
const binFile = require.resolve('../bin')
const pkg = require('../package')
const cliMock = require('./mock/js/cli.mock')
const { getEntityByObject, validate } = require('./helper/utils')

describe('scf-cli command-line test', function() {
  it('avoid recursive', function() {})
  // --help -h
  it('`scf -h` should be ok', function() {
    var cliTest = new CliTest()
    return cliTest.execFile(binFile, ['-h'], {}).then(res => {
      var lines = res.stdout.trim().split(EOL)
      lines[2].trim().should.be.equal(pkg.description)
    })
  })

  // --version -V
  it('`scf -V` should be ok', function() {
    var cliTest = new CliTest()
    return cliTest.execFile(binFile, ['-V'], {}).then(res => {
      res.stdout.should.containEql(pkg.version)
    })
  })

  // empty argv
  it('`scf` should be ok', function() {
    var cliTest = new CliTest()
    return cliTest.execFile(binFile, [], {}).then(res => {
      var lines = res.stdout.trim().split(EOL)
      lines[2].trim().should.be.equal(pkg.description)
    })
  })

  // wrong argv
  it('`scf wrong` should be ok', function() {
    var cliTest = new CliTest()
    return cliTest.execFile(binFile, ['wrong'], {}).then(res => {
      var lines = res.stdout.trim().split(EOL)
      lines[2].trim().should.be.equal(pkg.description)
    })
  })

  // init - 交互式命令行测试
  it('`scf init` should be ok', function(done) {
    const cliTest = new CliTest()
    let prompts = cliMock.promps

    // 模拟输入入口地址、入口方法、超时时间、测试模版
    const defaultData = getEntityByObject(cliMock.data).value('defaultData')
    let stdinData = getEntityByObject(cliMock.data).value('stdinData')

    // 正确demo
    bddStdin(
      stdinData.entry, // 这里测试时不做存在校验
      '\n',
      stdinData.handler,
      '\n',
      stdinData.timeout.toString(),
      '\n',
      stdinData.testModel,
      '\n'
    )
    inquirer.prompt(prompts).then(answers => {
      let error = null
      const response = answers.choice
      const isValid = validate(defaultData, stdinData, answers)
      console.assert(isValid)
      if (!isValid) error = new Error('校验失败')
      done(error)
    })
  })
})
