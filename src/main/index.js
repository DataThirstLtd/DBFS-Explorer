const path = require('path')
const { platform } = require('os')
const { app, BrowserWindow, ipcMain } = require('electron')

const isDev = process.env.NODE_ENV === 'development'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
const winConfig = {
  ready: false,
  windows: {
    splash: null,
    main: null
  },
  webPreferences: {
    nodeIntegration: true,
    webSecurity: false
  },
  colours: {
    dark: '#000000',
    light: '#ffffff'
  }
}

function getUrl (pageName, folderName) {
  if (isDev) {
    return `${process.env.DEV_SERVER_URL}?page=${folderName ? `${folderName}/${pageName}` : pageName}`
  } else {
    // eslint-disable-next-line max-len
    return `file://${path.join(__dirname, '..', 'renderer', 'index.html')}?page=${folderName ? `${folderName}/${pageName}` : pageName}`
  }
}

function startSplashWindow () {
  winConfig.windows.splash = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false,
    frame: false,
    show: false,
    backgroundColor: winConfig.colours.dark,
    webPreferences: Object.assign({}, winConfig.webPreferences)
  })

  // and load the index.html of the app.
  if (isDev) {
    winConfig.windows.splash.loadURL(getUrl('splash'))
    // Open the DevTools.
    // winConfig.windows.splash.webContents.openDevTools()
  } else {
    winConfig.windows.splash.loadURL(getUrl('splash'))
  }

  winConfig.windows.splash.setMenu(null)

  winConfig.windows.splash.once('ready-to-show', () => {
    winConfig.windows.splash.show()
    setTimeout(() => {
      startMainWindow()
      winConfig.windows.splash.close()
    }, 2000)
  })

  // winConfig.windows.splash.webContents.openDevTools()

  winConfig.windows.splash.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    winConfig.windows.splash = null
  })
}

function startMainWindow () {
  // Create the browser window.
  winConfig.windows.main = new BrowserWindow({
    width: 800,
    minWidth: 800,
    height: 600,
    minHeight: 600,
    frame: platform() !== 'win32',
    titleBarStyle: 'hidden',
    show: false,
    backgroundColor: winConfig.colours.dark,
    webPreferences: Object.assign({}, winConfig.webPreferences)
  })

  if (isDev) {
    winConfig.windows.main.loadURL(getUrl('sign-in'))
    // Open the DevTools.
    // winConfig.windows.main.webContents.openDevTools()
  } else {
    winConfig.windows.main.loadURL(getUrl('sign-in'))
  }

  winConfig.windows.main.setMenu(null)

  winConfig.windows.main.once('ready-to-show', () => {
    winConfig.windows.main.show()
  })

  // Emitted when the window is closed.
  winConfig.windows.main.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    winConfig.windows.main = null
  })
}

function startWindow () {
  if (!winConfig.ready) {
    // Start splash window
    winConfig.ready = true
    startSplashWindow()
  } else {
    // Start app main window
    startMainWindow()
  }
}

ipcMain.on('start-window', name => {
  console.log(name)
})

ipcMain.on('onRequestDownloadDependencies', () => {
  // TODO: Start dependency downloader
  console.log('calling download')
  /* download(
    {
      url: 'https://hummingbot-distribution.s3.amazonaws.com/hummingbot_v0.19.0.dmg',
      path: path.join(resolver.getPath().exorHummingbot, 'hummingbot.dmg'),
      progress: value => {
        console.log('progress', value)
      }
    }
  ) */
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', startWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    startWindow()()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
