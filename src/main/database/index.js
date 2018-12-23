'use strict'
import sql from './sql'
import helper from './helper'
import commands from './commands'

const NodeSqlite3 = function (props) {
  this.config = props
  this.db = null
}

NodeSqlite3.prototype.init = function (callback) {
  const context = this
  helper.ensureDatabaseDir(this.config)
  sql.ensureDb(context.config, function (err, db) {
    if (err) {
      console.log(err)
    } else {
      context.db = db
      context.db.serialize(() => {
        context.db.run(
          `CREATE TABLE if not exists user(
            key TEXT,
            value TEXT
          )`
        )
      })
    }
  })
}

NodeSqlite3.prototype.readFullTable = commands.readFullTable
NodeSqlite3.prototype.readTableEntryID = commands.readTableByID
NodeSqlite3.prototype.writeTable = commands.writeTable
NodeSqlite3.prototype.updateTableByID = commands.updateTableByID
NodeSqlite3.prototype.deleteTableById = commands.deleteTableById

export default NodeSqlite3
