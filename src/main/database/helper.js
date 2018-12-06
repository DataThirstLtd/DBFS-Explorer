
const fsExtra = require('fs-extra')
// const path = require('path')

export default {
  ensureDatabaseDir: function (config) {
    fsExtra.ensureDirSync(config.path)
  }
}
