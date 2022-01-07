const electron = require('electron');
const { BrowserWindow } = electron;
const path = require("path");

class MainWindow extends BrowserWindow {
  constructor(url) {
    super({
      // height: 500,
      // width: 300,
      // By setting frame = false, status bar (where you get options to minimize, full screen and close the app) will not be 
      // visible at the top.
      frame: false,
      resizable: false,
      // show = false -> creates a new browser window but don't show it to the user initially.
      show: false,
      // Title will visible on the left side of the icon. When we loose focus from the browser window, time left we are showing
      // as a title freezes up. This is the problem in Electron. Whenever we create a browser window and then kind of tab away
      // our focus from that browser window, Chromium will automatically start throttling (killing) all the JS that is executed
      // in that background window. Chromium is making assumption that because user is not focused on that window, the user doesn't
      // actually care about any processing or content that's going on inside that window. And so Chromium is going to artifically
      // limit the number of resources that is available to that browser window. To make sure that Chromium doesn't do the throttling
      // on our browser window, we can pass an additional config option to the browser window when it is created. That config is
      // webPreferences.
      webPreferences: {
        backgroundThrottling: false,
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "../preload.js")
      },
    });
    this.loadURL(url);
    this.on('blur', this.onBlur.bind(this));
  }

  onBlur() {
    // Order in which specific event fires: mouse down, blur, mouse up, click.
    // this.hide();
  }
}

module.exports = MainWindow;
