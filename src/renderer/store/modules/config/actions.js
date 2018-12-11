import { ipcRenderer } from 'electron'
import { platform } from 'os'

// const uid = require('uniqid')
function registerForSqlReady (context) {
  ipcRenderer.on('sql_ready', function (event, data) {
    if (data.error) {
      console.log(data.error)
    } else {
      if (data.commit) {
        context.commit(data.commit, data.data)
      }
    }
  })
}

export default {
  init: function (context) {
    // Set current running platform
    context.commit('setPlatform', platform())
    registerForSqlReady(context)
    ipcRenderer.send('sql', {
      commit: 'setUser',
      name: 'readFullTable',
      data: {
        table: 'user'
      }
    })
  },
  writeSql: function (context, data) {
    ipcRenderer.send('sql', {
      commit: null,
      name: 'writeTable',
      data: data
    })
  },
  showInfoSnackbar: function (context, data) {
    context.commit('setInfoSnackbar', data)
  },
  authState: function (context, status) {
    context.commit('setAuthState', status)
  }
}
