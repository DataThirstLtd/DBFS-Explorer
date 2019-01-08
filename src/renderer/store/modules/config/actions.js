import { ipcRenderer } from 'electron'
import { platform } from 'os'

const uniqid = require('uniqid')

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
  },
  openDialog: function (context, { name, options }) {
    context.commit('setActiveDialog', { name, options })
  },
  toggleDialog: function (context, { name, options }) {
    const dialogs = context.getters.getDialogs
    const active = dialogs && dialogs[`${name}`] && dialogs[`${name}`].active
    if (active) {
      context.commit('setInertDialog', { name })
    } else {
      context.commit('setActiveDialog', { name, options })
    }
  },
  closeDialog: function (context, { name }) {
    context.commit('setInertDialog', { name })
  },
  showDrag: function (context, ev) {
    context.commit('setDragActive')
  },
  hideDrag: function (context) {
    context.commit('setDragInert')
  },
  dropFile: function (context, event) {
    const currentPath = context.getters.getCurrentPath
    const files = Object.assign([], event.dataTransfer.files)
    context.dispatch('hideDrag')
    if (files.length > 0) {
      const listObject = []
      files.forEach((file) => {
        listObject.push(Object.assign({ file: file, id: uniqid(), selected: true }))
      })
      context.dispatch('openDialog', {
        name: 'dataTransfer',
        options: {
          list: listObject,
          type: 1,
          toPath: currentPath || '/'
        }
      })
    }
  },
  toggleListDataTransfer: function (context, { id }) {
    if (id) {
      const list = context.getters.getListDataTransfer
      const targetIndex = list.findIndex(x => x.id === id)
      if (targetIndex > -1) {
        if (list[targetIndex].selected) {
          context.commit('setInertDataTransferItem', { index: targetIndex })
        } else {
          context.commit('setActiveDataTransferItem', { index: targetIndex })
        }
      }
    }
  },
  updateDataTransferList: function (context, data) {
    context.commit('setDataTransferList', data)
  },
  doneTransfer: function (context, data) {
    context.commit('setDoneTransfer', data)
  },
  updateJobProgress: function (context, data) {
    context.commit('setJobProgress', data)
  }
}
