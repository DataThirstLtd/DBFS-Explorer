/**
 * SQL database wrapper
 */

'use strict'
import sql from './sql'

/**
 * Sql database wrapper class
 */
const NodeSqlite3 = function (props) {
  this.config = props
  this.db = null
}

/**
 * Initialize SQL database
 * Creates/ensures necessary tables for SQL database
 */
NodeSqlite3.prototype.init = function (callback) {
  const context = this
  sql.ensureDatabaseDir(this.config)
  sql.ensureDb(context.config, function (err, db) {
    if (err) {
      console.log(err)
    } else {
      context.db = db
      context.db.serialize(() => {
        // Create required SQL tables before app renders.
        context.db.run(
          `CREATE TABLE if not exists user(
            key TEXT,
            value TEXT
          )`
        )
        context.db.run(
          `CREATE TABLE if not exists settings(
            key TEXT,
            value TEXT
          )`
        )
      })
    }
  })
}

/**
 * SQL Database commands API
 */
NodeSqlite3.prototype.readFullTable = sql.readFullTable
NodeSqlite3.prototype.readTableEntryID = sql.readTableByID
NodeSqlite3.prototype.writeTable = sql.writeTable
NodeSqlite3.prototype.updateTableByID = sql.updateTableByID
NodeSqlite3.prototype.deleteTableById = sql.deleteTableById

export default NodeSqlite3
