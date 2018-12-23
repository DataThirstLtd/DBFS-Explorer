export default {
  readFullTable: function (data, callback) {
    const context = this
    context.db.serialize(function () {
      context.db.all(
        `SELECT * FROM ${data.table}`,
        function (error, rows) {
          if (error) {
            callback(error)
          } else {
            callback(null, rows)
          }
        }
      )
    })
  },
  readTableByID: function (data, callback) {
    const context = this
    context.db.serialize(function () {
      context.db.all(
        `SELECT row FROM ${data.table} WHERE id=${data.id}`,
        function (error, row) {
          if (error) {
            callback(error)
          } else {
            callback(null, row)
          }
        }
      )
    })
  },
  writeTable: function (data, callback) {
    console.log(data)
    const values = data.values.replace(/ /g, '').split(',')
    const context = this
    context.db.serialize(function () {
      context.db.all(
        `SELECT * FROM ${data.table} WHERE key=${values[0]}`,
        function (error, rows) {
          if (error) {
            callback(error)
          } else {
            if (rows.length > 0) {
              context.db.run(
                `UPDATE ${data.table} SET value=${values[1]} WHERE key=${values[0]}`,
                function (err) {
                  if (err) {
                    console.log(err)
                  } else {
                    console.log('updated')
                  }
                }
              )
            } else {
              context.db.run(
                `INSERT INTO ${data.table}(${data.keys}) VALUES(${data.values})`,
                function (err) {
                  if (err) {
                    console.log(err)
                  } else {
                    console.log('updated')
                  }
                }
              )
            }
          }
        }
      )
    })
  },
  updateTableByID: function (data, callback) {
    const context = this
    context.db.serialize(function () {
      context.db.run(
        `UPDATE INTO ${data.table} SET ${data.assignments}`,
        function (error) {
          if (error) {
            callback(error)
          } else {
            callback(null)
          }
        }
      )
    })
  },
  deleteTableById: function (data, callback) {
    const context = this
    context.db.serialize(function () {
      context.db.run(
        `DELETE FROM ${data.table} WHERE ${data.condition}`,
        function (error) {
          if (error) {
            callback(error)
          } else {
            callback(null)
          }
        }
      )
    })
  }
}
