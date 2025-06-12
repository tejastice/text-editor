# 🚨 緊急ワーカー作業指示 - Issue #1実装

## 👨‍💼 ディレクターからの指示

### 📋 作業概要
**Issue #1**: React基本コンポーネント作成を**今すぐ**開始してください。

### 🎯 具体的な実装指示

#### 1. 【15分】基本ファイル構造作成
```bash
mkdir -p src/renderer/styles src/renderer/components src/renderer/store
```

#### 2. 【20分】src/renderer/index.html
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

#### 3. 【15分】src/renderer/main.tsx
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

#### 4. 【25分】src/renderer/App.tsx
```typescript
import React from 'react'

function App() {
  return (
    <div className="h-screen bg-gray-900 text-white">
      <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center px-2">
        <span className="text-sm">Mac Text Editor</span>
      </div>
      <div className="flex-1 p-4">
        <h1 className="text-xl mb-4">Mac Text Editor</h1>
        <p className="text-gray-300">Ready for development!</p>
      </div>
    </div>
  )
}

export default App
```

#### 5. 【15分】src/renderer/styles/globals.css
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
```

### ⚡ 実行手順

1. **上記ファイルを順番に作成**
2. **動作確認**: `npm run dev`
3. **品質確認**: `npm run typecheck && npm run lint`
4. **報告**: 各ステップ完了時にコメント

### 🎯 成功基準
- [ ] Electronアプリが起動する
- [ ] 「Mac Text Editor」画面が表示される
- [ ] TypeScriptエラーゼロ
- [ ] ESLintエラーゼロ

### 📊 報告要求
**30分後**に以下形式で報告：

```
## Issue #1 作業報告

**進捗**: [X/5] ファイル完了
**状況**: 
- ✅ 完了: [ファイル名]
- 🔄 作業中: [ファイル名]
- ❌ エラー: [問題内容]

**動作確認結果**: 
- アプリ起動: ✅/❌
- TypeScript: ✅/❌
- ESLint: ✅/❌

**次の30分の予定**: [予定作業]
**支援要請**: [必要な場合]
```

### 🚨 エラー発生時
**即座に報告**してください：
- エラーメッセージ
- 発生したファイル・行
- 試行した解決方法

---

**指示者**: プロジェクトディレクター  
**期限**: 2時間以内  
**品質**: 妥協なし  

**開始してください！**