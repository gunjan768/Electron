const electron = require('electron');

const {app, BrowserWindow, session} = electron;
const windowStateKeeper = require('electron-window-state');

let mainWindow, sWindow;

// You can restart the app by typing "rs" in the terminal (when using nodemon and the app is running).
// The "session" object of the BrowserWindow's "webContents", supports and stores data from all standard browser storage APIs.
// This includes third party Cookies loaded by remote content, or any data added by the application via the "webContents".

app.on('ready', () => {
    console.log("App is now ready");

    // We have two types of partitions of storing session: a) persisted which means saved to disk   b) memory which means
    // are only stored in memory and doesn't get persisted b/w app restarts. Default session uses persistent parition by
    // default. A BrowserWindow's default "webContents" session is persisted and written to to the "appData" directory path.

    // This is memory partition
    // let customSession = session.fromPartition('part1');

    // This is persistent partition. We can even create custom session by passing as a property to BrowserWindow constructor
    // (inside webPreferences object)
    // let customSession = session.fromPartition('persist:part1');

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

    sWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            // If we don't mention anything, then browser window will use the default session.
            // session: customSession,
            
            // We can use the shorthand way of creating a session by using "partition" property instead of creating the
            // session (custom) and then passing that session to the "session" property (as did above). If the name
            // (here name is "part1") of the partition is not there, then Electron will create it else use the created one. 
            partition: 'persist:part1'
        }
    });

    mainWindow.loadFile('./index.html');
    sWindow.loadURL('https://www.google.com');

    mainWindow.webContents.openDevTools();

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });

    winState.manage(mainWindow);

    webContents();

    // Session is the store of any web content data. If we add an entry to local storage in the browser window,
    // that will be part of the current session and get stored in the default session being used by the mainWindow.
    // This session will be shared across all the browser windows.
    let session1 = mainWindow.webContents.session;
    let session2 = sWindow.webContents.session;
    let defaultSession = session.defaultSession;

    // Object.is() to see whether two objects are referencing to the same location.
    console.log(Object.is(session1, session2));
    console.log(Object.is(session1, defaultSession));
    // console.log(Object.is(customSession, defaultSession));

    // We can also avoid the white flicking of the screen by changing the background color
    mainWindow.on('close', () => {
        // Will clear everything (whether stored in local storage or indexedDB or any other).
        session1.clearStorageData();
        mainWindow = null
    });
});

function webContents() {
    
}