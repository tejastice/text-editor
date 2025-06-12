import React, { useState, useEffect, useCallback } from 'react'
import MonacoEditor from './components/MonacoEditor'

interface FileTab {
  id: string
  fileName: string
  filePath?: string
  content: string
  isDirty: boolean
  language: string
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [tabs, setTabs] = useState<FileTab[]>([
    {
      id: 'welcome',
      fileName: 'Welcome.ts',
      content: '// Welcome to Mac Text Editor\n// Start typing your code here...\n\nfunction hello() {\n  console.log("Hello, World!");\n}',
      isDirty: false,
      language: 'typescript'
    }
  ])
  const [activeTabId, setActiveTabId] = useState('welcome')

  const activeTab = tabs.find(tab => tab.id === activeTabId)

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const generateTabId = () => Math.random().toString(36).substr(2, 9)

  const updateTabContent = (tabId: string, content: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, content, isDirty: true }
        : tab
    ))
  }

  const updateTabLanguage = (tabId: string, language: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, language }
        : tab
    ))
  }

  const handleContentChange = useCallback((value: string | undefined) => {
    if (activeTabId) {
      updateTabContent(activeTabId, value || '')
    }
  }, [activeTabId])

  const handleNewFile = () => {
    const newTab: FileTab = {
      id: generateTabId(),
      fileName: 'Untitled',
      content: '',
      isDirty: false,
      language: 'text'
    }
    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTab.id)
  }

  const handleOpenFile = async () => {
    try {
      const fileData = await window.electronAPI?.openFile()
      if (fileData) {
        const newTab: FileTab = {
          id: generateTabId(),
          fileName: fileData.fileName,
          filePath: fileData.filePath,
          content: fileData.content,
          isDirty: false,
          language: getLanguageFromFileName(fileData.fileName)
        }
        setTabs(prev => [...prev, newTab])
        setActiveTabId(newTab.id)
      }
    } catch (error) {
      console.error('Error opening file:', error)
    }
  }

  const handleSaveFile = async () => {
    if (!activeTab) return
    
    try {
      const filePath = await window.electronAPI?.saveFile(activeTab.content, activeTab.filePath)
      if (filePath) {
        setTabs(prev => prev.map(tab => 
          tab.id === activeTabId 
            ? { ...tab, filePath, isDirty: false, fileName: filePath.split('/').pop() || tab.fileName }
            : tab
        ))
      }
    } catch (error) {
      console.error('Error saving file:', error)
    }
  }

  const handleSaveAsFile = async () => {
    if (!activeTab) return
    
    try {
      const filePath = await window.electronAPI?.saveAsFile(activeTab.content)
      if (filePath) {
        setTabs(prev => prev.map(tab => 
          tab.id === activeTabId 
            ? { ...tab, filePath, isDirty: false, fileName: filePath.split('/').pop() || tab.fileName }
            : tab
        ))
      }
    } catch (error) {
      console.error('Error saving file as:', error)
    }
  }

  const closeTab = (tabId: string) => {
    const tabToClose = tabs.find(tab => tab.id === tabId)
    if (tabToClose?.isDirty) {
      // TODO: Show confirmation dialog
    }
    
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId)
      if (newTabs.length === 0) {
        handleNewFile()
        return newTabs
      }
      return newTabs
    })
    
    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId)
      if (remainingTabs.length > 0) {
        setActiveTabId(remainingTabs[0].id)
      }
    }
  }

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'py': 'python',
      'json': 'json',
      'md': 'markdown',
      'css': 'css',
      'html': 'html',
      'txt': 'text'
    }
    return languageMap[ext || ''] || 'text'
  }

  // Listen for menu actions
  useEffect(() => {
    if (window.electronAPI?.onMenuAction) {
      window.electronAPI.onMenuAction((action: string) => {
        switch (action) {
          case 'new-file':
            handleNewFile()
            break
          case 'open-file':
            handleOpenFile()
            break
          case 'save-file':
            handleSaveFile()
            break
          case 'save-as-file':
            handleSaveAsFile()
            break
        }
      })
    }
  }, [activeTab, activeTabId])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault()
            handleNewFile()
            break
          case 'o':
            e.preventDefault()
            handleOpenFile()
            break
          case 's':
            e.preventDefault()
            if (e.shiftKey) {
              handleSaveAsFile()
            } else {
              handleSaveFile()
            }
            break
          case 'w':
            e.preventDefault()
            if (activeTabId) closeTab(activeTabId)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, activeTabId])

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} p-4 border-b`}>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Mac Text Editor</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleNewFile}
                className={`px-3 py-1 rounded border text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'
                }`}
              >
                New
              </button>
              <button
                onClick={handleOpenFile}
                className={`px-3 py-1 rounded border text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'
                }`}
              >
                Open
              </button>
              <button
                onClick={handleSaveFile}
                className={`px-3 py-1 rounded border text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'
                }`}
              >
                Save
              </button>
              {activeTab && (
                <select
                  value={activeTab.language}
                  onChange={(e) => updateTabLanguage(activeTabId, e.target.value)}
                  className={`px-3 py-1 rounded border text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="json">JSON</option>
                  <option value="markdown">Markdown</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                  <option value="text">Text</option>
                </select>
              )}
              <button
                onClick={toggleTheme}
                className={`px-4 py-1 rounded border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'
                }`}
              >
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>
        </header>

        {/* Tab Bar */}
        <div className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'} border-b`}>
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center px-4 py-2 border-r cursor-pointer min-w-0 ${
                  tab.id === activeTabId
                    ? theme === 'dark' 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                    : theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-100'
                } ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
                onClick={() => setActiveTabId(tab.id)}
              >
                <span className="truncate text-sm">
                  {tab.fileName}
                  {tab.isDirty && ' •'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                  className={`ml-2 w-4 h-4 rounded-full text-xs flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-600 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {activeTab ? (
            <MonacoEditor
              value={activeTab.content}
              onChange={handleContentChange}
              language={activeTab.language}
              theme={theme}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No file open</p>
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'} p-2 border-t text-sm`}>
          <div className="flex items-center justify-between">
            <span>
              {activeTab ? (
                <>
                  {activeTab.fileName} • Lines: {activeTab.content.split('\n').length} • Language: {activeTab.language}
                  {activeTab.isDirty && ' • Modified'}
                </>
              ) : (
                'Ready'
              )}
            </span>
            <span>
              {activeTab && `Characters: ${activeTab.content.length}`}
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App