# 技術実装ガイド - ワーカー向け詳細資料

## 🚀 検証済みプロジェクト設定

### ✅ 動作確認済み
- ✅ npm install - 正常完了
- ✅ TypeScript コンパイル - エラーゼロ
- ✅ ESLint - エラーゼロ
- ✅ セキュリティ脆弱性 - 修正済み

## 📁 実装必須ファイル

### 1. `src/renderer/index.html`
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mac Text Editor</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./main.tsx"></script>
</body>
</html>
```

### 2. `src/renderer/main.tsx`
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### 3. `src/renderer/App.tsx`
```typescript
import React, { useEffect } from 'react'
import { EditorLayout } from './components/EditorLayout'
import { useEditorStore } from './store/editorStore'

function App() {
  const { initializeApp } = useEditorStore()

  useEffect(() => {
    initializeApp()
    
    // Electronメニューイベントのリスナー設定
    if (window.electronAPI) {
      window.electronAPI.onMenuAction((action: string) => {
        console.log('Menu action:', action)
        // TODO: アクション処理の実装
      })
    }
  }, [initializeApp])

  return (
    <div className="h-screen bg-gray-900 text-white">
      <EditorLayout />
    </div>
  )
}

export default App
```

### 4. `src/renderer/styles/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html, body, #root {
    @apply h-full w-full m-0 p-0;
  }
  
  body {
    @apply font-mono;
  }
}

@layer components {
  .editor-container {
    @apply h-full w-full relative;
  }
  
  .tab-bar {
    @apply flex bg-gray-800 border-b border-gray-700;
  }
  
  .tab-item {
    @apply px-4 py-2 border-r border-gray-700 cursor-pointer hover:bg-gray-700;
  }
  
  .tab-item.active {
    @apply bg-gray-600;
  }
  
  .menu-bar {
    @apply h-8 bg-gray-800 border-b border-gray-700 flex items-center px-2;
  }
}
```

## 🧩 コンポーネント実装パターン

### EditorLayout コンポーネント
```typescript
// src/renderer/components/EditorLayout.tsx
import React from 'react'
import { MonacoEditor } from './MonacoEditor'
import { TabBar } from './TabBar'
import { MenuBar } from './MenuBar'

export const EditorLayout: React.FC = () => {
  return (
    <div className="editor-container">
      <MenuBar />
      <TabBar />
      <MonacoEditor />
    </div>
  )
}
```

### Monaco Editor コンポーネント
```typescript
// src/renderer/components/MonacoEditor.tsx
import React from 'react'
import Editor from '@monaco-editor/react'
import { useEditorStore } from '../store/editorStore'

export const MonacoEditor: React.FC = () => {
  const { 
    activeFile, 
    config, 
    updateFileContent 
  } = useEditorStore()

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFile) {
      updateFileContent(activeFile.path, value)
    }
  }

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={activeFile?.language || 'typescript'}
        value={activeFile?.content || '// New file\n'}
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
        }}
      />
    </div>
  )
}
```

## 🗂️ Zustand ストア実装

### エディタストア
```typescript
// src/renderer/store/editorStore.ts
import { create } from 'zustand'
import { FileInfo, EditorConfig, AppState } from '@shared/types'

interface EditorStore extends AppState {
  initializeApp: () => void
  updateFileContent: (path: string, content: string) => void
  openFile: (file: FileInfo) => void
  closeFile: (path: string) => void
  setActiveFile: (index: number) => void
  updateConfig: (config: Partial<EditorConfig>) => void
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  openFiles: [
    {
      name: 'Untitled-1',
      path: 'untitled-1',
      content: '// Welcome to Mac Text Editor\n',
      isDirty: false,
      language: 'typescript'
    }
  ],
  activeFileIndex: 0,
  config: {
    theme: 'dark',
    fontSize: 14,
    fontFamily: 'SF Mono, Monaco, Consolas, monospace',
    wordWrap: true,
    minimap: true,
    lineNumbers: true,
  },

  initializeApp: () => {
    console.log('App initialized')
  },

  updateFileContent: (path: string, content: string) => {
    set((state) => ({
      openFiles: state.openFiles.map((file) =>
        file.path === path
          ? { ...file, content, isDirty: file.content !== content }
          : file
      ),
    }))
  },

  openFile: (file: FileInfo) => {
    const { openFiles } = get()
    const existingIndex = openFiles.findIndex(f => f.path === file.path)
    
    if (existingIndex >= 0) {
      set({ activeFileIndex: existingIndex })
    } else {
      set((state) => ({
        openFiles: [...state.openFiles, file],
        activeFileIndex: state.openFiles.length,
      }))
    }
  },

  closeFile: (path: string) => {
    set((state) => {
      const newFiles = state.openFiles.filter(f => f.path !== path)
      const newActiveIndex = Math.min(state.activeFileIndex, newFiles.length - 1)
      return {
        openFiles: newFiles,
        activeFileIndex: Math.max(0, newActiveIndex),
      }
    })
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
```

## 🎨 Tailwind設定

### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

## 🔧 開発コマンド

### 推奨開発フロー
```bash
# 1. 依存関係確認
npm install

# 2. 型チェック
npm run typecheck

# 3. コード品質チェック
npm run lint

# 4. 開発サーバー起動
npm run dev

# 5. 自動修正（必要に応じて）
npm run lint:fix
```

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. TypeScriptエラー
```
エラー: Property 'electronAPI' does not exist on type 'Window'
解決: src/shared/types.ts の global 宣言を確認
```

#### 2. Monaco Editor読み込みエラー
```
エラー: Cannot resolve '@monaco-editor/react'
解決: npm install @monaco-editor/react
```

#### 3. Electronウィンドウが開かない
```
エラー: Failed to load resource
解決: メインプロセスとレンダラープロセスのポート確認
```

#### 4. ホットリロードが動作しない
```
解決: Vite設定のserver.portとElectronのloadURLを確認
```

## 📊 品質チェックリスト

### 実装前チェック
- [ ] Node.js 18以上
- [ ] TypeScript 5.x
- [ ] 全依存関係インストール済み

### 実装中チェック
- [ ] TypeScriptエラーゼロ
- [ ] ESLintエラーゼロ
- [ ] コンソールエラーなし
- [ ] 適切な型定義使用

### 実装後チェック
- [ ] アプリケーション正常起動
- [ ] 基本UI表示確認
- [ ] エディタ動作確認
- [ ] メニュー動作確認

## 🎯 次のステップ

1. **基本コンポーネント完成後**
   - Monaco Editorの詳細設定
   - ファイル操作機能
   - テーマシステム

2. **機能拡張フェーズ**
   - タブ管理システム
   - ファイルツリー
   - 検索/置換機能

## 💡 実装のコツ

1. **段階的実装**: 最小限の動作から始める
2. **型安全性**: TypeScriptの恩恵を最大限活用
3. **コンポーネント分割**: 再利用可能な小さな単位で実装
4. **状態管理**: Zustandで一元化
5. **エラーハンドリング**: try-catchを適切に配置

---

**🚀 頑張って実装を進めてください！**  
**質問があればいつでもお声がけください。**