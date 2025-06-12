import { contextBridge, ipcRenderer } from 'electron'

export interface FileData {
  content: string
  filePath: string
  fileName: string
}

export interface ElectronAPI {
  closeWindow: () => void
  minimizeWindow: () => void
  maximizeWindow: () => void
  onMenuAction: (callback: (action: string) => void) => void
  
  // ファイル操作API
  openFile: () => Promise<FileData | null>
  saveFile: (content: string, filePath?: string) => Promise<string | null>
  saveAsFile: (content: string) => Promise<string | null>
  newFile: () => void
  
  // ダイアログAPI
  showSaveDialog: (defaultPath?: string) => Promise<string | null>
  showOpenDialog: () => Promise<string[] | null>
  showMessageBox: (options: {
    type: 'info' | 'warning' | 'error' | 'question'
    title: string
    message: string
    buttons?: string[]
  }) => Promise<number>
}

const electronAPI: ElectronAPI = {
  closeWindow: () => ipcRenderer.invoke('window-close'),
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-new-file', () => callback('new-file'))
    ipcRenderer.on('menu-open-file', () => callback('open-file'))
    ipcRenderer.on('menu-save-file', () => callback('save-file'))
    ipcRenderer.on('menu-save-as-file', () => callback('save-as-file'))
  },
  
  // ファイル操作
  openFile: () => ipcRenderer.invoke('file-open'),
  saveFile: (content: string, filePath?: string) => ipcRenderer.invoke('file-save', content, filePath),
  saveAsFile: (content: string) => ipcRenderer.invoke('file-save-as', content),
  newFile: () => ipcRenderer.invoke('file-new'),
  
  // ダイアログ
  showSaveDialog: (defaultPath?: string) => ipcRenderer.invoke('dialog-save', defaultPath),
  showOpenDialog: () => ipcRenderer.invoke('dialog-open'),
  showMessageBox: (options) => ipcRenderer.invoke('dialog-message', options),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)