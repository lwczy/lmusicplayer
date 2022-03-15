const { contextBridge, ipcRenderer } = require('electron');
const urllib = require('urllib');

const fs = require('fs');

contextBridge.exposeInMainWorld('urllib', urllib);
contextBridge.exposeInMainWorld('setMusicUrl', function(url){
  ipcRenderer.send('setMusicUrl', url);
});

contextBridge.exposeInMainWorld('playList', {
  readAll: () => {
    return JSON.parse(fs.readFileSync('playList.json', { encoding: 'utf8', flag: 'a+'}) || '[]');
  },
  writeAll: list => {
    fs.writeFileSync('playList.json', JSON.stringify(list), { encoding: 'utf8', flag: 'w'});
  },
});