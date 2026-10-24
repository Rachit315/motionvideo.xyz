<div align="center">

<a href="https://motionvideo.xyz">
  <img src="../../apps/web/public/og.jpg" alt="MotionVideo: AI와 코드로 만든 모션 비디오." width="800" />
</a>

# MotionVideo

**코드로 쓰는 모션 디자인.**

AI와 코드로 만든 모션 비디오 디렉터리로, 각 영상의 프롬프트와 스킬을 함께 소개합니다.<br /> 또한 코딩 에이전트에게 타이밍, 이징, 안무를 가르치는 에이전트 스킬도 제공합니다.

[웹사이트](https://motionvideo.xyz) · [소개](https://motionvideo.xyz/about) · [문의](https://motionvideo.xyz/contact) · [후원](https://motionvideo.xyz/sponsor)

[![GitHub 스타](https://img.shields.io/github/stars/motionvideohq/motionvideo.xyz?style=flat-square)](https://github.com/motionvideohq/motionvideo.xyz/stargazers) [![CI](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml/badge.svg)](https://github.com/motionvideohq/motionvideo.xyz/actions/workflows/ci.yml) [![라이선스: MIT](https://img.shields.io/github/license/motionvideohq/motionvideo.xyz?style=flat-square)](../../LICENSE) [![X에서 팔로우](https://img.shields.io/badge/Follow-%40motionvideohq-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/motionvideohq)

<p align="center">
  <sub><a href="../../README.md">English</a> · <a href="README.zh-CN.md">中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <a href="README.pt.md">Português</a> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a></sub>
</p>

</div>

---

## 기술 스택

| 영역 | 도구 |
| --- | --- |
| 프레임워크 | [TanStack Start](https://tanstack.com/start) (React 19, 파일 기반 라우팅, 서버 함수) |
| UI | [Base UI](https://base-ui.com) 기반 [shadcn/ui](https://ui.shadcn.com), [Tailwind CSS v4](https://tailwindcss.com), [intlayer](https://intlayer.org) |
| 호스팅 | [Cloudflare Workers](https://workers.cloudflare.com)와 Durable Objects(실시간 접속 상태), [Wrangler](https://developers.cloudflare.com/workers/wrangler/) 및 Workers Builds로 배포 |
| 데이터 | [Cloudflare D1](https://developers.cloudflare.com/d1/)(SQLite)과 [Drizzle ORM](https://orm.drizzle.team), 동영상 에셋 및 업로드용 [R2](https://developers.cloudflare.com/r2/) |
| 인증 | [Better Auth](https://www.better-auth.com)(이메일 로그인 코드), [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| 이메일 | [Resend](https://resend.com), Cloudflare Email Routing(수신) |
| 결제 | [Dodo Payments](https://dodopayments.com)(merchant of record: 스킬 번들, 스폰서십, 채용 공고) |
| 분석 | [PostHog](https://posthog.com) |
| 도구 | [pnpm](https://pnpm.io), [Vite](https://vite.dev), [Ultracite](https://www.ultracite.ai)를 통한 [Oxlint](https://oxc.rs) + [Oxfmt](https://oxc.rs), [Lefthook](https://lefthook.dev) |

## 기여

기여를 환영합니다. 로컬 설정, 검사, 생성 파일, 풀 리퀘스트 절차는 [CONTRIBUTING.md](../../CONTRIBUTING.md)를 참고하세요. 버그와 기능 요청은 [issues](https://github.com/motionvideohq/motionvideo.xyz/issues)를 사용하세요. 참여함으로써 [행동 강령](../../CODE_OF_CONDUCT.md)에 동의하게 됩니다.

## 보안

보안 취약점은 공개 issue로 보고하지 마세요. [SECURITY.md](../../SECURITY.md)를 따르고 GitHub Security Advisories를 통해 비공개로 보고하세요.

## 기여자

[![기여자](https://contrib.rocks/image?repo=motionvideohq/motionvideo.xyz)](https://github.com/motionvideohq/motionvideo.xyz/graphs/contributors)

## 라이선스

웹사이트 소스 코드는 [MIT 라이선스](../../LICENSE)로 배포됩니다. MotionVideo 스킬 팩, 브랜드 이름, 로고마크는 이 라이선스에 포함되지 않으며, 스킬 팩은 자체 [약관](https://motionvideo.xyz/terms)에 따라 별도로 판매됩니다.

## 제작

[Aniket Pawar](https://www.aniketpawar.com)([@alaymanguy](https://x.com/alaymanguy)), [Shadcn Labs](https://www.shadcn-labs.com)도 운영하고 있습니다.
