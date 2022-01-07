// Modules
const {app, BrowserWindow, screen} = require('electron')

// Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript
// object is garbage collected.
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {
  // Whilst Electron's "screen" module can be required immediately, we must wait for the main "app" instance to fire it's 
  // "ready" event before attempting to access any data on this module.
  let displays = screen.getAllDisplays()

  let primaryDisplay = screen.getPrimaryDisplay()

  console.log(`${displays[0].size.width} x ${displays[0].size.height}`)
  console.log(`${displays[0].bounds.x}, ${displays[0].bounds.y}`)
  console.log(`${displays[1].size.width} x ${displays[1].size.height}`)
  console.log(`${displays[1].bounds.x}, ${displays[1].bounds.y}`)
  
  screen.on( 'display-metrics-changed', (e, display, metricsChanged) => {
    console.log(metricsChanged)
  })
  
  // setInterval( () => {
  //   console.log( screen.getCursorScreenPoint() )
  // }, 100)

  mainWindow = new BrowserWindow({
    x: primaryDisplay.bounds.x, y: primaryDisplay.bounds.y,
    width: primaryDisplay.size.width/2, height: primaryDisplay.size.height,
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