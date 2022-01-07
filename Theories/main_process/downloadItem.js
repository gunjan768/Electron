const electron = require('electron');
const {app, BrowserWindow, session} = electron;
const windowStateKeeper = require('electron-window-state');

let mainWindow;

// You can restart the app by typing "rs" in the terminal (when using nodemon and the app is running).

app.on('ready', () => {
    let sess =  session.defaultSession;

    // Providing the default states. windowStateKeeper will save the state of the window (both the size and co-ordinates)
    let winState = windowStateKeeper({
        defaultHeight: 1000,
        defaultWidth: 800
    });

    mainWindow = new BrowserWindow({
        height: winState.height,
        width: winState.width,
        x: winState.x,
        y: winState.y,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('./index1.html');
    mainWindow.webContents.openDevTools();
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('close', () => mainWindow = null);
    winState.manage(mainWindow);

    // webContents is the web content responsible for download. In order to take full control of downloadable resources, we 
    // can use the downloadItem object provided by the session. The "downloadItem" will provide all the information it can 
    // from the download's HTTP response headers. This includes the size in bytes, the progress once the download is started,
    // the name of the resource etc. It can not however assess whether the resource is safe. That along with specifying a location
    // for the file to be saved to, is the responsibility of the developer.
    sess.on('will-download', (event, downloadItem, webContents) => {
        console.log('Starting download');
        let fileSize = Number(downloadItem.getTotalBytes());
        console.log("File size: ", fileSize);
        console.log('File name: ', downloadItem.getFilename());

        // If we don't want user to select the location where he wants to save the download item.
        downloadItem.setSavePath(app.getPath('desktop') + `/${downloadItem.getFilename()}`);

        downloadItem.on('updated', (e, state) => {
            let received = +downloadItem.getReceivedBytes();

            if(state === 'progressing' && received) {
                let progress = (received / fileSize) * 100;
                console.log("Received", received);
                webContents.executeJavaScript(`window.progress.value = ${progress}`);
            }
        });
    });
}); 