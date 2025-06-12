import { create } from 'zustand'

interface FileTab {
  id: string
  fileName: string
  filePath?: string
  content: string
  isDirty: boolean
  language: string
}

interface EditorSettings {
  fontSize: number
  lineNumbers: boolean
  wordWrap: boolean
  minimap: boolean
  theme: 'light' | 'dark'
}

interface EditorState {
  // Tab management
  tabs: FileTab[]
  activeTabId: string | null
  
  // Editor settings
  settings: EditorSettings
  
  // Actions
  addTab: (tab: FileTab) => void
  removeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  updateTabContent: (tabId: string, content: string) => void
  updateTabLanguage: (tabId: string, language: string) => void
  markTabDirty: (tabId: string, isDirty: boolean) => void
  updateTabFile: (tabId: string, filePath: string, fileName: string) => void
  
  // Settings actions
  updateSettings: (settings: Partial<EditorSettings>) => void
  toggleTheme: () => void
  
  // Computed getters
  getActiveTab: () => FileTab | undefined
  hasUnsavedChanges: () => boolean
  generateTabId: () => string
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Initial state
  tabs: [
    {
      id: 'welcome',
      fileName: 'Welcome.ts',
      content: '// Welcome to Mac Text Editor\n// Start typing your code here...\n\nfunction hello() {\n  console.log("Hello, World!");\n}',
      isDirty: false,
      language: 'typescript'
    }
  ],
  activeTabId: 'welcome',
  settings: {
    fontSize: 14,
    lineNumbers: true,
    wordWrap: true,
    minimap: true,
    theme: 'dark'
  },

  // Tab actions
  addTab: (tab: FileTab) => {
    set((state) => ({
      tabs: [...state.tabs, tab],
      activeTabId: tab.id
    }))
  },

  removeTab: (tabId: string) => {
    set((state) => {
      const newTabs = state.tabs.filter(tab => tab.id !== tabId)
      let newActiveTabId = state.activeTabId

      // If removing the active tab, switch to another tab
      if (state.activeTabId === tabId) {
        if (newTabs.length > 0) {
          newActiveTabId = newTabs[0].id
        } else {
          // If no tabs left, create a new one
          const newTab: FileTab = {
            id: get().generateTabId(),
            fileName: 'Untitled',
            content: '',
            isDirty: false,
            language: 'text'
          }
          newTabs.push(newTab)
          newActiveTabId = newTab.id
        }
      }

      return {
        tabs: newTabs,
        activeTabId: newActiveTabId
      }
    })
  },

  setActiveTab: (tabId: string) => {
    set({ activeTabId: tabId })
  },

  updateTabContent: (tabId: string, content: string) => {
    set((state) => ({
      tabs: state.tabs.map(tab =>
        tab.id === tabId
          ? { ...tab, content, isDirty: true }
          : tab
      )
    }))
  },

  updateTabLanguage: (tabId: string, language: string) => {
    set((state) => ({
      tabs: state.tabs.map(tab =>
        tab.id === tabId
          ? { ...tab, language }
          : tab
      )
    }))
  },

  markTabDirty: (tabId: string, isDirty: boolean) => {
    set((state) => ({
      tabs: state.tabs.map(tab =>
        tab.id === tabId
          ? { ...tab, isDirty }
          : tab
      )
    }))
  },

  updateTabFile: (tabId: string, filePath: string, fileName: string) => {
    set((state) => ({
      tabs: state.tabs.map(tab =>
        tab.id === tabId
          ? { ...tab, filePath, fileName, isDirty: false }
          : tab
      )
    }))
  },

  // Settings actions
  updateSettings: (newSettings: Partial<EditorSettings>) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }))
  },

  toggleTheme: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        theme: state.settings.theme === 'dark' ? 'light' : 'dark'
      }
    }))
  },

  // Computed getters
  getActiveTab: () => {
    const state = get()
    return state.tabs.find(tab => tab.id === state.activeTabId)
  },

  hasUnsavedChanges: () => {
    const state = get()
    return state.tabs.some(tab => tab.isDirty)
  },

  generateTabId: () => Math.random().toString(36).substr(2, 9),
}))

export type { FileTab, EditorSettings }