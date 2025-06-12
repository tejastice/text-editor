# GitHub開発フロー：役割定義と作業手順

## 🚨 最重要：作業開始前の必須確認事項

### ワーカーの鉄則
```
1. 作業開始前に必ずGitHubのIssuesを確認する
2. Issueがない場合は待機する（勝手に作業しない）
3. 自分で判断せず、ディレクターの指示に従う
4. .gitignoreを最初に作成する（node_modules等を除外）
5. 作業完了後は必ずIssueをクローズする
```

### ディレクターの鉄則
```
1. 必ずGitHub Issuesで作業指示を出す
2. ワーカーが確認できるように明確な指示を書く
3. 優先度とタスクの詳細を必ず記載する
4. 完了したIssueの成果物を確認してクローズする
5. 次のIssueを発行する前に前のIssueの完了を確認する
```

---

## 初期セットアップ

### リポジトリ構成
- **メインリポジトリ**: プロダクトコードを管理
- **Issues**: GitHubのIssues機能でタスク管理（別リポジトリ不要）

### 必須の初期ファイル（プロジェクト開始時に作成）
```bash
# .gitignoreファイル（必須）
node_modules/
dist/
build/
.env
.env.local
*.log
.DS_Store
coverage/
.vscode/
.idea/
```

### ブランチ戦略
- `main`: 本番環境相当
- `develop`: 開発ブランチ
- `feature/*`: 機能開発ブランチ
- `fix/*`: バグ修正ブランチ

---

## ワーカー（開発者）の作業指示

### 🔴 作業開始チェックリスト（必須）

```bash
# 1. リポジトリの最新状態を取得
git checkout develop
git pull origin develop

# 2. GitHubでIssuesを確認
# ブラウザで https://github.com/[organization]/[repository]/issues を開く
# または
gh issue list --assignee @me

# 3. Issueがない場合
echo "ディレクターからのIssue発行を待機中..."
# 待機する（勝手に作業を始めない）
```

### 1. 日次作業フロー

#### 作業開始前の確認（厳守）
1. **プロジェクト初回作業時は.gitignoreを作成**
   ```bash
   # 最初に必ず実行
   echo "node_modules/
   dist/
   build/
   .env
   .env.local
   *.log
   .DS_Store
   coverage/
   .vscode/
   .idea/" > .gitignore
   ```

2. **必ずIssueを確認してから作業開始**
   ```bash
   # CLIでの確認方法
   gh issue list --assignee @me --state open
   ```

3. **Issueがない場合は作業しない**
   - ディレクターに確認を求める
   - 勝手な判断での実装は禁止

#### Issue対応手順
1. **Issue選択とステータス更新**
   ```bash
   # Issueにコメントで作業開始を宣言
   gh issue comment [ISSUE_NUMBER] --body "作業を開始します"
   ```

2. **ブランチ作成**
   ```bash
   # Issue番号を必ず含める
   git checkout -b feature/issue-[ISSUE_NUMBER]-[簡潔な説明]
   ```

3. **実装作業**
   - Issueに書かれた受け入れ条件を満たすように実装
   - スコープ外の作業は行わない

4. **作業完了時のIssueクローズ**
   ```bash
   # PRマージ後、Issueをクローズ
   gh issue close [ISSUE_NUMBER] --comment "完了しました。PRは #[PR_NUMBER] でマージ済みです。"
   ```

5. **成果物の確認**
   - 実装した機能のスクリーンショットを添付
   - テスト結果を報告
   - 動作確認の手順を記載

### 2. コミットルール

#### コミット前の必須確認
```bash
# 1. 不要なファイルが含まれていないか確認
git status

# 2. node_modulesが含まれていたら除外
git rm -r --cached node_modules/

# 3. .gitignoreが適切に設定されているか確認
cat .gitignore

# 4. 適切なファイルのみをステージング
git add src/ package.json package-lock.json README.md など
```

#### コミットメッセージ規則
- `feat: 新機能追加`
- `fix: バグ修正`
- `docs: ドキュメント更新`
- `style: コードスタイル修正`
- `refactor: リファクタリング`
- `test: テスト追加・修正`
- `chore: ビルド設定等の修正`

### 3. Issue管理とクローズ手順

#### Issue対応完了時の手順
1. **動作確認**
   ```bash
   # テスト実行
   npm test
   # ビルド確認
   npm run build
   # Lintチェック
   npm run lint
   ```

2. **PRの説明に含める内容**
   ```markdown
   ## 概要
   Closes #[ISSUE_NUMBER]
   
   ## 実装内容
   - 実装した機能の説明
   - 変更したファイル
   
   ## 動作確認
   - [ ] ローカルで動作確認済み
   - [ ] テスト追加済み
   - [ ] Lint/Format確認済み
   
   ## スクリーンショット
   （該当する場合は添付）
   ```

3. **Issueクローズ確認**
   - PRがマージされたら自動的にIssueがクローズされることを確認
   - されない場合は手動でクローズ

---

## ディレクター（レビュアー/PM）の作業指示

### 🔴 プロジェクト開始時の必須作業

1. **初回Issue作成（最重要）**
   ```bash
   # プロジェクト開始時は必ず最初のIssueを作成
   gh issue create \
     --title "プロジェクト初期セットアップ" \
     --body "詳細な作業内容..." \
     --assignee [ワーカー]
   ```

2. **ラベル作成**
   ```bash
   gh label create "critical" --color "FF0000"
   gh label create "high" --color "FFA500"
   gh label create "medium" --color "FFFF00"
   gh label create "low" --color "00FF00"
   ```

### 1. Issue作成の必須項目

#### Issueテンプレート（厳格版）
```markdown
## 🎯 タスク概要
[1-2文で明確に記載]

## 📋 具体的な作業内容
1. [ ] 作業項目1（具体的に）
2. [ ] 作業項目2（具体的に）
3. [ ] 作業項目3（具体的に）

## ⏰ 期限
- 開始予定: YYYY/MM/DD HH:MM
- 完了期限: YYYY/MM/DD HH:MM

## 🚦 優先度
- [x] Critical（本日中）
- [ ] High（2日以内）
- [ ] Medium（1週間以内）
- [ ] Low（期限なし）

## ✅ 受け入れ条件
- [ ] 条件1（測定可能な形で）
- [ ] 条件2（測定可能な形で）

## 🚫 やらないこと（スコープ外）
- スコープ外の内容を明記

## 📎 参考資料
- 必要なドキュメントやリンク
```

### 2. 進捗管理

#### 日次確認事項
1. **朝のIssue確認**
   ```bash
   # 全Issueの状態確認
   gh issue list --state all
   
   # 進捗確認が必要なIssue
   gh issue list --label "in-progress"
   ```

2. **ブロッカー対応**
   - ワーカーからの質問には1時間以内に回答
   - ブロッカーは最優先で解決

### 3. Issue完了確認プロセス

#### ワーカーがIssue完了時に必ず実行
```bash
# 1. 最終動作確認
npm test && npm run build && npm run lint

# 2. Issue完了報告コメント
gh issue comment [ISSUE_NUMBER] --body "
## 完了報告
- ✅ 実装完了
- ✅ テスト実行: パス
- ✅ ビルド確認: 成功
- ✅ Lint確認: エラーなし

### 成果物
- [実装したファイルのリスト]
- [動作確認手順]

PR: #[PR_NUMBER]
"
```

#### ディレクターのIssue確認手順
1. **PR内容の確認**
   - 受け入れ条件を満たしているか
   - コードの品質は適切か
   - テストは追加されているか

2. **動作確認**
   ```bash
   # ブランチをチェックアウト
   git checkout feature/issue-[NUMBER]
   # 動作確認
   npm install && npm run dev
   ```

3. **Issue状態の更新**
   ```bash
   # 承認の場合
   gh issue close [ISSUE_NUMBER] --comment "確認完了。良い実装です！"
   
   # 修正が必要な場合
   gh issue comment [ISSUE_NUMBER] --body "以下の修正をお願いします: [修正内容]"
   ```

---

## 作業フロー図（改訂版）

```
ディレクター                    ワーカー
    |                             |
    |-- 1. Issue作成 ------------>|
    |                             |-- 2. Issue確認
    |                             |-- 3. .gitignore作成（初回）
    |                             |-- 4. 作業開始宣言
    |                             |-- 5. ブランチ作成
    |                             |-- 6. 実装
    |<-- 7. 質問（あれば）--------|
    |-- 8. 回答 ---------------->|
    |                             |-- 9. git status確認
    |                             |-- 10. 適切なコミット
    |                             |-- 11. PR作成
    |<-- 12. 完了報告 ------------|
    |-- 13. 動作確認 ------------>|
    |-- 14. Issue確認&クローズ -->|
    |                             |
    |-- 15. 次のIssue作成 ------->|
```

---

## トラブルシューティング

### ワーカーがIssueなしで作業を始めた場合
1. 即座に作業を停止させる
2. 作成したコードは一旦退避
3. 正式なIssueを作成してから再開

### ディレクターがIssueを作成し忘れた場合
1. ワーカーは作業せずに待機
2. ディレクターに確認メッセージを送る
3. 口頭指示では作業しない

---

## 成功のための重要ポイント

### ワーカー向け
- **Issue駆動開発**: Issueがなければコードを書かない
- **スコープ厳守**: Issueに書かれたことだけを実装
- **定期報告**: 進捗を細かく報告

### ディレクター向け
- **明確な指示**: 曖昧さを排除した具体的なIssue
- **迅速な対応**: ワーカーの質問には素早く回答
- **進捗確認**: 定期的にIssueの状態を確認
