<div align="center">

<a href="https://motionvideo.xyz">
  <img src="../../apps/web/public/og.jpg" alt="MotionVideo : des vidéos de motion design créées avec l'IA et du code." width="800" />
</a>

# MotionVideo

**Le motion design, écrit en code.**

Un répertoire de vidéos de motion design créées avec l'IA et du code, avec les prompts et les skills qui les accompagnent.<br /> Plus des skills d'agent qui enseignent à votre agent de codage le timing, l'easing et la chorégraphie.

[Site web](https://motionvideo.xyz) · [À propos](https://motionvideo.xyz/about) · [Contact](https://motionvideo.xyz/contact) · [Sponsor](https://motionvideo.xyz/sponsor)

[![Étoiles GitHub](https://img.shields.io/github/stars/motionvideohq/motionvideo.xyz?style=flat-square)](https://github.com/motionvideohq/motionvideo.xyz/stargazers) [![CI](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml/badge.svg)](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml) [![Licence : MIT](https://img.shields.io/github/license/motionvideohq/motionvideo.xyz?style=flat-square)](../../LICENSE) [![Suivez-nous sur X](https://img.shields.io/badge/Follow-%40motionvideohq-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/motionvideohq)

<p align="center">
  <sub><a href="../../README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.pt.md">Português</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a></sub>
</p>

</div>

---

## Stack technique

| Domaine | Outils |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, routage basé sur les fichiers, fonctions serveur) |
| UI | [shadcn/ui](https://ui.shadcn.com) sur [Base UI](https://base-ui.com), [Tailwind CSS v4](https://tailwindcss.com), [intlayer](https://intlayer.org) |
| Hébergement | [Cloudflare Workers](https://workers.cloudflare.com) avec Durable Objects (présence en direct), déployé avec [Wrangler](https://developers.cloudflare.com/workers/wrangler/) et Workers Builds |
| Données | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) avec [Drizzle ORM](https://orm.drizzle.team), [R2](https://developers.cloudflare.com/r2/) pour les ressources vidéo et les téléversements |
| Authentification | [Better Auth](https://www.better-auth.com) (codes de connexion par e-mail), [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| E-mail | [Resend](https://resend.com), Cloudflare Email Routing (entrant) |
| Paiements | [Dodo Payments](https://dodopayments.com) en tant que merchant of record (pack de skills, parrainages, offres d'emploi) |
| Analyse | [PostHog](https://posthog.com) |
| Outillage | [pnpm](https://pnpm.io), [Vite](https://vite.dev), [Oxlint](https://oxc.rs) + [Oxfmt](https://oxc.rs) via [Ultracite](https://www.ultracite.ai), [Lefthook](https://lefthook.dev) |

## Contribuer

Les contributions sont les bienvenues. Consultez [CONTRIBUTING.md](../../CONTRIBUTING.md) pour la configuration locale, les vérifications, les fichiers générés et le processus de pull request. Utilisez les [issues](https://github.com/motionvideohq/motionvideo.xyz/issues) pour les bugs et les demandes de fonctionnalités. En participant, vous acceptez le [Code de conduite](../../CODE_OF_CONDUCT.md).

## Sécurité

N'ouvrez pas d'issue publique pour les vulnérabilités de sécurité. Suivez [SECURITY.md](../../SECURITY.md) et signalez-les de manière privée via GitHub Security Advisories.

## Contributeurs

[![Contributeurs](https://contrib.rocks/image?repo=motionvideohq/motionvideo.xyz)](https://github.com/motionvideohq/motionvideo.xyz/graphs/contributors)

## Licence

Le code source du site web est publié sous la [licence MIT](../../LICENSE). Le pack de skills MotionVideo, le nom de la marque et le logotype ne sont pas couverts par cette licence ; le pack de skills est vendu séparément selon ses propres [conditions](https://motionvideo.xyz/terms).

## Réalisé par

[Aniket Pawar](https://www.aniketpawar.com) ([@alaymanguy](https://x.com/alaymanguy)), qui dirige également [Shadcn Labs](https://www.shadcn-labs.com).
