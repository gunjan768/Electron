// Modules
const electron = require('electron');
const {app, BrowserWindow, Tray, Menu} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, tray

let trayMenu = Menu.buildFromTemplate([
  { label: 'Item 1' },
  { role: 'quit' }
])

function createTray () {

  // Template is the suffix part which you can add to make the icon template one. Template icon means the icon will be automatically
  // filled wiht the color of the OS.
  tray = new Tray('trayTemplate@2x.png')
  tray.setToolTip('Tray details')

  // There are two ways to use tray: 1) listen to 'click' event   2) Add menu to tray
  tray.on('click', e => {
    if (e.shiftKey) {
      app.quit()
    } else {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    }
  })

  tray.setContextMenu(trayMenu)
}

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  createTray()

  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html')

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })

  // *********************************************** Power Monitor ********************************************************

  // The "powerMonitor" module allows an Electron app to react to changes in the machine's state, but does not allow us to 
  // affect such a state. This can be particularly useful in making sure app data is always persisted, knowing when resource 
  // intensive processes can be prioritised or refreshing an app after a prolonged state of inactivity.
  electron.powerMonitor.on('resume', e => {
    // Only works in Mac
    if(!mainWindow) createWindow()
  })

  electron.powerMonitor.on('suspend', e => {
    console.log('Saving some data')
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
