import React, { useState } from 'react'
import MonacoEditor from './components/MonacoEditor'

const App: React.FC = () => {
  const [content, setContent] = useState('// Welcome to Mac Text Editor\n// Start typing your code here...\n\nfunction hello() {\n  console.log("Hello, World!");\n}')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [language, setLanguage] = useState('typescript')

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const handleContentChange = (value: string | undefined) => {
    setContent(value || '')
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex flex-col h-screen">
        <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} p-4 border-b`}>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Mac Text Editor</h1>
            <div className="flex items-center gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-3 py-1 rounded border ${
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
              </select>
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
        
        <main className="flex-1 p-4">
          <div className="h-full rounded-lg overflow-hidden border border-gray-300">
            <MonacoEditor
              value={content}
              onChange={handleContentChange}
              language={language}
              theme={theme}
            />
          </div>
        </main>
        
        <footer className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'} p-2 border-t text-sm`}>
          <div className="flex items-center justify-between">
            <span>Ready • Lines: {content.split('\n').length} • Language: {language}</span>
            <span>Characters: {content.length}</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App