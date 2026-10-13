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
    underReview: t({
      en: "Under review",
      es: "En revisión",
      fr: "En cours d’examen",
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
