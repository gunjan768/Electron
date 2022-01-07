// Modules
const { app, BrowserWindow } = require('electron');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Offscreen rendering lets you obtain the content of a BrowserWindow in a bitmap, so it can be rendered anywhere, for
// example, on texture in a 3D scene. In simple words, it means to load and render the content in a browser window on a
// separate thread and it's not visible but fast.

// Offscreen runs in two modes: 1) GPU (graphic cards) accelerated (it is by default)   2) System CPU. For rendering animations
// GPU is the favored option. But if not rendering animation, then disabling the GPU in the favor of CPU is the preferred
// fast option.

// Disabled GPU (hardware acceleration)
app.disableHardwareAcceleration();

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true,
      offscreen: true,
    },
  });

  // As rendered offscreen, so it will not be visible to you as it will run on different thread. "mainWindow" will pop up
  // but without any content that's why we hid the "mainWindow" screeen itself.
  mainWindow.loadURL('https://electronjs.org');

  let i = 1;

  // 'paint' event unlike 'did-finish-load' fires each and every time the content rendering changes. This happens multiple
  // times when loading the content. The "paint" event will fire each time a section of the webContents is rendered to a
  // BrowserWindow. This happens regardless of the webContents being visible or not and is useful for handling off-screen
  // content rendering.
  mainWindow.webContents.on('paint', (e, dirty, image) => {
    // Taking several screen shots of the process.
    let screenshot = image.toPNG();
    fs.writeFile(
      app.getPath('desktop') + `/ss/screenshot_${i}.png`,
      screenshot,
      console.log
    );
    i++;
  });

  mainWindow.webContents.on('did-finish-load', (e) => {
    console.log(mainWindow.getTitle());

    mainWindow.close();
    mainWindow = null;
  });

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  // mainWindow.on('closed',  () => {
  //   mainWindow = null
  // })
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
