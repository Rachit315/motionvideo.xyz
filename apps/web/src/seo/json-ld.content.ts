import { t } from "intlayer";
import type { Dictionary } from "intlayer";

// Words structured data needs that no page dictionary already has.
export default {
  key: "json-ld",
  content: {
    // First crumb of every breadcrumb trail.
    home: t({
      en: "Home",
      es: "Inicio",
      fr: "Accueil",
      zh: "首页",
      ko: "홈",
      ja: "ホーム",
      de: "Startseite",
      pt: "Início",
      ru: "Главная",
    }),
  },
} satisfies Dictionary;
