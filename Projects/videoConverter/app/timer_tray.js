const electron = require('electron');
const { Tray, app, Menu } = electron;

class TimerTray extends Tray {
  constructor(iconPath, mainWindow) {
    super(iconPath);

    this.mainWindow = mainWindow;

    // setToolTip() is a method defined in the Parent class Tray.
    this.setToolTip('Timer App');

    // mouse related events like mouse-down only work on mac.
    this.on('click', this.onClick);
    this.on('right-click', this.onRightClick);
  }

  onClick = (event, bounds) => {
    // Click event bounds
    const { x, y } = bounds;

    // Window height and width
    const { height, width } = this.mainWindow.getBounds();
    
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      const yPosition = process.platform === 'darwin' ? y : y - height;
      this.mainWindow.setBounds({
        x: parseInt(x - width / 2),
        y: y - height,
        height,
        width
      });
      this.mainWindow.show();
    }
  }

  onRightClick = () => {
    const menuConfig = Menu.buildFromTemplate([
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ]);

    // This function will add menu to our tray icon which is at the top (mac) / bottom (windows). Pops up the context menu of the
    // tray icon. When menu is passed (using setContextMenu()), the menu will be shown instead of the tray icon's context menu.
    this.popUpContextMenu(menuConfig);
  }
}

module.exports = TimerTray;