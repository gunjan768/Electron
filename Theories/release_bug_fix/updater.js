const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');
// Enable logging using "electron-log".
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

// By default, it writes logs to the following locations:
// on Linux: ~/.config/{app name}/logs/{process type}.log
// on macOS: ~/Library/Logs/{app name}/{process type}.log
// on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log

// Disable the auto downloading of updates
autoUpdater.autoDownload = false;

// Single export to check for and apply any available updates
module.exports = () => {
  // Check for update (GH releases)
  console.log('Checking for releases');

  autoUpdater.checkForUpdates();

  // Listen for the update found
  autoUpdater.on('update-available', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update available',
        message:
          'A new version of Condenity is available. Do u want to update now?',
        buttons: ['Update', 'No'],
      })
      .then((result) => {
        let buttonIndex = result.response;
        if (buttonIndex === 0) {
          autoUpdater.downloadUpdate();
        }
      });
  });

  // Listen for update download
  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update ready',
        message:
          'Install and restart now?',
        buttons: ['Yes', 'Later'],
      })
      .then((result) => {
        let buttonIndex = result.response;
        if (buttonIndex === 0) {
          // quitAndInstall(): Restarts the app and installs the update after it has been downloaded. It should only be called 
          // after update-downloaded has been emitted. Note: autoUpdater.quitAndInstall() will close all application windows first
          // and only emit before-quit event on app after that. This is different from the normal quit event sequence. @param 
          // isSilent — windows-only Runs the installer in silent mode. Defaults to false. @param isForceRunAfter — Run the app 
          // after finish even on silent install. Not applicable for macOS. Ignored if isSilent is set to false.
          autoUpdater.quitAndInstall(false, true);
        }
      });
  });
};
