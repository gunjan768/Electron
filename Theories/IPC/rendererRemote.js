// The remote module was deprecated in Electron 12, and will be removed in Electron 14. It is replaced by the 
// @electron/remote module.
const remote = require('@electron/remote')

// Using remote module, we can get the reference to the modules of the main process required using getters and not the
// exact module. Here dialog and BrowserWindow are not the exact modules, but the getters (reference) to those modules. 

setTimeout( () => {
	// Don't destructure outside as it will take some time to create this main Window
	const { dialog, BrowserWindow, app } = remote;

  dialog.showMessageBox({
    message: 'Dialog from renderer',
    buttons: ['One', 'Two']
  }).then( res => {
    console.log(res)
  })

  let win = new BrowserWindow({
    x: 50, y: 50, width: 300, height: 250
  })
  
  win.loadFile('index.html')
  
  // setTimeout(app.quit, 2000)

  let mainWindow = remote.getCurrentWindow()
  mainWindow.maximize()

}, 2000)

// *************************************************** IPC Invoke and Handle ***********************************************

const { ipcRenderer } = require('electron')

document.getElementById('ask').addEventListener('click', e => {
  ipcRenderer.invoke('ask-fruit').then(answer => {
    console.log(answer)
  })
})