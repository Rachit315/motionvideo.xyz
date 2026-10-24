<div align="center">

<a href="https://motionvideo.xyz">
  <img src="../../apps/web/public/og.jpg" alt="MotionVideo: моушн-видео, созданные с помощью ИИ и кода." width="800" />
</a>

# MotionVideo

**Моушн-дизайн, написанный кодом.**

Каталог моушн-видео, созданных с помощью ИИ и кода, с промптами и навыками, которые стоят за ними.<br /> А также навыки агентов, которые учат вашего агента-программиста таймингу, easing и хореографии.

[Сайт](https://motionvideo.xyz) · [О проекте](https://motionvideo.xyz/about) · [Контакты](https://motionvideo.xyz/contact) · [Стать спонсором](https://motionvideo.xyz/sponsor)

[![Звёзды на GitHub](https://img.shields.io/github/stars/motionvideohq/motionvideo.xyz?style=flat-square)](https://github.com/motionvideohq/motionvideo.xyz/stargazers) [![CI](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml/badge.svg)](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml) [![Лицензия: MIT](https://img.shields.io/github/license/motionvideohq/motionvideo.xyz?style=flat-square)](../../LICENSE) [![Подписаться на X](https://img.shields.io/badge/Follow-%40motionvideohq-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/motionvideohq)

<p align="center">
  <sub><a href="../../README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.pt.md">Português</a> · <a href="README.de.md">Deutsch</a></sub>
</p>

</div>

---

## Технологический стек

| Область | Инструменты |
| --- | --- |
| Фреймворк | [TanStack Start](https://tanstack.com/start) (React 19, файловая маршрутизация, серверные функции) |
| UI | [shadcn/ui](https://ui.shadcn.com) на [Base UI](https://base-ui.com), [Tailwind CSS v4](https://tailwindcss.com), [intlayer](https://intlayer.org) |
| Хостинг | [Cloudflare Workers](https://workers.cloudflare.com) с Durable Objects (присутствие в реальном времени), развёртывание через [Wrangler](https://developers.cloudflare.com/workers/wrangler/) и Workers Builds |
| Данные | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) с [Drizzle ORM](https://orm.drizzle.team), [R2](https://developers.cloudflare.com/r2/) для видеоресурсов и загрузок |
| Аутентификация | [Better Auth](https://www.better-auth.com) (коды входа по электронной почте), [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| Электронная почта | [Resend](https://resend.com), Cloudflare Email Routing (входящие) |
| Платежи | [Dodo Payments](https://dodopayments.com) как merchant of record (набор навыков, спонсорство, вакансии) |
| Аналитика | [PostHog](https://posthog.com) |
| Инструменты | [pnpm](https://pnpm.io), [Vite](https://vite.dev), [Oxlint](https://oxc.rs) + [Oxfmt](https://oxc.rs) через [Ultracite](https://www.ultracite.ai), [Lefthook](https://lefthook.dev) |

## Участие в проекте

Мы рады вкладу в проект. Инструкции по локальной настройке, проверкам, генерируемым файлам и процессу pull request см. в [CONTRIBUTING.md](../../CONTRIBUTING.md). Для сообщений об ошибках и предложений функций используйте [issues](https://github.com/motionvideohq/motionvideo.xyz/issues). Участвуя, вы соглашаетесь соблюдать [Кодекс поведения](../../CODE_OF_CONDUCT.md).

## Безопасность

Пожалуйста, не создавайте публичные issues для уязвимостей безопасности. Следуйте [SECURITY.md](../../SECURITY.md) и сообщайте о них приватно через GitHub Security Advisories.

## Участники

[![Участники](https://contrib.rocks/image?repo=motionvideohq/motionvideo.xyz)](https://github.com/motionvideohq/motionvideo.xyz/graphs/contributors)

## Лицензия

Исходный код сайта распространяется по [лицензии MIT](../../LICENSE). Набор навыков MotionVideo, название бренда и логотип не подпадают под действие этой лицензии; набор навыков продаётся отдельно на собственных [условиях](https://motionvideo.xyz/terms).

## Автор

[Aniket Pawar](https://www.aniketpawar.com) ([@alaymanguy](https://x.com/alaymanguy)), также руководит [Shadcn Labs](https://www.shadcn-labs.com).
