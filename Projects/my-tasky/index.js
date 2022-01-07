const path = require('path');
const electron = require('electron');
const TimerTray = require('./app/timer_tray');
const MainWindow = require('./app/main_window');

const { app, ipcMain, Menu, BrowserWindow } = electron;

let mainWindow;
let tray;

function createWindow() {
  // mainWindow = new MainWindow(`file://${__dirname}/bundle/index.html`);
  mainWindow = new MainWindow(`http://localhost:3000`);
  process.platform === 'win32' ? mainWindow.setSkipTaskbar(true) : app.dock.hide();
  
  // We don't need to mention the size of icon by writing the suffix part of the icon name (windows-icon@2x.png: just write
  // windows-icon.png). Electron will automatically detect and decide whether to use the high resolution version of the icon
  // depending upon the current running environment.
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
  const iconPath = path.join(__dirname, `./src/assets/${iconName}`);
  tray = new TimerTray(iconPath, mainWindow);
  
  // const contextMenu = Menu.buildFromTemplate([
  //   { label: 'Item1', type: 'radio' },
  //   { label: 'Item2', type: 'radio' },
  //   { label: 'Item3', type: 'radio', checked: true },
  //   { label: 'Item4', type: 'radio' }
  // ])
  // tray.setContextMenu(contextMenu)
}

// Positioning of elements with electron involve "The Bounds System". Bounds refers to the positioning and the height and
// width of an individual element. In this app we deal with 2 types of bounds: Click event bounds and Window bounds. Click
// event bounds means the location of the current window browser (origin: top left corner) where as Window bounds tells us the
// height and width of the window browser.

// Location of the window browser:  From top = click event y-direction bounds, From left = click event x-direction bounds.
// Dimensions of the window browser: Height = window y bounds, width = window x bounds
app.on('ready', () => {
  // App icon will not be visible on the dock.
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// https://stackoverflow.com/questions/44008674/how-to-import-the-electron-ipcrenderer-in-a-react-webpack-2-setup
// https://github.com/Jerga99/electron-react-boilerplate
ipcMain.on('update-timer', (event, timeLeft) => {
  // Title will visible on the left side of the icon.
  console.log("TimeLeft: ", timeLeft)
  process.platform === 'win32' ? 
    tray.displayBalloon({
      title: "Timer",
      content: timeLeft
    }) : 
    tray.setTitle(timeLeft)
});