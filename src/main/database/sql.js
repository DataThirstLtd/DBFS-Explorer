'use strict'

const sqlite3 = require('sqlite3')
const path = require('path')

export default {
  ensureDb: function (config, callback) {
    const dbFile = path.join(
      config.path,
      config.name && config.name.split('.').length < 2
        ? `${config.name}.db`
        : `${config.name.split('.')[0]}.db`
    )
    const db = new sqlite3.Database(
      dbFile,
      function (err) {
        if (err) {
          callback(err)
        } else {
          callback(null, db)
        }
      }
    )
  }
}
