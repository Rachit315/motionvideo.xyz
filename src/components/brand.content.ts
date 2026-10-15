import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "brand-menu",
  content: {
    copyLogomark: t({
      en: "Copy logomark as SVG",
      es: "Copiar símbolo como SVG",
      fr: "Copier le symbole en SVG",
    }),
    copyLogotype: t({
      en: "Copy logotype as SVG",
      es: "Copiar logotipo como SVG",
      fr: "Copier le logotype en SVG",
    }),
    copyAppIcon: t({
      en: "Copy app icon as SVG",
      es: "Copiar icono de app como SVG",
      fr: "Copier l’icône d’app en SVG",
    }),
    guidelines: t({
      en: "Brand guidelines",
      es: "Guía de marca",
      fr: "Charte de marque",
    }),
    download: t({
      en: "Download brand assets",
      es: "Descargar recursos de marca",
      fr: "Télécharger les ressources de marque",
    }),
  },
} satisfies Dictionary;
