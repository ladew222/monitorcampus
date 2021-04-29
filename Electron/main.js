const { app, BrowserWindow, Menu } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');


let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width:800,
        height:600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule:true,
            contextIsolation: false
        }
    });
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);

    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;

    });
}

const sendMessage = () => {
    if (mainWindow) {
        mainWindow.webContents.send('my-ipc-channel', {
            message: 'Message communicated from the main process!'
        });
    }
};

/**
 * Native File Menu
 */
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Action',
                click: sendMessage,
                accelerator: 'CmdOrCtrl+A'
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);


app.on('ready', createWindow);