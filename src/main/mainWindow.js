import path from 'path'
import BrowserWinHandler from './BrowserWinHandler'
const { nativeTheme } = require('electron')
const isDev = process.env.NODE_ENV === 'development'

const BG_DARK_HEX = '#1E1E1E'
const BG_LIGHT_HEX = '#FFFFFF'
const INDEX_PATH = path.join(__dirname, '..', 'renderer', 'index.html')
const DEV_SERVER_URL = process.env.DEV_SERVER_URL // eslint-disable-line prefer-destructuring

function setAppTheme (isDark, win) {
  if (!(win && win.setBackgroundColor)) {
    return
  }

  if (isDark) {
    win.setBackgroundColor(BG_DARK_HEX)
  } else {
    win.setBackgroundColor(BG_LIGHT_HEX)
  }
}

const winHandler = new BrowserWinHandler({
  height: 669,
  width: 1024,
  minHeight: 600,
  minWidth: 800,
  titleBarStyle: 'hidden',
  backgroundColor: nativeTheme.shouldUseDarkColors ? BG_DARK_HEX : BG_LIGHT_HEX
})

nativeTheme.on('updated', function theThemeHasChanged () {
  setAppTheme(nativeTheme.shouldUseDarkColors, winHandler.browserWindow)
})

winHandler.onCreated(browserWindow => {
  if (isDev) browserWindow.loadURL(DEV_SERVER_URL)
  else browserWindow.loadFile(INDEX_PATH)
})

export default winHandler
