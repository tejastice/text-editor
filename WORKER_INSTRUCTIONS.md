# ワーカー作業指示書

## 現在のタスク: プロジェクト初期化と基本構造作成

### 作業概要
Mac向け高機能テキストエディタの開発プロジェクト初期化を行います。Electron + React + TypeScriptベースの構成で進めます。

### 今日の作業タスク（優先度順）

#### 🔴 Critical Priority

1. **依存関係インストール**
   ```bash
   npm install
   ```
   - package.jsonで定義した全依存関係をインストール
   - エラーが発生した場合は即座に報告

2. **TypeScript設定ファイル作成**
   - `tsconfig.json` (ルート用)
   - `src/main/tsconfig.json` (Electronメインプロセス用)
   - `src/renderer/tsconfig.json` (レンダラープロセス用)

3. **Vite設定ファイル作成**
   - `vite.config.ts`
   - Electronとの統合設定
   - React, TypeScript, Tailwindの設定

#### 🟡 High Priority

4. **ESLint/Prettier設定**
   - `.eslintrc.js`
   - `.prettierrc`
   - VSCode設定ファイル (`.vscode/settings.json`)

5. **Electronメインプロセス実装**
   - `src/main/main.ts`
   - ウィンドウ管理
   - メニューバー統合

6. **基本Reactアプリケーション作成**
   - `src/renderer/App.tsx`
   - `src/renderer/main.tsx`
   - `public/index.html`

#### 🟢 Medium Priority

7. **開発環境テスト**
   - `npm run dev` でアプリケーション起動確認
   - ホットリロード動作確認
   - TypeScriptコンパイル確認

### 技術仕様

#### ディレクトリ構造
```
src/
├── main/           # Electronメインプロセス
│   ├── main.ts
│   └── tsconfig.json
├── renderer/       # Reactレンダラープロセス
│   ├── App.tsx
│   ├── main.tsx
│   └── tsconfig.json
└── shared/         # 共通型定義・ユーティリティ
    └── types.ts
public/
├── index.html
└── assets/
```

#### コーディング規約

1. **TypeScript**
   - 厳格モード使用
   - any型の使用禁止
   - インターフェースによる型定義

2. **React**
   - 関数コンポーネント使用
   - TypeScriptによるprops型定義
   - カスタムフック活用

3. **CSS**
   - Tailwind CSSクラス使用
   - カスタムCSSは最小限
   - レスポンシブデザイン対応

#### 実装時の注意点

1. **セキュリティ**
   - nodeIntegration: false
   - contextIsolation: true
   - preloadスクリプト使用

2. **パフォーマンス**
   - 適切なコンポーネント分割
   - メモ化の活用
   - 不要な再レンダリング防止

3. **macOS統合準備**
   - メニューバーAPIの準備
   - ファイルシステムアクセス準備
   - ホットキー対応準備

### 品質基準

#### 必須チェック項目
- [ ] TypeScriptエラーゼロ
- [ ] ESLintエラーゼロ  
- [ ] アプリケーション正常起動
- [ ] ホットリロード動作
- [ ] 基本UIレンダリング

#### 推奨チェック項目
- [ ] コードコメントの記載
- [ ] エラーハンドリングの実装
- [ ] 開発者ツールでのエラーなし

### 完了報告フォーマット

作業完了時は以下の形式で報告してください：

```
## 作業完了報告

### 実装済み機能
- [x] 依存関係インストール
- [x] TypeScript設定
- [x] Vite設定
- [x] Electronメインプロセス
- [x] 基本Reactアプリ

### 動作確認結果
- アプリケーション起動: ✅
- TypeScriptコンパイル: ✅
- ESLint: ✅

### 次回作業への引き継��事項
- 〇〇の実装が必要
- □□の設定調整が必要

### 発生した問題・解決方法
- 問題: 〇〇エラーが発生
- 解決: □□の設定変更で対応
```

### 困った時の対応

1. **技術的な問題**
   - エラーメッセージと発生状況を詳細に報告
   - 試行した解決方法を記載
   - スタックトレースを添付

2. **仕様の不明点**
   - 該当箇所を明確に指定
   - 複数の実装案がある場合は選択肢を提示
   - 影響範囲を説明

3. **作業時間の見積もりずれ**
   - 進捗率と残り作業を報告
   - 遅延の原因分析
   - 対策案の提案

### 連絡ルール

- **即座報告**: Critical/High優先度タスクでブロッカー発生時
- **日次報告**: 作業終了時の進捗報告
- **週次報告**: 完了タスクと次週計画

---

**今日の目標**: 開発環境を完全にセットアップし、基本的なElectronアプリケーションを起動できる状態にする

**作業開始前の確認**: 
1. Node.js 18以上がインストールされているか
2. 作業ディレクトリの確認
3. 必要な開発ツールの準備

頑張って進めてください！質問があればいつでもお声がけください。