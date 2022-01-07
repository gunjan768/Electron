const {app, BrowserWindow, screen} = require('electron')


// It's important to stay aware of the context in which a Renderer Process exists. Being a standard Chromium Web Browser, we can
// - and should - focus on using native HTML5 and JavaScript APIs to perform app logic in this context. This helps keep an app 
// more secure and standardises the implementation of common tasks. That's why the Renderer Process have very few modules compared
// to the Main Process.

// All native system APIs (outside Node.js) are only accessible from the main process. For example, if you want to open a system
// dialog, you can only use the dialog module inside the JavaScript running in the main process and not inside a window 
// (renderer process).

// Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript
// object is garbage collected.
let mainWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow () {
  // This is the rendered process we are creating using BrowserWindow().
  mainWindow = new BrowserWindow({
    width: 1000, height: 800,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12

      // Electron allows us access to the Main process's Node.js environment directly inside of a Renderer Process, however this
      // feature is disabled by default. Node integration essentially opens up access to the user's file system directly from within
      // a Renderer process and is therefore disabled by default. This can be enabled by setting the "nodeIntegration" option to
      // "true" on a BrowserWindow's "webPreferences", but must only ever be done when all content in such a window is 100% secure
      // i.e. loaded and created by the application developer.

      // The reason why Electron doesn’t grant access to Node.js APIs from the renderer processes by default is that malicious 
      // third-party JavaScript code (such as a third-party library) can get access to the user’s system by calling the Node APIs.
      // Therefore you should be careful while using this option.

      // Context Isolation means that preload scripts are isolated from the renderer's main world to avoid leaking any privileged
      // APIs into your web content's code. Instead, use the contextBridge module in preload.js to accomplish this securely.
      contextIsolation: false,
      nodeIntegration: true
    }
  })
  
  // Since BrowserWindow is just a high-level interface for the webContents interface, you can use win.webContents.loadFile()
  // call instead of win.loadFile() to render an HTML page inside a window.
  mainWindow.webContents.loadFile('index.html')
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed',  () => mainWindow = null)

  // WebFrame is where your webContents run. In simple run, it is the whole screen of the window browser.
  // desktopCapturer: Access information about media sources that can be used to capture audio and video from the desktop
  // using the navigator.mediaDevices.getUserMedia API. 
}

// Electron `app` is ready
app.on('ready', createWindow)

// The window-all-closed event is emitted when the last opened window of the application is closed. In the handler of this 
// event, we should quit the application by calling the app.quit() method except when the OS is macOS since it contradicts
// the default behavior of macOS. Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  // The process variable comes from Node.js since main process always has access to Node.js APIs. Therefore process.platform
  // gives the name of the underlying platform (kernel or OS) on which Node.js is running.
  if (process.platform !== 'darwin') app.quit()
})

//he activate event is macOS specific and it is fired when the application icon from the dock is clicked (and other places).
// Since closing all windows in macOS doesn’t close the application (main process), we would need to open a window (if none are
// opened) when the application is activated again. When app icon is clicked, (macOS) recreate the BrowserWindow.
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})