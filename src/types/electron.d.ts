interface FileData {
  content: string
  filePath: string
  fileName: string
}

interface ElectronAPI {
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

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}