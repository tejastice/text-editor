import React, { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'

interface MonacoEditorProps {
  value?: string
  onChange?: (value: string | undefined) => void
  language?: string
  theme?: 'light' | 'dark'
  readOnly?: boolean
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value = '',
  onChange,
  language = 'typescript',
  theme = 'dark',
  readOnly = false,
}) => {
  const [isEditorReady, setIsEditorReady] = useState(false)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
    setIsEditorReady(true)
    
    // TypeScript言語設定
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 20,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      renderLineHighlight: 'all',
      selectOnLineNumbers: true,
      matchBrackets: 'always',
    })
  }

  const handleEditorChange = (value: string | undefined) => {
    onChange?.(value)
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          selectOnLineNumbers: true,
          matchBrackets: 'always',
          automaticLayout: true,
          formatOnType: true,
          formatOnPaste: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          wordBasedSuggestions: 'off',
          parameterHints: { enabled: true },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true,
          },
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading Monaco Editor...</div>
          </div>
        }
      />
    </div>
  )
}

export default MonacoEditor