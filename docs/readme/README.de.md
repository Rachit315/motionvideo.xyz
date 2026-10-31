<div align="center">

<a href="https://motionvideo.xyz">
  <img src="../../apps/web/public/og.jpg" alt="MotionVideo: Motion-Videos, erstellt mit KI und Code." width="800" />
</a>

# MotionVideo

**Motion Design, in Code geschrieben.**

Ein Verzeichnis von Motion-Design-Videos, die mit KI und Code erstellt wurden – inklusive der Prompts und Skills dahinter.<br /> Dazu Agent-Skills, die deinem Coding-Agenten Timing, Easing und Choreografie beibringen.

[Website](https://motionvideo.xyz) · [Über uns](https://motionvideo.xyz/about) · [Kontakt](https://motionvideo.xyz/contact) · [Sponsor werden](https://motionvideo.xyz/sponsor)

[![GitHub-Sterne](https://img.shields.io/github/stars/motionvideohq/motionvideo.xyz?style=flat-square)](https://github.com/motionvideohq/motionvideo.xyz/stargazers) [![CI](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml/badge.svg)](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml) [![Lizenz: MIT](https://img.shields.io/github/license/motionvideohq/motionvideo.xyz?style=flat-square)](../../LICENSE) [![Auf X folgen](https://img.shields.io/badge/Follow-%40motionvideohq-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/motionvideohq)

<p align="center">
  <sub><a href="../../README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.pt.md">Português</a> · <a href="README.ru.md">Русский</a></sub>
</p>

</div>

---

## Technologie-Stack

| Bereich | Tools |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, dateibasiertes Routing, Serverfunktionen) |
| UI | [shadcn/ui](https://ui.shadcn.com) auf [Base UI](https://base-ui.com), [Tailwind CSS v4](https://tailwindcss.com), [intlayer](https://intlayer.org) |
| Hosting | [Cloudflare Workers](https://workers.cloudflare.com) mit Durable Objects (Live-Präsenz), bereitgestellt mit [Wrangler](https://developers.cloudflare.com/workers/wrangler/) und Workers Builds |
| Daten | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) mit [Drizzle ORM](https://orm.drizzle.team), [R2](https://developers.cloudflare.com/r2/) für Video-Assets und Uploads |
| Authentifizierung | [Better Auth](https://www.better-auth.com) (E-Mail-Anmeldecodes), [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| E-Mail | [Resend](https://resend.com), Cloudflare Email Routing (eingehend) |
| Zahlungen | [Dodo Payments](https://dodopayments.com) als Merchant of Record (Skill-Bundle, Sponsoring, Stellenanzeigen) |
| Analyse | [PostHog](https://posthog.com) |
| Tooling | [pnpm](https://pnpm.io), [Vite](https://vite.dev), [Oxlint](https://oxc.rs) + [Oxfmt](https://oxc.rs) über [Ultracite](https://www.ultracite.ai), [Lefthook](https://lefthook.dev) |

## Mitwirken

Beiträge sind willkommen. Informationen zur lokalen Einrichtung, zu Prüfungen, generierten Dateien und zum Pull-Request-Prozess findest du in [CONTRIBUTING.md](../../CONTRIBUTING.md). Verwende [Issues](https://github.com/motionvideohq/motionvideo.xyz/issues) für Fehler und Funktionswünsche. Mit der Teilnahme stimmst du dem [Verhaltenskodex](../../CODE_OF_CONDUCT.md) zu.

## Sicherheit

Bitte öffne keine öffentlichen Issues für Sicherheitslücken. Folge [SECURITY.md](../../SECURITY.md) und melde sie privat über GitHub Security Advisories.

## Mitwirkende

[![Mitwirkende](https://contrib.rocks/image?repo=motionvideohq/motionvideo.xyz)](https://github.com/motionvideohq/motionvideo.xyz/graphs/contributors)

## Lizenz

Der Quellcode der Website steht unter der [MIT-Lizenz](../../LICENSE). Das MotionVideo-Skill-Paket, der Markenname und das Logomark sind nicht von dieser Lizenz abgedeckt; das Skill-Paket wird separat zu seinen eigenen [Bedingungen](https://motionvideo.xyz/terms) verkauft.

## Erstellt von

[Aniket Pawar](https://www.aniketpawar.com) ([@alaymanguy](https://x.com/alaymanguy)), der auch [Shadcn Labs](https://www.shadcn-labs.com) betreibt.
