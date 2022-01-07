// Here we have access to NodeJs. This preload runs prior to the renderer process.
const fs = require('fs');

const desktopPath = 'D:/';

window.writeToFile = (text) => {
  fs.writeFile(desktopPath + '/app.txt', text, console.log);
};

window.versions = {
  node: process.versions.node,
  electron: process.versions.electron,
};
