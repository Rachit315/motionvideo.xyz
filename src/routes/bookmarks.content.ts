import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "bookmarks-page",
  content: {
    title: t({ en: "Bookmarks", es: "Guardados", fr: "Favoris" }),
    intro: t({
      en: "Videos, tools, creatives, skills, and extras you saved, newest first.",
      es: "Los vídeos, herramientas, creativos, habilidades y extras que has guardado, los más recientes primero.",
      fr: "Les vidéos, outils, créatifs, compétences et extras que vous avez enregistrés, les plus récents d’abord.",
    }),
    filterKind: t({
      en: "Filter by type",
      es: "Filtrar por tipo",
      fr: "Filtrer par type",
    }),
    all: t({ en: "All", es: "Todo", fr: "Tout" }),
    // Chip labels, keyed by bookmark kind.
    kinds: {
      video: t({ en: "Videos", es: "Vídeos", fr: "Vidéos" }),
      tool: t({ en: "Tools", es: "Herramientas", fr: "Outils" }),
      studio: t({ en: "Creatives", es: "Creativos", fr: "Créatifs" }),
      skill: t({ en: "Skills", es: "Habilidades", fr: "Compétences" }),
      extra: t({ en: "Extras", es: "Extras", fr: "Extras" }),
    },
    emptyTitle: t({
      en: "No bookmarks yet",
      es: "Aún no tienes guardados",
      fr: "Aucun favori pour le moment",
    }),
    emptyDescription: t({
      en: "Use the bookmark button on any video, tool, creative, skill, or extra to save it here.",
      es: "Usa el botón de guardar de cualquier vídeo, herramienta, creativo, habilidad o extra para tenerlo aquí.",
      fr: "Utilisez le bouton favori d’une vidéo, d’un outil, d’un créatif, d’une compétence ou d’un extra pour l’enregistrer ici.",
    }),
    discover: t({
      en: "Discover videos",
      es: "Descubrir vídeos",
      fr: "Découvrir des vidéos",
    }),
  },
} satisfies Dictionary;
