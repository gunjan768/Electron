// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { desktopCapturer, BrowserWindow } = require('electron')

document.getElementById('screenshot-button').addEventListener('click', () => {
  // Also, you can’t create a browser window from another browser window. This means JavaScript running inside a renderer process
  // can’t instantiate new BrowserWindow(options) to create a new window. The creation of windows must be done by the main process.
  // new BrowserWindow({});

  // You can get sources using "window" instead of "screen".
  // "window" --> You will get the data about each opened windows (like youtube, chrome etc)
  // "screen" --> You will get the data about the screens (including the external monitor(s) connected)
  desktopCapturer.getSources({types:['window'], thumbnailSize:{width:1920, height:1080} })
    .then(sources => {
      console.log(sources)
			
			// We don't need to link to an actual file, rather embed the image data directly into the image tag
      document.getElementById('screenshot').src = sources[0].thumbnail.toDataURL()
    })
})
