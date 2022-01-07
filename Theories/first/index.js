const electron = require('electron');

const {app, BrowserWindow} = electron;
const windowStateKeeper = require('electron-window-state');

console.log("Is App ready: ", app.isReady());

let mainWindow, sWindow;

function applyWebContentsEvents() {
    let wc = mainWindow.webContents;
    
    // wc.on('did-finish-load', () => {
    //     console.log("Contents fully loaded");
    // });

    // wc.on('dom-ready', () => {            
    //     console.log("Dom Ready");
    // });

    // Deprecated. Emitted when the page requests to open a new window for a url. It could be requested by window.open or an
    // external link like <a target='_blank'>. By default a new BrowserWindow will be created for the url.
    // wc.on('new-window', (e, url) => {            
    //     console.log("New window url: ", url);
    // });

    // wc.on('before-input-event', (e, input) => {        
    //     console.log(`${input.key} : ${input.type}`);
    // });

    // wc.on('login', (e, req, authInfo, callback) => {        
    //     console.log(`Logging in`);
    //     callback('user', 'passwd');
    // });

    // wc.on('did-navigate', (e, url, statusCode, message) => {        
    //     console.log(`Navigated to: ${url}`);
    //     console.log(statusCode)
    // });
 
    // When you right click
    wc.on('context-menu', (e, params) => {
        console.log(`Context menu opened on: ${params.mediaType} at x: ${params.x} and y: ${params.y}`)
        let selectedText = params.selectionText.toString();
        console.log(`User selected text: ${selectedText}`);
        console.log(`Selection can be copied: ${params.editFlags.canCopy}`);
        
        wc.executeJavaScript(`console.log('${selectedText}')`);
    });
}

app.on('ready', () => {
    console.log("App is now ready");

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
        backgroundColor: "#2e2c29",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    
    sWindow = new BrowserWindow({
        show: false,
        height: 300,
        width: 400,
        backgroundColor: "#2e2c29",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        parent: mainWindow,
        // modal only for mac
        modal: true,
        // frame: false,
        title: "Hey bro",
        titleBarOverlay: true
    });

    // loadURL() is outdated to load a file.
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    // mainWindow.loadURL("http://httpbin.org/basic-auth/user/passwd");

    // mainWindow.loadFile('./index.html');

    mainWindow.webContents.openDevTools();
    console.log("desktop: ", app.getPath('desktop'));

    // Avoid the white flicking of the screen
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        // sWindow.show()
        sWindow.close();
    });

    winState.manage(mainWindow);

    // We can also avoid the white flicking of the screen by changing the background color
    mainWindow.on('close', () => mainWindow = null);
    sWindow.on('closed', () => {
        sWindow = null
        // mainWindow.maximize();
    });

    applyWebContentsEvents();

    // app.on('browser-window-focus', () => console.log("Any of the Windows Focused"))
});

app.on('before-quit', (event) => {
    console.log("App is quitting");

    // This will not let the app to quit (as default behaviour of 'before-quit' event is to quit the app)
    // event.preventDefault();
});