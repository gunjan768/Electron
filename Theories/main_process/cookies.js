const electron = require('electron');
const {app, BrowserWindow, session} = electron;
const windowStateKeeper = require('electron-window-state');

let mainWindow;

// You can restart the app by typing "rs" in the terminal (when using nodemon and the app is running).

app.on('ready', () => {
    let sess =  session.defaultSession;

    // To get all the cookies
    let getCookies = () => {
        sess.cookies.get({})
        .then(cookies => {console.log(cookies);})
        .catch(err => console.log(err))
    };

    // To get the specific cookie
    let getCookie = (name) => {
        sess.cookies.get({name})
        .then(cookies => {console.log(cookies);})
        .catch(err => console.log(err))
    };

    let setCookies = (cookie) => {
        sess.cookies.set(cookie)
        .then(() => console.log(getCookies()))
        .catch(err => console.log(err))
    };

    let removeCookie = (url, name) => {
        // Accepts two parameters: url and name (optional). Cookies with the same name can exist under the different
        // domains (or urls)
        sess.cookies.remove(url, name)
        .then(() => console.log(getCookies()))
        .catch(err => console.log(err))
    };

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

    // To see all the cookies present in the github site.
    // mainWindow.loadURL('https://www.github.com');

    mainWindow.loadFile('./index.html');
    mainWindow.webContents.openDevTools();
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('close', () => mainWindow = null);
    winState.manage(mainWindow);

    // mainWindow.webContents.on('did-finish-load', event => getCookies());

    // A "session cookie" refers the the app session and not Electron's "session" storage object. This essentially 
    // means that a "session cookie" only exists for as long as the application is open (the current session). In 
    // order to make a cookie persisted, an expiry date must be set on the cookie object.
    
    // If we don't put "expirationDate", then "session" property becomes true which means it doesn't persist b/w
    // app restart or available for the current session. If we put "expirationDate", then it presists b/w app restart
    // and "session" property sets to false (i.e. not marked as session cookie).
    let cookie1 = {url: 'https://mydomain.com', name: 'cookie1', value: 'electron'};
    let cookie2 = {url: 'https://mydomain.com', name: 'cookie2', value: 'electron', expirationDate: 1672835156.055341};
    // setCookies(cookie1);
    // setCookies(cookie2);

    // getCookie("cookie1");
    removeCookie('https://mydomain.com', 'cookie1');
}); 