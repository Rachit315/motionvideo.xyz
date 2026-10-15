import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "keyboard-shortcuts",
  content: {
    title: t({
      en: "Keyboard shortcuts",
      es: "Atajos de teclado",
      fr: "Raccourcis clavier",
    }),
    description: t({
      en: "Press a key anywhere outside a text field.",
      es: "Pulsa una tecla en cualquier lugar fuera de un campo de texto.",
      fr: "Appuyez sur une touche n’importe où, hors d’un champ de texte.",
    }),
    general: t({ en: "General", es: "General", fr: "Général" }),
    sections: t({ en: "Sections", es: "Secciones", fr: "Sections" }),
    account: t({ en: "Account", es: "Cuenta", fr: "Compte" }),
    videos: t({ en: "Videos", es: "Videos", fr: "Vidéos" }),
    search: t({ en: "Search", es: "Buscar", fr: "Rechercher" }),
    toggleTheme: t({
      en: "Toggle theme",
      es: "Cambiar tema",
      fr: "Changer de thème",
    }),
    toggleSounds: t({
      en: "Mute or unmute sounds",
      es: "Silenciar o activar sonidos",
      fr: "Couper ou activer les sons",
    }),
    toggleCursors: t({
      en: "Show or hide live cursors",
      es: "Mostrar u ocultar cursores en vivo",
      fr: "Afficher ou masquer les curseurs en direct",
    }),
    showShortcuts: t({
      en: "Show keyboard shortcuts",
      es: "Mostrar atajos de teclado",
      fr: "Afficher les raccourcis clavier",
    }),
    previousVideo: t({
      en: "Previous video",
      es: "Video anterior",
      fr: "Vidéo précédente",
    }),
    nextVideo: t({
      en: "Next video",
      es: "Video siguiente",
      fr: "Vidéo suivante",
    }),
    closeVideo: t({
      en: "Close video",
      es: "Cerrar video",
      fr: "Fermer la vidéo",
    }),
  },
} satisfies Dictionary;
