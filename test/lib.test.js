'use strict'

const assert = require('assert')
const request = require('supertest')
const lib = require('../lib/debug/bootstrap')
const config = require('../lib/debug/config/config.development')

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

  describe('#test correct demo', () => {
    it('#test GET /', done => {
      let res = request(correctDemo)
        .get('/')
        .expect('Content-Type', /text\/plain/)
        .end(done)
    }).timeout(config.scfConfig.timeout * 1000)
  })

  describe('#test error demo', () => {
    it('#test GET /', done => {
      let res = request(errorDemo)
        .get('/')
        .expect('Content-Type', /text\/plain/)
        .end(done)
    }).timeout(config.scfConfig.timeout * 1000)
  })

  describe('#test timeout demo', () => {
    it('#test GET /', done => {
      let res = request(timeoutDemo)
        .get('/')
        .expect('Content-Type', /text\/plain/)
        .end(done)
    }).timeout(config.scfConfig.timeout * 1000 * 2)
  })

  after(done => {
    done()
    process.exit(0)
  })
})
