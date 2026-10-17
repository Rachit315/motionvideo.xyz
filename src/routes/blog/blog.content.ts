import { t } from "intlayer";
import type { Dictionary } from "intlayer";

// Chrome for /blog, /blog/$slug and the post renderer. The posts themselves
// stay in English (src/lib/blog.ts).
export default {
  key: "blog",
  content: {
    title: t({ en: "Blog", es: "Blog", fr: "Blog" }),
    intro: t({
      en: "Notes on making motion graphics with AI coding agents, drawn from the prompts in the gallery.",
      es: "Notas sobre cómo crear motion graphics con agentes de programación, a partir de los prompts de la galería.",
      fr: "Notes sur la création de motion design avec des agents de programmation, tirées des prompts de la galerie.",
    }),
    englishOnly: t({
      en: "Posts are written in English.",
      es: "Los artículos están escritos en inglés.",
      fr: "Les articles sont rédigés en anglais.",
    }),
    back: t({
      en: "All posts",
      es: "Todos los artículos",
      fr: "Tous les articles",
    }),
    morePosts: t({
      en: "More from the blog",
      es: "Más del blog",
      fr: "Plus d’articles",
    }),
    by: t({ en: "by", es: "de", fr: "par" }),
  },
} satisfies Dictionary;
