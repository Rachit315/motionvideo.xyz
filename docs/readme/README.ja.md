<div align="center">

<a href="https://motionvideo.xyz">
  <img src="../../apps/web/public/og.jpg" alt="MotionVideo：AI とコードで制作されたモーションビデオ。" width="800" />
</a>

# MotionVideo

**コードで書くモーションデザイン。**

AI とコードで制作されたモーションビデオのディレクトリ。それぞれの背景にあるプロンプトとスキルも掲載しています。<br /> さらに、コーディングエージェントにタイミング、イージング、コレオグラフィを教えるエージェントスキルも提供します。

[ウェブサイト](https://motionvideo.xyz) · [概要](https://motionvideo.xyz/about) · [お問い合わせ](https://motionvideo.xyz/contact) · [スポンサー](https://motionvideo.xyz/sponsor)

[![GitHub スター](https://img.shields.io/github/stars/motionvideohq/motionvideo.xyz?style=flat-square)](https://github.com/motionvideohq/motionvideo.xyz/stargazers) [![CI](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml/badge.svg)](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml) [![ライセンス: MIT](https://img.shields.io/github/license/motionvideohq/motionvideo.xyz?style=flat-square)](../../LICENSE) [![X でフォロー](https://img.shields.io/badge/Follow-%40motionvideohq-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/motionvideohq)

<p align="center">
  <sub><a href="../../README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.pt.md">Português</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a></sub>
</p>

</div>

---

## 技術スタック

| 分野 | ツール |
| --- | --- |
| フレームワーク | [TanStack Start](https://tanstack.com/start)（React 19、ファイルベースルーティング、サーバー関数） |
| UI | [Base UI](https://base-ui.com) 上の [shadcn/ui](https://ui.shadcn.com)、[Tailwind CSS v4](https://tailwindcss.com)、[intlayer](https://intlayer.org) |
| ホスティング | [Cloudflare Workers](https://workers.cloudflare.com) と Durable Objects（リアルタイムプレゼンス）。[Wrangler](https://developers.cloudflare.com/workers/wrangler/) と Workers Builds でデプロイ |
| データ | [Cloudflare D1](https://developers.cloudflare.com/d1/)（SQLite）と [Drizzle ORM](https://orm.drizzle.team)、動画アセットとアップロード用の [R2](https://developers.cloudflare.com/r2/) |
| 認証 | [Better Auth](https://www.better-auth.com)（メールサインインコード）、[Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| メール | [Resend](https://resend.com)、Cloudflare Email Routing（受信） |
| 決済 | [Dodo Payments](https://dodopayments.com)（マーチャント・オブ・レコード：スキルバンドル、スポンサーシップ、求人掲載） |
| 分析 | [PostHog](https://posthog.com) |
| ツール | [pnpm](https://pnpm.io)、[Vite](https://vite.dev)、[Ultracite](https://www.ultracite.ai) 経由の [Oxlint](https://oxc.rs) + [Oxfmt](https://oxc.rs)、[Lefthook](https://lefthook.dev) |

## コントリビューション

コントリビューションを歓迎します。ローカル環境のセットアップ、チェック、生成されるファイル、プルリクエストの流れについては [CONTRIBUTING.md](../../CONTRIBUTING.md) を参照してください。バグや機能リクエストには [issues](https://github.com/motionvideohq/motionvideo.xyz/issues) を使用してください。参加することで、[行動規範](../../CODE_OF_CONDUCT.md) に同意したものとみなされます。

## セキュリティ

セキュリティ上の脆弱性は公開 issue で報告しないでください。[SECURITY.md](../../SECURITY.md) に従い、GitHub Security Advisories を通じて非公開で報告してください。

## コントリビューター

[![コントリビューター](https://contrib.rocks/image?repo=motionvideohq/motionvideo.xyz)](https://github.com/motionvideohq/motionvideo.xyz/graphs/contributors)

## ライセンス

ウェブサイトのソースコードは [MIT ライセンス](../../LICENSE) の下で公開されています。MotionVideo スキルパック、ブランド名、ロゴマークはこのライセンスの対象外です。スキルパックは独自の[利用規約](https://motionvideo.xyz/terms)に基づいて別途販売されます。

## 制作

[Aniket Pawar](https://www.aniketpawar.com)（[@alaymanguy](https://x.com/alaymanguy)）。[Shadcn Labs](https://www.shadcn-labs.com) も運営しています。
