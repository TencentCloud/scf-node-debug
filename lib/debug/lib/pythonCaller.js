const { spawn } = require('child_process')
const path = require('path')
const { tmpFile, endOfFile, responseFile } = require('../helper/utils')
const fs = require('fs')

module.exports = env => {
  const { entry, handler, event } = env

  const basefile = path.basename(entry, '.py')
  const dirname = path.dirname(entry)
  const tmpFileFd = fs.openSync(tmpFile, 'a+')

  const stdinTxt =
    `import sys${endOfFile}` +
    `sys.path.append("${dirname}")${endOfFile}` +
    `import ${basefile}${endOfFile}` +
    `res=${basefile}.${handler}({"abc":"13"})${endOfFile}` +
    `f = open("${responseFile}","a+")${endOfFile}` +
    `f.write(res)${endOfFile}` +
    `f.close()${endOfFile}`
  fs.writeFileSync(tmpFileFd, stdinTxt)

  const cp = spawn('python', {
    env,
    stdio: [fs.openSync(tmpFile, 'a+')]
  })
  return cp
}
