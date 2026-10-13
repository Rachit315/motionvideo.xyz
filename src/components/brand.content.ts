import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "brand-menu",
  content: {
    openBrand: t({
      en: "Open brand page",
      es: "Abrir página de marca",
      fr: "Ouvrir la page de la marque",
    }),
    logomarkSvg: t({
      en: "Logomark (SVG)",
      es: "Logotipo (SVG)",
      fr: "Logotype (SVG)",
    }),
    logomarkPng: t({
      en: "Logomark (PNG)",
      es: "Logotipo (PNG)",
      fr: "Logotype (PNG)",
    }),
    appIconPng: t({
      en: "App icon (PNG)",
      es: "Icono de app (PNG)",
      fr: "Icône d’app (PNG)",
    }),
  },
} satisfies Dictionary;
