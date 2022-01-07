// Modules
const { app, BrowserWindow } = require('electron');
const updater = require('./updater');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// By default, Electron will look for the assests in the directory called "build". Build related problem -> when you try
// to build using: "electron-builder -w"... w for windows.
// https://stackoverflow.com/questions/58751387/electron-builder-cannot-move-downloaded-into-final-location

// Refer Semantic versioning for versioning your app like 2.1.3 (major.minor.patch)... patch -> any error or bug fix
// Refer for "npm run release": https://github.com/iffy/electron-updater-example

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  // Check for app updates after 3 seconds
  setTimeout(updater, 1500);

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow preload execution
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,

      // For preload, put nodeIntegration = false and for others, put it true.
      nodeIntegration: false,

      // Electron allows to run some code on the Windows Web Contents before loading by the means of preload script.
      // By setting 'nodeIntegration' to true will expose all the NodeJS modules to renderer process which causes security
      // issues. So another way is exposing those apis to the renderer process which are required by putting them in the
      // proload.js file and mentioning the name in the 'preload' property.

      // When "nodeIntegration" needs to be disabled for a given BrowserWindow, a Preload script can provide safe access to
      // the Main process prior to loading that window's content. This allow us to perform tasks that imvolve the Main process
      // or create references to Main process functionality.
      preload: __dirname + '/preload.js',
    },
  });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('index.html');

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron `app` is ready
app.on('ready', createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

// Q) When will a "Preload Script" be executed ?
// --> A preload script runs in a BrowserWindow just before "nodeIntegration" gets disabled. This is immedaitely prior to loading
// the webContents of that BrowserWindow in order to have access to both the Node.js API and the Renderer process, but before
// loading potentially dangerous content. In other words: Once a BrowserWindow in ready, but before loading it's web contents.
