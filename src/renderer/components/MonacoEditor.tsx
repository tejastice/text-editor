import React from 'react'
import Editor from '@monaco-editor/react'
import { useEditorStore } from '../store/editorStore'

export const MonacoEditor: React.FC = () => {
  const { 
    openFiles, 
    activeFileIndex, 
    config, 
    updateFileContent 
  } = useEditorStore()
  
  const activeFile = openFiles[activeFileIndex]

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFile) {
      updateFileContent(activeFile.path, value)
    }
  }

  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-gray-400">
        <div className="text-center">
          <h2 className="text-xl mb-2">No file open</h2>
          <p>Open a file to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={activeFile.language}
        value={activeFile.content}
        onChange={handleEditorChange}
        theme={config.theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          fontSize: config.fontSize,
          fontFamily: config.fontFamily,
          wordWrap: config.wordWrap ? 'on' : 'off',
          minimap: { enabled: config.minimap },
          lineNumbers: config.lineNumbers ? 'on' : 'off',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderWhitespace: 'selection',
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: true,
          folding: true,
          foldingHighlight: true,
          showFoldingControls: 'always',
          unfoldOnClickAfterEndOfLine: true,
          colorDecorators: true,
          bracketPairColorization: {
            enabled: true
          }
        }}
        loading={
          <div className="h-full flex items-center justify-center bg-gray-900 text-gray-400">
            Loading Monaco Editor...
          </div>
        }
      />
    </div>
  )
}