export interface FileInfo {
  name: string
  path: string
  content: string
  isDirty: boolean
  language?: string
}

export interface EditorConfig {
  theme: 'light' | 'dark'
  fontSize: number
  fontFamily: string
  wordWrap: boolean
  minimap: boolean
  lineNumbers: boolean
}

export interface AppState {
  openFiles: FileInfo[]
  activeFileIndex: number
  config: EditorConfig
}

export type MenuAction = 'new-file' | 'open-file' | 'save-file'

declare global {
  interface Window {
    electronAPI: {
      closeWindow: () => void
      minimizeWindow: () => void
      maximizeWindow: () => void
      onMenuAction: (callback: (action: string) => void) => void
    }
  }
}