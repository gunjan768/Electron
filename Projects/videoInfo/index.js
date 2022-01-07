const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

// 'app' comes free and we don't have to make it. Every other window we make ourselves using this inbuilt 'app' object.
// Lifecycle: Electron starts -> app process is created -> app ready to start doing things -> app closes down
const {app, BrowserWindow, ipcMain} = electron;

// To run the app, type "npm run start" where start is the script defined in the package.json. We defined 'start' equals
// to "electron ." where . (dot) will look for the default js file which is index.js file. Why index.js because in the
// same package.json file, we have one property called "main" which is equal to "index.js".

// FFMPEG is the CLI that is used to work with video and audio files. We can do lot of things with this CLI like merging videos
// or audios, etc. We are using it for finding the duration of video. fluent-ffmpeg will get us apis around FFMPEG CLI or it
// is just a wrapper around the CLI to interact with it (CLI).

// Logic having to deal with OS or interacting with CLI or like that, will be placed inside the Electron side of our app instead
// of in the web side of our app.

// Inter Process Communication system (IPC) to communicate b/w running processes inside the electron app. For eg talk b/w running
// electron app process ('app' object) and browser window process.

let mainWindow;

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

    console.log("App is now ready");
});

// Entity used for sending message or event:
// a) From MainWindow (ipcRendered.send()) to Electron App (ipcMain.on())
// b) From Electron Appp (main.Window.webContents.send()) to MainWindow (ipcRenderer.on()) 

// Install FFMPEG: https://www.wikihow.com/Install-FFmpeg-on-Windows
// Set Envirnonment variables: https://www.youtube.com/watch?v=wXDsMKJyK9c  .... if not working then restart your computer
ipcMain.on('video:submit', async (event, path) => {
    console.log("Video path: ", path);
    ffmpeg.ffprobe(path, (err, metadata) => {
        console.log("Video length: ", metadata);
        mainWindow.webContents.send('videoLength', metadata.format.duration);
    });
});