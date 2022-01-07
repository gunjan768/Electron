// Modules
const {app, BrowserWindow, ipcMain} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1000, height: 800, x: 100, y: 140,
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

  // An IPC message sent to a Renderer Process is received on that process's "webContents", therefore the web contents
  // itself must be fully loaded (did-finish-load) to ensure that the message will be received. In order to send a message
  // directly to a Renderer Process from the Main Process, we can do so on that Renderer's webContents.
  mainWindow.webContents.on('did-finish-load', e => {
    // Sending message from MainProcess to all the renderer process who is listening to this event (mailbox ).
    mainWindow.webContents.send('mailbox', {
      from: 'Ray',
      email: 'ray@stackacademy.tv',
      priority: 1
    })
  })

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

ipcMain.on('sync-message', (e, args) => {
  console.log(args)

  setTimeout( () => {
    e.returnValue = 'A sync response from the main process'
  }, 4000)

})

ipcMain.on('channel1', (event, args) => {
  console.log(args)

  // event.sender being the web content instance of the sending browser window. We can have more than one renderer process
  // (i.e. browser window) so to know from which sender the message came, we use event.sender.
  event.sender.send('channel1-response', 'Message received on "channel1". Thank you!')
})

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