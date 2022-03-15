const { app, ipcMain, BrowserWindow, protocol } = require('electron');
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    // transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  let musicTo = '';

  ipcMain.on('setMusicUrl', (event, url) => musicTo = url);

  win.loadFile('web/index.html');
  win.webContents.session.webRequest.onBeforeSendHeaders((detail, cb) => {
		let {requestHeaders} = detail;
    requestHeaders = Object.assign(requestHeaders, {Referer: "https://www.bilibili.com"});
		cb({requestHeaders});
	}, {
		urls: ['<all_urls>'],
		types: ['xmlhttprequest']
	});
  win.webContents.session.webRequest.onBeforeRequest(async ({url}, callback) => {
		const reg = new RegExp("^lplayer://");
		if(reg.test(url)) {
      callback({redirectURL: musicTo})
    } else {
      callback({});
    }
	})
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
});

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('lplayer', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('lplayer')
}