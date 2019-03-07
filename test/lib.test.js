'use strict'

const assert = require('assert')
const request = require('supertest')
const lib = require('../lib/debug/bootstrap')
const config = require('../lib/debug/config/config.development')
const logger = require('../lib/debug/lib/logger')

logger.setLevel(-1)
logger.setPrefix('[TEST]')

describe('scf lib', () => {
  const correctDemo = lib.init({
    port: 8082,
    scfConfig: {
      entry: 'test/mock/correctDemo.js',
      handler: 'main_handler',
      timeout: config.scfConfig.timeout,
      testModel: 'http'
    }
  })
  const errorDemo = lib.init({
    port: 8083,
    scfConfig: {
      entry: 'test/mock/errorDemo.js',
      handler: 'main_handler',
      timeout: config.scfConfig.timeout,
      testModel: 'cmq'
    }
  })
  const timeoutDemo = lib.init({
    port: 8084,
    scfConfig: {
      entry: 'test/mock/timeoutDemo.js',
      handler: 'main_handler',
      timeout: config.scfConfig.timeout,
      testModel: 'cmq'
    }
  })
  const asyncCorrectDemo = lib.init({
    port: 8085,
    scfConfig: {
      entry: 'test/mock/asyncCorrectDemo.js',
      handler: 'main_handler',
      timeout: config.scfConfig.timeout,
      testModel: 'http'
    }
  })

  const asyncErrorDemo = lib.init({
    port: 8086,
    scfConfig: {
      entry: 'test/mock/asyncErrorDemo.js',
      handler: 'main_handler',
      timeout: config.scfConfig.timeout,
      testModel: 'http'
    }
  })

  describe('#test sync correct demo', () => {
    it('#test GET /', done => {
      let res = request(correctDemo)
        .get('/')
        .expect(res => {
          assert.equal(res.text, 'sync-correct', 'sync correct demo')
        })
        .end(done)
    }).timeout(config.scfConfig.timeout * 1000)
  })

  describe('#test sync error demo', () => {
    it('#test GET /', done => {
      let res = request(errorDemo)
        .get('/')
        .expect(res => {
          assert.equal(res.body.data, undefined)
        })
        .end(done)
    }).timeout(config.scfConfig.timeout * 1000)
  })

  describe('#test timeout demo', () => {
    it('#test GET /', done => {
      let res = request(timeoutDemo)
        .get('/')
        .expect(404)
        .end(done)
    }).timeout(config.scfConfig.timeout * 1000 * 2)
  })

  describe('#test async correct demo', () => {
    it('#test GET /', done => {
      let res = request(asyncCorrectDemo)
        .get('/')
        .expect(res => {
          assert.equal(res.text, 'async-correct')
        })
        .end(done)
    }).timeout(config.scfConfig.timeout * 1000 * 2)
  })

  describe('#test async error demo', () => {
    it('#test GET /', done => {
      let res = request(asyncErrorDemo)
        .get('/')
        .expect(res => {
          assert.equal(res.body.data, undefined)
        })
        .end(done)
    }).timeout(config.scfConfig.timeout * 1000 * 2)
  })

  after(done => {
    done()
    process.exit(0)
  })
})
