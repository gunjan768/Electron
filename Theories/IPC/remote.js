// Modules
const {app, BrowserWindow} = require('electron')
require('@electron/remote/main').initialize()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// The remote is a collection of IPC convenience methods that mimics the main process modules, allowing us to access
// them directly from a renderer process. Drawbacks of this: Exposes the main process to users which is a security threat,
// also comes with a significant performance penality. So by default, electron disabled  it.

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true,

      // By default, electron disabled the remote module.
      enableRemoteModule: true,
    }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html')
  require("@electron/remote/main").enable(mainWindow.webContents);
  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
