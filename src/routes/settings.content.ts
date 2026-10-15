import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "settings-page",
  content: {
    title: t({ en: "Settings", es: "Ajustes", fr: "Réglages" }),
    intro: t({
      en: "Your account preferences.",
      es: "Tus preferencias de cuenta.",
      fr: "Vos préférences de compte.",
    }),
    general: t({ en: "General", es: "General", fr: "Général" }),
    deleteAccount: t({
      en: "Delete account",
      es: "Eliminar cuenta",
      fr: "Supprimer le compte",
    }),
    deleteNote: t({
      en: "Removes your account, submissions, and bookmarks.",
      es: "Elimina tu cuenta, tus propuestas y tus guardados.",
      fr: "Supprime votre compte, vos propositions et vos favoris.",
    }),
    emails: t({ en: "Emails", es: "Correos", fr: "E-mails" }),
    updates: t({
      en: "MotionVideo updates",
      es: "Novedades de MotionVideo",
      fr: "Actualités de MotionVideo",
    }),
    updatesDescription: t({
      en: "New features and featured work, occasionally.",
      es: "Novedades y trabajo destacado, de vez en cuando.",
      fr: "Nouveautés et œuvres à l’honneur, occasionnellement.",
    }),
    on: t({ en: "On", es: "Activado", fr: "Activé" }),
    off: t({ en: "Off", es: "Desactivado", fr: "Désactivé" }),
  },
} satisfies Dictionary;
