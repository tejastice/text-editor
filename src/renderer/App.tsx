import React from 'react'
import { MonacoEditor } from './components/MonacoEditor'

function App() {
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center px-2 flex-shrink-0">
        <span className="text-sm">Mac Text Editor</span>
        <div className="ml-auto text-xs text-gray-400">
          TypeScript Ready • Monaco Editor
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <MonacoEditor />
      </div>
    </div>
  )
}

export default App