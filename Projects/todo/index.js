const { ipcMain } = require('electron');
const electron = require('electron');

// 'app' comes free and we don't have to make it. Every other window we make ourselves using this inbuilt 'app' object.
// Lifecycle: Electron starts -> app process is created -> app ready to start doing things -> app closes down
const {app, BrowserWindow, Menu} = electron;

// To run the app, type "npm run start" where start is the script defined in the package.json. We defined 'start' equals
// to "electron ." where . (dot) will look for the default js file which is index.js file. Why index.js because in the
// same package.json file, we have one property called "main" which is equal to "index.js".

// Logic having to deal with OS or interacting with CLI or like that, will be placed inside the Electron side of our app instead
// of in the web side of our app.

// Inter Process Communication system (IPC) to communicate b/w running processes inside the electron app. For eg talk b/w running
// electron app process ('app' object) and browser window process.

let mainWindow;
let addWindow;

app.on('ready', () => {
    // This BrowserWindow is the called MainWindow. As of version 5, the default for nodeIntegration changed from true to false.
    // You can enable it when creating the Browser Window:
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    // app.quit() will close the entire app (including all windows that are open).
    mainWindow.on('closed', () => {
        app.quit();
    });

    // As we are building our own menu so the default one will disappear.
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

    console.log("App is now ready");
});

// Property names of nested objects should be same: label, submenu. First menu on Mac is reserved for the app name but same is
// not true for Windows. Then to overcome this problem, when Electron app runs on Mac, we will define an empty object as the
// first element of menuTemplate array. To know on which platorm, Electron app is running, use 'process.platform'.

const createAddWindow = () => {
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 500,
        height: 300,
        title: 'Add New Todo'
    });
    
    addWindow.loadURL(`file://${__dirname}/add.html`);

    // Memory management is in JS is works similarly to Java. So whenever we close any window, the variable which stores the
    // window needs to be freed so that Garbage Collection can collect this unused variable. We can free the variable by
    // assigning it to null.
    addWindow.on('closed', () => addWindow = null);
};

// Entity used for sending message or event:
// a) From MainWindow (ipcRendered.send()) to Electron App (ipcMain.on())
// b) From Electron Appp (mainWindow.webContents.send()) to MainWindow (ipcRenderer.on()) 

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo); 
    addWindow.close();
});

const menuTemplate = [
    {
        label: 'File',
        // Behind the scenes Electron has number of preset roll options available and one of which is reload. Whenever Electron
        // sees these roles, it generates label, accelerator and more against that role.
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'New Todo',
                click() {createAddWindow()}
            },
            {
                label: 'Clear Todos',
                click() {(() => {
                    mainWindow.webContents.send('todo:clear');
                })()}
            },
            {
                label: 'Quit',
                // accelerator property is the hot key by pressing invokes the click() method of the associated label.
                // accelerator: 'ctrl+q',

                // We can even assign immediate invoke function to accelerator property. You can instead use terenary expression
                // also.
                accelerator: (() => {
                    if (process.platform === 'darwin') {
                        return 'Command+Q';
                    } else {
                        return 'CtRl+Q';    // Case insensitive
                    }
                })(),
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// For MacOs. Since First menu on Mac is reserved for the app name but same is not true for Windows.
if (process.platform === 'darwin') {
    // The unshift() method adds new items to the beginning of an array, and returns the new length.
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [
            {
                label: 'Developer Tools',
                accelerator: process.platform === 'win32' ? `ctrl + shift + i` : `command + alt + i`,
                click(item, focusWindow) {
                    // focusWindow is the current window (as there can be more than one window opened at a time and we want to
                    // open the developer tools on the current focused window)
                    focusWindow.toggleDevTools();
                }
            }
        ]
    });
}