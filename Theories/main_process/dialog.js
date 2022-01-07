// Electron's globalShortcut module allows an application to register global shortcuts on the user's machine.
const {app, BrowserWindow, dialog, globalShortcut, Menu} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Shortcuts created on a "MenuItem" can only be triggered when the app is in focus, unlike shortcuts created using the 
// "globalShortcut" method which will trigger regardless of whether the app is in focus or not. Both these "MenuItem"-specific
// shortcuts and global shortcuts get defined using the same "Accelerator" string syntax.

// The "webContents" module provides us the "context-menu" event for knowing when a user right-clicks anywhere in the window's
// content. Using this event along with an instance of an Electron "Menu", we can display such a menu exactly where the user 
// right-clicks by calling the menu's "popup" method.
let contextMenu = Menu.buildFromTemplate([
	{label: 'Item 1'},
	{role: 'editMenu'}
]);

// Create a new BrowserWindow when `app` is ready
function createWindow () {

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
  // mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-finish-load', () => {

		// If we pass mainWindow as a first argument, then dialog will open as a child of mainWindow.
		// dialog.showOpenDialog(mainWindow, {});

    // dialog.showOpenDialog({
    //   buttonLabel: 'Select a photo',
    //   defaultPath: app.getPath('desktop'),
    //   properties: ['multiSelections', 'createDirectory', 'openFile', 'openDirectory']
    // }).then( result => {
    //   console.log(result)
    // })

    // dialog.showSaveDialog({}).then(result => {
    //   console.log(result)
    // })

    // const answers = ['Maybe', 'No', 'Yes', "Not at all"]

    // The "Message Box" dialog accepts a number of simple button labels and prompts the user to select one of the buttons 
    // in order to dismiss the dialog. This is ideal for presenting the user with a "Yes" or "No" choice
    // dialog.showMessageBox({
    //   title: 'Message Box',
    //   message: 'Please select an option',
    //   detail: 'Message details.',
    //   buttons: answers
    // }).then( result => {
    //   console.log(`User selected: ${answers[result.response]}`)
    // })

  })

	// ***************************** Accelerators is used to write shortcut keys for our app ********************************
	globalShortcut.register('CommandOrControl+G', () => {
		console.log('User pressed G');
		globalShortcut.unregister('CommandOrControl+G');
	});

	// *************************************** Context Menu (right click) **************************************************
	mainWindow.webContents.on('context-menu', e => {
		contextMenu.popup();
	});

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
