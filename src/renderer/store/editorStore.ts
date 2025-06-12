import { create } from 'zustand'

interface FileInfo {
  name: string
  path: string
  content: string
  isDirty: boolean
  language: string
}

interface EditorConfig {
  theme: 'light' | 'dark'
  fontSize: number
  fontFamily: string
  wordWrap: boolean
  minimap: boolean
  lineNumbers: boolean
}

interface EditorStore {
  openFiles: FileInfo[]
  activeFileIndex: number
  config: EditorConfig
  
  updateFileContent: (path: string, content: string) => void
  setActiveFile: (index: number) => void
  updateConfig: (config: Partial<EditorConfig>) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  openFiles: [
    {
      name: 'Untitled-1',
      path: 'untitled-1',
      content: '// Welcome to Mac Text Editor\n// A powerful text editor for macOS\n\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n\n// Start coding here!',
      isDirty: false,
      language: 'typescript'
    }
  ],
  activeFileIndex: 0,
  config: {
    theme: 'dark',
    fontSize: 14,
    fontFamily: 'SF Mono, Monaco, Consolas, Liberation Mono, Courier New, monospace',
    wordWrap: true,
    minimap: true,
    lineNumbers: true,
  },

  updateFileContent: (path: string, content: string) => {
    set((state) => ({
      openFiles: state.openFiles.map((file) =>
        file.path === path
          ? { ...file, content, isDirty: true }
          : file
      ),
    }))
  },

  setActiveFile: (index: number) => {
    set({ activeFileIndex: index })
  },

  updateConfig: (newConfig: Partial<EditorConfig>) => {
    set((state) => ({
      config: { ...state.config, ...newConfig },
    }))
  },
}))