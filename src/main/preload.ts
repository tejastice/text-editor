import { contextBridge, ipcRenderer } from 'electron'

export interface ElectronAPI {
  closeWindow: () => void
  minimizeWindow: () => void
  maximizeWindow: () => void
  onMenuAction: (callback: (action: string) => void) => void
}

const electronAPI: ElectronAPI = {
  closeWindow: () => ipcRenderer.invoke('window-close'),
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-new-file', () => callback('new-file'))
    ipcRenderer.on('menu-open-file', () => callback('open-file'))
    ipcRenderer.on('menu-save-file', () => callback('save-file'))
  },
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)