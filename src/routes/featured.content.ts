import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "featured-page",
  content: {
    title: t({ en: "Featured", es: "Destacados", fr: "À l’honneur" }),
    intro: t({
      en: "Work you submitted, credited to you.",
      es: "Trabajo que has enviado, acreditado a ti.",
      fr: "Les œuvres que vous avez proposées, créditées à votre nom.",
    }),
    featuredHeading: t({
      en: "Featured work",
      es: "Trabajo destacado",
      fr: "Œuvres à l’honneur",
    }),
    submissionsHeading: t({
      en: "Your submissions",
      es: "Tus envíos",
      fr: "Vos propositions",
    }),
    status: {
      pending: t({
        en: "Under review",
        es: "En revisión",
        fr: "En cours d’examen",
      }),
      featured: t({ en: "Featured", es: "Destacado", fr: "À l’honneur" }),
      declined: t({
        en: "Not selected",
        es: "No seleccionado",
        fr: "Non retenu",
      }),
    },
    viewFeatured: t({
      en: "View featured",
      es: "Ver destacado",
      fr: "Voir l’œuvre",
    }),
    visit: t({
      en: "Visit website",
      es: "Visitar sitio web",
      fr: "Visiter le site",
    }),
    newTab: t({
      en: "opens in a new tab",
      es: "se abre en una pestaña nueva",
      fr: "s’ouvre dans un nouvel onglet",
    }),
    emptyTitle: t({
      en: "None of your work has been featured yet",
      es: "Aún no se ha destacado nada de tu trabajo",
      fr: "Aucune de vos œuvres n’a encore été mise à l’honneur",
    }),
    emptyDescription: t({
      en: "Work credited to you will appear here.",
      es: "El trabajo acreditado a ti aparecerá aquí.",
      fr: "Les œuvres créditées à votre nom apparaîtront ici.",
    }),
    submit: t({
      en: "Submit your work",
      es: "Envía tu trabajo",
      fr: "Proposez votre œuvre",
    }),
  },
} satisfies Dictionary;
