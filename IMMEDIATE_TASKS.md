# 🚨 緊急作業指示書 - ワーカー向け

## 📋 現状確認
プロジェクト設定ファイルは作成済みです。以下のコンポーネント実装を **今すぐ** 開始してください。

## 🔥 最優先タスク（本日中必須）

### 1. 【Critical】React基本コンポーネント作成
**担当者**: フロントエンドワーカー  
**締切**: 2時間以内  
**チェック項目**:
- [ ] `src/renderer/index.html` 作成
- [ ] `src/renderer/main.tsx` 作成 
- [ ] `src/renderer/App.tsx` 作成
- [ ] `src/renderer/styles/globals.css` 作成

**実装仕様**:
```typescript
// src/renderer/main.tsx - 必須実装内容
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

### 2. 【Critical】Monaco Editor統合
**担当者**: フロントエンドワーカー  
**締切**: 4時間以内  
**前提条件**: タスク1完了後

**実装必須**:
- Monaco Editorコンポーネント作成
- 基本テキスト編集機能
- TypeScript言語サポート
- テーマ切り替え（light/dark）

### 3. 【High】依存関係インストールと動作確認
**担当者**: 環境構築ワーカー  
**締切**: 1時間以内

**実行コマンド**:
```bash
cd /Users/keisukeohno/Dropbox/xPersonal/project/mp0059_program/20250612_text_editor/director/text-editor
npm install
npm run dev
```

**確認事項**:
- [ ] エラーなくインストール完了
- [ ] アプリケーション起動成功
- [ ] ホットリロード動作確認

## 📝 作業報告ルール

### 各タスク完了時に報告必須
```
タスク: [タスク名]
状態: 完了/進行中/ブロック
所要時間: [実際の時間]
成果物: [作成ファイル一覧]
次の作業: [次に必要な作業]
問題点: [発生した問題・解決方法]
```

### ブロック発生時は**即座に**報告
```
🚨緊急報告🚨
タスク: [タスク名]
問題: [具体的な問題]
エラー内容: [エラーメッセージ]
試行済み解決策: [試したこと]
支援要請: [必要な支援内容]
```

## 🎯 今日の最終目標
**18:00までに達成必須**:
1. ✅ 基本Electronアプリが起動する
2. ✅ Monaco Editorでテキスト編集ができる  
3. ✅ メニューバーから新規ファイル作成可能
4. ✅ TypeScriptコンパイルエラーゼロ

## ⚠️ 重要な注意事項

1. **自己判断での設計変更禁止**  
   - 技術仕様変更は事前承認必須
   - 不明点は実装前に質問

2. **品質基準**
   - TypeScriptエラー: ゼロ必須
   - ESLintエラー: ゼロ必須  
   - 動作確認: 必須

3. **コミュニケーション**
   - 30分おきに進捗報告
   - 問題発生時は即座連絡
   - 見積もり超過時は事前相談

## 🚀 開始前チェックリスト
- [ ] Node.js 18以上インストール確認
- [ ] 作業ディレクトリ確認
- [ ] VSCode等開発環境準備完了
- [ ] GitHubアクセス権限確認

**質問・問題は遠慮なく即座に連絡してください。**  
**品質重視で進めていきましょう！**

---
*作成者: プロジェクトディレクター*  
*作成日時: 2025/6/12*