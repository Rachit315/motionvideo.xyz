<div align="center">

<a href="https://motionvideo.xyz">
  <img src="../../apps/web/public/og.jpg" alt="MotionVideo：用 AI 和代码制作的动态视频。" width="800" />
</a>

# MotionVideo

**用代码书写的动态设计。**

一个收录用 AI 和代码制作的动态视频的目录，附带背后的提示词与技能。<br /> 还有一套智能体技能，教你的编程智能体掌握节奏、缓动和编排。

[网站](https://motionvideo.xyz) · [关于](https://motionvideo.xyz/about) · [联系](https://motionvideo.xyz/contact) · [赞助](https://motionvideo.xyz/sponsor)

[![GitHub 星标](https://img.shields.io/github/stars/motionvideohq/motionvideo.xyz?style=flat-square)](https://github.com/motionvideohq/motionvideo.xyz/stargazers) [![CI](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml/badge.svg)](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml) [![许可证：MIT](https://img.shields.io/github/license/motionvideohq/motionvideo.xyz?style=flat-square)](../../LICENSE) [![在 X 上关注我们](https://img.shields.io/badge/Follow-%40motionvideohq-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/motionvideohq)

<p align="center">
  <sub><a href="../../README.md">English</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.pt.md">Português</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a></sub>
</p>

</div>

---

## 技术栈

| 领域 | 工具 |
| --- | --- |
| 框架 | [TanStack Start](https://tanstack.com/start)（React 19、基于文件的路由、服务器函数） |
| UI | [shadcn/ui](https://ui.shadcn.com) 基于 [Base UI](https://base-ui.com)，[Tailwind CSS v4](https://tailwindcss.com)，[intlayer](https://intlayer.org) |
| 托管 | [Cloudflare Workers](https://workers.cloudflare.com) 与 Durable Objects（实时在线状态），使用 [Wrangler](https://developers.cloudflare.com/workers/wrangler/) 和 Workers Builds 部署 |
| 数据 | [Cloudflare D1](https://developers.cloudflare.com/d1/)（SQLite）配合 [Drizzle ORM](https://orm.drizzle.team)，[R2](https://developers.cloudflare.com/r2/) 用于视频资源和上传 |
| 身份验证 | [Better Auth](https://www.better-auth.com)（邮件登录码），[Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| 电子邮件 | [Resend](https://resend.com)，Cloudflare Email Routing（入站） |
| 支付 | [Dodo Payments](https://dodopayments.com) 作为记录商户（技能包、赞助、职位发布） |
| 分析 | [PostHog](https://posthog.com) |
| 工具 | [pnpm](https://pnpm.io)，[Vite](https://vite.dev)，通过 [Ultracite](https://www.ultracite.ai) 使用的 [Oxlint](https://oxc.rs) + [Oxfmt](https://oxc.rs)，[Lefthook](https://lefthook.dev) |

## 贡献

欢迎贡献。本地环境配置、检查、生成文件以及拉取请求流程请参阅 [CONTRIBUTING.md](../../CONTRIBUTING.md)。如需报告错误或提出功能请求，请使用 [issues](https://github.com/motionvideohq/motionvideo.xyz/issues)。参与即表示你同意遵守[行为准则](../../CODE_OF_CONDUCT.md)。

## 安全

请勿通过公开 issue 报告安全漏洞。请遵循 [SECURITY.md](../../SECURITY.md)，并通过 GitHub Security Advisories 私下报告。

## 贡献者

[![贡献者](https://contrib.rocks/image?repo=motionvideohq/motionvideo.xyz)](https://github.com/motionvideohq/motionvideo.xyz/graphs/contributors)

## 许可证

网站源代码以 [MIT 许可证](../../LICENSE) 发布。MotionVideo 技能包、品牌名称和标志不在本许可证范围内；技能包依据其自身的[条款](https://motionvideo.xyz/terms)单独销售。

## 作者

[Aniket Pawar](https://www.aniketpawar.com)（[@alaymanguy](https://x.com/alaymanguy)），同时经营 [Shadcn Labs](https://www.shadcn-labs.com)。
