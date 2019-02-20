/**
 * Actions for application User interface configuration.
 */

import { ipcRenderer } from 'electron'
import { platform } from 'os'
import appConfig from '@/app.config.js'

const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, prettyPrint } = format
const fsExtra = require('fs-extra')
const nodePath = require('path')
const uniqid = require('uniqid')
const remote = require('electron').remote

// Timer used for drag and drop banner
let dragOverTimer = null

// Handle for Application logs
let logger = null

/**
 * Called when SQL data is ready
 */
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
  /**
   * Write a log with level (error, info, warning) and message
   */
  writeLog: function (context, { level, message }) {
    if (level && typeof message === 'string') {
      logger.log({ level, message })
    }
  },

  /**
   * Initialization code when when application launched
   */
  init: function (context) {
    // Set current running platform
    context.commit('setPlatform', platform())
    registerForSqlReady(context)
    ipcRenderer.send('sql', {
      commit: 'setCredentialsFromSql',
      name: 'readFullTable',
      data: {
        table: 'user'
      }
    })
    const dateISOString = new Date().toISOString().replace(/:/g, '_')
    const logPath = nodePath.join(
      remote.app.getPath('logs'),
      'dbfs_explorer',
      dateISOString
    )
    fsExtra.ensureDir(logPath)
    logger = createLogger({
      format: combine(
        label({ label: 'DBFS-Explorer' }),
        timestamp(),
        prettyPrint()
      ),
      transports: [
        new transports.File({
          filename: nodePath.join(logPath, 'debug.log'),
          level: 'debug'
        }),
        new transports.File({
          filename: nodePath.join(logPath, 'verbose.log'),
          level: 'verbose'
        }),
        new transports.File({
          filename: nodePath.join(logPath, 'info.log'),
          level: 'info'
        }),
        new transports.File({
          filename: nodePath.join(logPath, 'error.log'),
          level: 'error'
        }),
        new transports.File({
          filename: nodePath.join(logPath, 'combined.log')
        })
      ]
    })
    if (logger) {
      logger.log({
        level: 'info',
        message: 'What time is the testing at?'
      })
      logger.log({
        level: 'info',
        message: 'What time is the testing at?'
      })
    }
  },

  /**
   * Read settings from database
   */
  fetchSettings: function (context) {
    ipcRenderer.send('sql', {
      commit: 'setSettings',
      name: 'readFullTable',
      data: {
        table: 'settings'
      }
    })
  },

  /**
   * Write settings to database
   */
  applySettings: function (context, data) {
    if (data && data.constructor === [].constructor) {
      if (data.length > 0) {
        // Apply settings from data
        data.forEach((dataSetting) => {
          context.dispatch('updateSettings', dataSetting)
        })
      } else {
        // Apply default settings
        appConfig.defaultSettings.forEach((defaultSetting) => {
          context.dispatch('updateSettings', defaultSetting)
        })
      }
    }
  },

  /**
   * Write new entry into SQL database
   */
  writeSql: function (context, data) {
    ipcRenderer.send('sql', {
      commit: null,
      name: 'writeTable',
      data: data
    })
  },

  /**
   * Update existing settings in SQL database
   */
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

  /**
   * Get specified settings from SQL database
   */
  /* getSetting: function (context, { key }) {
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
  }, */

  /**
   * Show snack bar notification
   */
  showInfoSnackbar: function (context, data) {
    context.commit('setInfoSnackbar', data)
  },

  /**
   * Set authentication state of the application
   */
  authState: function (context, status) {
    context.commit('setAuthState', status)
  },

  /**
   * Open a specified dialog with options
   */
  openDialog: function (context, { name, options }) {
    context.commit('setActiveDialog', { name, options })
  },

  /**
   * Toggle a specified dialog (show/hide) based on current state
   */
  toggleDialog: function (context, { name, options }) {
    const dialogs = context.getters.getDialogs
    const active = dialogs && dialogs[`${name}`] && dialogs[`${name}`].active
    if (active) {
      context.commit('setInertDialog', { name })
    } else {
      context.commit('setActiveDialog', { name, options })
    }
  },

  /**
   * Close a specified dialog
   */
  closeDialog: function (context, { name }) {
    context.commit('setInertDialog', { name })
  },

  /**
   * Show drag banner (or) info graphics
   */
  showDrag: function (context, e) {
    e && e.preventDefault()
    if (dragOverTimer) {
      clearInterval(dragOverTimer)
      dragOverTimer = null
    }
    context.commit('setDragActive')
    dragOverTimer = setInterval(() => {
      context.dispatch('hideDrag')
    }, 200)
  },

  /**
   * Hide drag banner (or) info graphics
   */
  hideDrag: function (context, e) {
    e && e.preventDefault()
    context.commit('setDragInert')
  },

  /**
   * Handler when a file dropped using drag and drop on to the application
   */
  dropFile: function (context, event) {
    const pwd = context.getters.getCurrentPath
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
          toPath: pwd
        }
      })
    }
  },

  /**
   * Toggle pre-selection Upload/Download transfer state of recently dropped file
   */
  toggleListDataTransfer: function (context, { transferId }) {
    if (transferId) {
      const list = context.getters.getTransferDataList
      const targetIndex = list.findIndex(x => x.transferId === transferId)
      if (targetIndex > -1) {
        if (list[targetIndex].selected) {
          context.commit('setInertDataTransferItem', { index: targetIndex })
        } else {
          context.commit('setActiveDataTransferItem', { index: targetIndex })
        }
      }
    }
  },

  /**
   * Add a Upload/Download job to the wait queue
   */
  waitListJob: function (context, data) {
    context.commit('setWaitListJob', data)
  },

  /**
   * Start the job queue
   */
  startListJob: function (context, data) {
    context.commit('setStartWaitListJob', data)
  },

  /**
   * Handler for successful data transfer.
   * This will set the job transfer (upload/download) as success.
   */
  doneTransfer: function (context, data) {
    context.commit('setDoneTransfer', data)
    context.dispatch('fetchSelection', {
      path: context.getters.getCurrentPath,
      is_dir: true
    })
  },

  /**
   * Handler for abort data transfer.
   * This will set the job transfer (upload/download) as abort.
   */
  abortTransfer: function (context, data) {
    context.commit('setAbortTransfer', { transferId: data.transferId })
    // context.commit('setAbortTransfer', data)
  },

  /**
   * Clear list with transfer state done or abort
   */
  clearFinished: function (context) {
    const List = Object.assign([], context.getters.getTransferStateList)
    List.forEach((listItem) => {
      if (listItem && (listItem.done || listItem.abort)) {
        context.commit('clearTransferListItem', { transferId: listItem.transferId })
      }
    })
  },

  /**
   * Update a specified job progress
   */
  updateJobProgress: function (context, data) {
    context.commit('setJobProgress', data)
  },

  /**
   * CleanUP:: Configuration data on logout
   */
  clearConfigStates: function (context) {
    context.commit('resetConfigStates')
  }
}
