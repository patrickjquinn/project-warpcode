import { app, BrowserWindow, dialog, Menu } from 'electron';
// import { ipcMain } from 'electron'

const createApplicationMenu = () => {
  const hasOneOrMoreWindows = !!BrowserWindow.getAllWindows().length;
  const focusedWindow = BrowserWindow.getFocusedWindow();
  const hasFilePath = !!(focusedWindow && focusedWindow.getRepresentedFilename());

  const template: Array <Record<any, unknown>> = [
    
    {
      label: 'File',
      submenu: [
        {
          label: 'Create Project',
          accelerator: 'CommandOrControl+P',
          click(item, focusedWindow) {
            
            if (focusedWindow) {
            //   return ipcMain.createProjectFromUser(focusedWindow);
            }
    
            // const newWindow = ipcMain.createWindow();
    
            // newWindow.on('show', () => {
            //   ipcMain.createProjectFromUser(newWindow);
            // });
          },
        },
        {
          label: 'New File',
          accelerator: 'CommandOrControl+N',
          click() {
            // ipcMain.createWindow();
          }
        },
        {
          label: 'Open File',
          accelerator: 'CommandOrControl+O',
          click(item, focusedWindow) {
            
            if (focusedWindow) {
            //   return ipcMain.getFileFromUser(focusedWindow);
            }

        //     const newWindow = ipcMain.createWindow();

        //     newWindow.on('show', () => {
        //       ipcMain.getFileFromUser(newWindow);
        //     });
          },
        },
        {
            label: 'Open Folder',
            accelerator: 'CommandOrControl+O',
            click(item, focusedWindow) {
              
              if (focusedWindow) {
                // return ipcMain.getFolderFromUser(focusedWindow);
              }
  
            //   const newWindow = ipcMain.createWindow();
  
            //   newWindow.on('show', () => {
            //     ipcMain.getFolderFromUser(newWindow);
            //   });
            },
          },
        {
          label: 'Save File',
          accelerator: 'CommandOrControl+S',
          enabled: hasOneOrMoreWindows,
          click(item, focusedWindow) {
            if (!focusedWindow) {
              return dialog.showErrorBox(
                'Cannot Save or Export',
                'There is currently no active document to save or export.'
              );
            } else {
            //   focusedWindow.webContents.send('save-markdown');
            //   ipcMain.saveFile(focusedWindow);
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Show File',
          enabled: hasFilePath,
          click(item, focusedWindow) {
            if (!focusedWindow) {
              return dialog.showErrorBox(
                'Cannot Show File\'s Location',
                'There is currently no active document show.'
              );
            }
            // focusedWindow.webContents.send('show-file');
          },
        },
        {
          label: 'Open in Default Application',
          enabled: hasFilePath,
          click(item, focusedWindow) {
            if (!focusedWindow) {
              return dialog.showErrorBox(
                'Cannot Open File in Default Application',
                'There is currently no active document to open.'
              );
            }
            // focusedWindow.webContents.send('open-in-default');
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CommandOrControl+Z',
          role: 'undo',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CommandOrControl+Z',
          role: 'redo',
        },
        { type: 'separator' },
        {
          label: 'Cut',
          accelerator: 'CommandOrControl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: 'CommandOrControl+C',
          role: 'copy',
        },
        {
          label: 'Paste',
          accelerator: 'CommandOrControl+V',
          role: 'paste',
        },
        {
          label: 'Select All',
          accelerator: 'CommandOrControl+A',
          role: 'selectall',
        },
      ],
    },
    {
      label: 'Editor',
      submenu: [
        {
          label: 'Increase Font Size',
          accelerator: 'CommandOrControl+]',
          click() {
            // ipcMain.increaseFontSize();
          },
        },
        {
          label: 'Decrease Font Size',
          accelerator: 'CommandOrControl+[',
          click() {
            // ipcMain.decreaseFontSize();
          },
        },
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CommandOrControl+M',
          role: 'minimize',
        },
        {
          label: 'Close',
          accelerator: 'CommandOrControl+W',
          role: 'close',
        },
      ],
    },
      {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Visit Website',
          click() { /* To be implemented */ }
        },
        {
          label: 'Toggle Developer Tools',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools();
          }
        }
      ],
    }
  ];

  if (process.platform === 'darwin') {
    const name = 'Warp';
    template.unshift({
      label: name,
      submenu: [
        {
          label: `About ${name}`,
          role: 'about',
        },
        { type: 'separator' },
        {
          label: 'Services',
          role: 'services',
          submenu: [],
        },
        { type: 'separator' },
        {
          label: `Hide ${name}`,
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers',
        },
        {
          label: 'Show All',
          role: 'unhide',
        },
        { type: 'separator' },
        {
          label: `Quit ${name}`,
          accelerator: 'Command+Q',
          click() { app.quit(); }
        },
      ],
    });

    const windowMenu = template.find(item => item.label === 'Window');
    windowMenu.role = 'window';
  }
  return Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

export default createApplicationMenu;