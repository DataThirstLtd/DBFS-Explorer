import { ipcRenderer } from 'electron'
import { platform } from 'os'
import appConfig from '@/app.config.js'

const uniqid = require('uniqid')

function registerForSqlReady (context) {
  ipcRenderer.on('sql_ready', function (event, data) {
    if (data.error) {
      console.log(data.error)
    } else {
      if (data.commit) {
        context.commit(data.commit, data.data)
        data.commit === 'setSettings' && context.dispatch('applySettings', data.data)
      }
    }
  })
}

export default {
  init: function (context) {
    console.log('init')
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
  fetchSettings: function (context) {
    ipcRenderer.send('sql', {
      commit: 'setSettings',
      name: 'readFullTable',
      data: {
        table: 'settings'
      }
    })
  },
  applySettings: function (context, data) {
    console.log('applySettings', data)
    if (data && data.constructor === [].constructor) {
      if (data.length > 0) {
        // Apply settings from data
        data.forEach((dataSetting) => {
          context.dispatch('updateSettings', dataSetting)
        })
      } else {
        console.log('apply default settings')
        // Apply default settings
        appConfig.defaultSettings.forEach((defaultSetting) => {
          context.dispatch('updateSettings', defaultSetting)
        })
      }
    }
  },
  writeSql: function (context, data) {
    ipcRenderer.send('sql', {
      commit: null,
      name: 'writeTable',
      data: data
    })
  },
  updateSettings: function (context, { key, value }) {
    if (key) {
      context.dispatch('writeSql', {
        table: 'settings',
        keys: 'key, value',
        values: `"${key}", "${value || 'EMPTY'}"`
      })
      context.commit('setSettingsEntry', { key, value })
    }
  },
  getSetting: function (context, { key }) {
    return new Promise((resolve, reject) => {
      const settings = context.getters.getSettings
      if (settings && settings.constructor === [].constructor) {
        if (settings.length > 0) {
          const index = settings.findIndex(
            x => x.key === key
          )
          if (index > -1) {
            resolve({
              value: parseInt(settings[index].value)
            })
          } else {
            reject(new Error(`Setting with key: ${key} not found.`))
          }
        } else {
          // Settings not found in the database
          // Create new settings from app.config.js
          const settings = Object.assign([], appConfig.defaultSettings)
          settings.forEach((item) => {
            if (item && item.constructor === {}.constructor) {
              item.key && context.dispatch('updateSettings', item)
            }
          })
        }
      }
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
        listObject.push(Object.assign({ file: file, transferId: uniqid(), selected: true }))
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
  waitListJob: function (context, data) {
    context.commit('setWaitListJob', data)
  },
  startListJob: function (context, data) {
    context.commit('setStartWaitListJob', data)
  },
  doneTransfer: function (context, data) {
    context.commit('setDoneTransfer', data)
    context.dispatch('fetchSelection', {
      path: context.getters.getCurrentPath,
      is_dir: true
    })
  },
  abortTransfer: function (context, data) {
    context.commit('setAbortTransfer', data)
  },
  updateJobProgress: function (context, data) {
    context.commit('setJobProgress', data)
  }
}
