'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import Sqlite3 from './database'

const os = require('os')
const path = require('path')

const db = new Sqlite3({
  path: path.join(
    os.homedir(),
    'DBFS-Explorer'
  ),
  name: 'app'
})

db.init()

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 750,
    width: 1200,
    minHeight: 600,
    minWidth: 800,
    useContentSize: true,
    backgroundColor: '#FFFFFF',
    titleBarStyle: 'hiddenInset',
    show: false,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('sql', function (event, config) {
  if (config && config.constructor === {}.constructor &&
      'name' in config && 'data' in config &&
      'commit' in config) {
    switch (config.name) {
      case 'readFullTable':
        db.readFullTable(config.data, function (error, data) {
          replaySender(event.sender, config.commit, error, data)
        })
        break
      case 'readTableEntryID':
        db.readTableEntryID(config.data, function (error, data) {
          replaySender(event.sender, config.commit, error, data)
        })
        break
      case 'writeTable':
        db.writeTable(config.data, function () {})
        break
      case 'UpdateTableByID':
        db.updateTableByID(config.data, function (error, data) {
          replaySender(event.sender, config.commit, error, data)
        })
        break
      case 'DeleteTableById':
        db.deleteTableById(config.data, function (error, data) {
          replaySender(event.sender, config.commit, error, data)
        })
        break
      default: break
    }
  }
})

function replaySender (sender, commit, error, data) {
  sender.send('sql_ready', {
    commit: commit,
    error: error,
    data: data
  })
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
