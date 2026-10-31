<div align="center">

<a href="https://motionvideo.xyz">
  <img src="../../apps/web/public/og.jpg" alt="MotionVideo: vídeos de motion design criados com IA e código." width="800" />
</a>

# MotionVideo

**Motion design escrito em código.**

Um diretório de vídeos de motion design criados com IA e código, com os prompts e as skills por trás deles.<br /> Além disso, skills de agente que ensinam ao seu agente de programação timing, easing e coreografia.

[Site](https://motionvideo.xyz) · [Sobre](https://motionvideo.xyz/about) · [Contato](https://motionvideo.xyz/contact) · [Patrocinar](https://motionvideo.xyz/sponsor)

[![Estrelas no GitHub](https://img.shields.io/github/stars/motionvideohq/motionvideo.xyz?style=flat-square)](https://github.com/motionvideohq/motionvideo.xyz/stargazers) [![CI](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml/badge.svg)](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml) [![Licença: MIT](https://img.shields.io/github/license/motionvideohq/motionvideo.xyz?style=flat-square)](../../LICENSE) [![Siga no X](https://img.shields.io/badge/Follow-%40motionvideohq-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/motionvideohq)

<p align="center">
  <sub><a href="../../README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a></sub>
</p>

</div>

---

## Stack de tecnologia

| Área | Ferramentas |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, roteamento baseado em arquivos, funções de servidor) |
| UI | [shadcn/ui](https://ui.shadcn.com) sobre [Base UI](https://base-ui.com), [Tailwind CSS v4](https://tailwindcss.com), [intlayer](https://intlayer.org) |
| Hospedagem | [Cloudflare Workers](https://workers.cloudflare.com) com Durable Objects (presença ao vivo), implantado com [Wrangler](https://developers.cloudflare.com/workers/wrangler/) e Workers Builds |
| Dados | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) com [Drizzle ORM](https://orm.drizzle.team), [R2](https://developers.cloudflare.com/r2/) para assets de vídeo e uploads |
| Autenticação | [Better Auth](https://www.better-auth.com) (códigos de acesso por e-mail), [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| E-mail | [Resend](https://resend.com), Cloudflare Email Routing (entrada) |
| Pagamentos | [Dodo Payments](https://dodopayments.com) como merchant of record (pacote de skills, patrocínios, vagas de emprego) |
| Análise | [PostHog](https://posthog.com) |
| Ferramentas | [pnpm](https://pnpm.io), [Vite](https://vite.dev), [Oxlint](https://oxc.rs) + [Oxfmt](https://oxc.rs) via [Ultracite](https://www.ultracite.ai), [Lefthook](https://lefthook.dev) |

## Contribuição

Contribuições são bem-vindas. Consulte o [CONTRIBUTING.md](../../CONTRIBUTING.md) para configuração local, verificações, arquivos gerados e o processo de pull request. Use as [issues](https://github.com/motionvideohq/motionvideo.xyz/issues) para bugs e solicitações de recursos. Ao participar, você concorda com o [Código de Conduta](../../CODE_OF_CONDUCT.md).

## Segurança

Não abra issues públicas para vulnerabilidades de segurança. Siga o [SECURITY.md](../../SECURITY.md) e reporte-as de forma privada por meio dos GitHub Security Advisories.

## Colaboradores

[![Colaboradores](https://contrib.rocks/image?repo=motionvideohq/motionvideo.xyz)](https://github.com/motionvideohq/motionvideo.xyz/graphs/contributors)

## Licença

O código-fonte do site é distribuído sob a [Licença MIT](../../LICENSE). O pacote de skills do MotionVideo, o nome da marca e o logotipo não são cobertos por esta licença; o pacote de skills é vendido separadamente sob seus próprios [termos](https://motionvideo.xyz/terms).

## Feito por

[Aniket Pawar](https://www.aniketpawar.com) ([@alaymanguy](https://x.com/alaymanguy)), que também dirige o [Shadcn Labs](https://www.shadcn-labs.com).
