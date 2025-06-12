import React, { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import type { EditorSettings } from '../../store/editorStore'

interface MonacoEditorProps {
  value?: string
  onChange?: (value: string | undefined) => void
  language?: string
  theme?: 'light' | 'dark'
  readOnly?: boolean
  settings?: EditorSettings
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value = '',
  onChange,
  language = 'typescript',
  theme = 'dark',
  readOnly = false,
  settings
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
    updateEditorOptions(editor)
  }

  const updateEditorOptions = (editor: editor.IStandaloneCodeEditor) => {
    const options = {
      fontSize: settings?.fontSize || 14,
      lineHeight: Math.floor((settings?.fontSize || 14) * 1.4),
      minimap: { enabled: settings?.minimap ?? true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: settings?.wordWrap ? 'on' : 'off' as 'on' | 'off',
      lineNumbers: settings?.lineNumbers ? 'on' : 'off' as 'on' | 'off',
      folding: true,
      renderLineHighlight: 'all',
      selectOnLineNumbers: true,
      matchBrackets: 'always' as 'always',
      // Advanced TypeScript features
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showFunctions: true,
      },
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
      acceptSuggestionOnEnter: 'on' as 'on',
      tabCompletion: 'on' as 'on',
      parameterHints: { enabled: true },
      formatOnType: true,
      formatOnPaste: true,
    }
    
    editor.updateOptions(options)
  }

  // Update editor options when settings change
  useEffect(() => {
    if (editorRef.current && settings) {
      updateEditorOptions(editorRef.current)
    }
  }, [settings])

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
          fontSize: settings?.fontSize || 14,
          lineNumbers: settings?.lineNumbers ? 'on' : 'off',
          wordWrap: settings?.wordWrap ? 'on' : 'off',
          minimap: { enabled: settings?.minimap ?? true },
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
          // Enhanced TypeScript/JavaScript support
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showFunctions: true,
            showConstructors: true,
            showFields: true,
            showVariables: true,
            showClasses: true,
            showStructs: true,
            showInterfaces: true,
            showModules: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showUnits: true,
            showValues: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showTypes: true,
            showReferences: true,
          },
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Loading Monaco Editor...
            </div>
          </div>
        }
      />
    </div>
  )
}

export default MonacoEditor