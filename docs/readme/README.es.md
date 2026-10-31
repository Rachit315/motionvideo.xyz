<div align="center">

<a href="https://motionvideo.xyz">
  <img src="../../apps/web/public/og.jpg" alt="MotionVideo: vídeos de motion design creados con IA y código." width="800" />
</a>

# MotionVideo

**Diseño de movimiento, escrito en código.**

Un directorio de vídeos de motion design creados con IA y código, con los prompts y las skills que hay detrás.<br /> Además, skills de agente que enseñan a tu agente de programación timing, easing y coreografía.

[Sitio web](https://motionvideo.xyz) · [Acerca de](https://motionvideo.xyz/about) · [Contacto](https://motionvideo.xyz/contact) · [Patrocinar](https://motionvideo.xyz/sponsor)

[![Estrellas en GitHub](https://img.shields.io/github/stars/motionvideohq/motionvideo.xyz?style=flat-square)](https://github.com/motionvideohq/motionvideo.xyz/stargazers) [![CI](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml/badge.svg)](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml) [![Licencia: MIT](https://img.shields.io/github/license/motionvideohq/motionvideo.xyz?style=flat-square)](../../LICENSE) [![Síguenos en X](https://img.shields.io/badge/Follow-%40motionvideohq-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/motionvideohq)

<p align="center">
  <sub><a href="../../README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.fr.md">Français</a> · <a href="README.pt.md">Português</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a></sub>
</p>

</div>

---

## Stack tecnológico

| Área | Herramientas |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, enrutamiento basado en archivos, funciones de servidor) |
| UI | [shadcn/ui](https://ui.shadcn.com) sobre [Base UI](https://base-ui.com), [Tailwind CSS v4](https://tailwindcss.com), [intlayer](https://intlayer.org) |
| Alojamiento | [Cloudflare Workers](https://workers.cloudflare.com) con Durable Objects (presencia en vivo), desplegado con [Wrangler](https://developers.cloudflare.com/workers/wrangler/) y Workers Builds |
| Datos | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) con [Drizzle ORM](https://orm.drizzle.team), [R2](https://developers.cloudflare.com/r2/) para recursos de vídeo y subidas |
| Autenticación | [Better Auth](https://www.better-auth.com) (códigos de inicio de sesión por correo), [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| Correo electrónico | [Resend](https://resend.com), Cloudflare Email Routing (entrante) |
| Pagos | [Dodo Payments](https://dodopayments.com) como merchant of record (paquete de skills, patrocinios, ofertas de empleo) |
| Analítica | [PostHog](https://posthog.com) |
| Herramientas | [pnpm](https://pnpm.io), [Vite](https://vite.dev), [Oxlint](https://oxc.rs) + [Oxfmt](https://oxc.rs) mediante [Ultracite](https://www.ultracite.ai), [Lefthook](https://lefthook.dev) |

## Contribuir

Las contribuciones son bienvenidas. Consulta [CONTRIBUTING.md](../../CONTRIBUTING.md) para la configuración local, las comprobaciones, los archivos generados y el proceso de pull request. Usa [issues](https://github.com/motionvideohq/motionvideo.xyz/issues) para errores y solicitudes de funciones. Al participar, aceptas el [Código de Conducta](../../CODE_OF_CONDUCT.md).

## Seguridad

No abras issues públicos para vulnerabilidades de seguridad. Sigue [SECURITY.md](../../SECURITY.md) y repórtalas de forma privada mediante GitHub Security Advisories.

## Colaboradores

[![Colaboradores](https://contrib.rocks/image?repo=motionvideohq/motionvideo.xyz)](https://github.com/motionvideohq/motionvideo.xyz/graphs/contributors)

## Licencia

El código fuente del sitio web se publica bajo la [Licencia MIT](../../LICENSE). El paquete de skills de MotionVideo, el nombre de la marca y el logotipo no están cubiertos por esta licencia; el paquete de skills se vende por separado bajo sus propios [términos](https://motionvideo.xyz/terms).

## Hecho por

[Aniket Pawar](https://www.aniketpawar.com) ([@alaymanguy](https://x.com/alaymanguy)), quien también dirige [Shadcn Labs](https://www.shadcn-labs.com).
