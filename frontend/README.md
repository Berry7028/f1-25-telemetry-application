# F1 2025 Telemetry Frontend

Next.js, TailwindCSS, and Mantineを使用したF1 2025テレメトリーダッシュボードのフロントエンド。

## 機能

- **ライブダッシュボード**: リアルタイムでドライバーのテレメトリーデータを表示
  - スピード、ギア、RPM
  - タイヤとブレーキの温度
  - ERS充電とDRS使用可能状態
  - 燃料残量とミックス設定
  
- **リーダーボード**: 全ドライバーの順位と統計を表示

- **ライブトラックマップ**: 
  - 全ドライバーの位置をリアルタイムで表示
  - チームカラーでドライバーを識別
  - イベント通知（ファステストラップ、ペナルティなど）

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API接続

フロントエンドは以下のエンドポイントに接続します：

- `GET /api/session` - セッション情報
- `GET /api/players` - 全プレイヤーの詳細なテレメトリーデータ
- `GET /api/telemetry/motion` - プレイヤーの位置データ

デフォルトのAPI URLは `http://localhost:8000` です。
バックエンドAPIサーバーが起動していることを確認してください。

## 技術スタック

- **Next.js 16** - Reactフレームワーク
- **Mantine 8** - UIコンポーネントライブラリ
- **TailwindCSS 4** - ユーティリティファーストCSS
- **TypeScript** - 型安全性
- **Tabler Icons** - アイコンライブラリ

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
