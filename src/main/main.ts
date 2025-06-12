import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { promises as fs } from 'fs'
import { isDev } from './utils'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
  })

  if (isDev()) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.send('menu-new-file')
          },
        },
        {
          label: 'Open File',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow?.webContents.send('menu-open-file')
          },
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow?.webContents.send('menu-save-file')
          },
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit()
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
  createWindow()
  createMenu()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('window-close', () => {
  mainWindow?.close()
})

ipcMain.on('window-minimize', () => {
  mainWindow?.minimize()
})

ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

// ファイル操作ハンドラー
ipcMain.handle('file-open', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'md', 'js', 'ts', 'jsx', 'tsx', 'json', 'css', 'html', 'py', 'java', 'cpp', 'c', 'h'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  try {
    const filePath = result.filePaths[0]
    const content = await fs.readFile(filePath, 'utf-8')
    const fileName = join(filePath).split('/').pop() || 'untitled'
    
    return {
      content,
      filePath,
      fileName
    }
  } catch (error) {
    console.error('Error reading file:', error)
    return null
  }
})

ipcMain.handle('file-save', async (event, content: string, filePath?: string) => {
  try {
    if (filePath) {
      await fs.writeFile(filePath, content, 'utf-8')
      return filePath
    } else {
      const result = await dialog.showSaveDialog(mainWindow!, {
        filters: [
          { name: 'Text Files', extensions: ['txt'] },
          { name: 'JavaScript', extensions: ['js'] },
          { name: 'TypeScript', extensions: ['ts'] },
          { name: 'React', extensions: ['jsx', 'tsx'] },
          { name: 'JSON', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })

      if (result.canceled || !result.filePath) {
        return null
      }

      await fs.writeFile(result.filePath, content, 'utf-8')
      return result.filePath
    }
  } catch (error) {
    console.error('Error saving file:', error)
    return null
  }
})

ipcMain.handle('file-save-as', async (event, content: string) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow!, {
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'JavaScript', extensions: ['js'] },
        { name: 'TypeScript', extensions: ['ts'] },
        { name: 'React', extensions: ['jsx', 'tsx'] },
        { name: 'JSON', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })

    if (result.canceled || !result.filePath) {
      return null
    }

    await fs.writeFile(result.filePath, content, 'utf-8')
    return result.filePath
  } catch (error) {
    console.error('Error saving file:', error)
    return null
  }
})

ipcMain.handle('file-new', () => {
  if (mainWindow) {
    mainWindow.webContents.send('menu-new-file')
  }
})

// ダイアログハンドラー
ipcMain.handle('dialog-save', async (event, defaultPath?: string) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath,
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'JavaScript', extensions: ['js'] },
      { name: 'TypeScript', extensions: ['ts'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  
  return result.canceled ? null : result.filePath
})

ipcMain.handle('dialog-open', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'md', 'js', 'ts', 'jsx', 'tsx', 'json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  
  return result.canceled ? null : result.filePaths
})

ipcMain.handle('dialog-message', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow!, options)
  return result.response
})