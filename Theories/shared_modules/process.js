// Modules
const { app, BrowserWindow } = require("electron");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// The process object is created by Node.js and with nodeIntegration enabled, can also be accessed in the Renderer process. This
// process object is slightly modified by Electron. The shared "process" object is the Node.js process also known as Electron's
// "Main Process".

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile("index.html");

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on("crashed", () => {
    setTimeout(() => {
      mainWindow.reload();
    }, 1000);
  });

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Versions of electron, nodejs, chromium etc
  console.log(process.versions);

  // The Node.js "process" object identifies an Electron Renderer process as type "renderer" or "worker" and the Main process
  // as being of type "browser". process.type tells which type of process.
  console.log(process.type);
}

// Electron `app` is ready
app.on("ready", createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
