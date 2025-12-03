# Sorry - Dify Chat Application

Dify APIを利用したChatGPT風のチャットボットUIアプリケーションです。

## プロジェクト構成

```
sorry/
├── my-dify-chat/          # Next.jsアプリケーション
│   ├── app/               # Next.js App Router
│   ├── components/        # Reactコンポーネント
│   ├── public/           # 静的ファイル
│   └── package.json      # 依存関係
├── vercel.json           # Vercelデプロイ設定
└── README.md             # このファイル
```

## クイックスタート

詳細なセットアップ手順は [`my-dify-chat/README.md`](./my-dify-chat/README.md) を参照してください。

### 1. 依存関係のインストール

```bash
cd my-dify-chat
npm install
```

### 2. 環境変数の設定

`my-dify-chat/.env.local` ファイルを作成し、Dify API Keyを設定：

```env
DIFY_API_KEY=your_dify_api_key_here
```

### 3. 開発サーバーの起動

```bash
cd my-dify-chat
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## デプロイ

このプロジェクトはVercelにデプロイされています。

- **設定**: `vercel.json`で`my-dify-chat`をルートディレクトリとして指定
- **環境変数**: Vercelダッシュボードで`DIFY_API_KEY`を設定してください

## 技術スタック

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Markdown Rendering**: react-markdown

詳細は [`my-dify-chat/README.md`](./my-dify-chat/README.md) を参照してください。


