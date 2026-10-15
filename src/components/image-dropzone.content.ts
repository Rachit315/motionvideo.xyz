import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "image-dropzone",
  content: {
    browse: t({ en: "Browse", es: "Examinar", fr: "Parcourir" }),
    replace: t({ en: "Replace", es: "Reemplazar", fr: "Remplacer" }),
    remove: t({ en: "Remove", es: "Quitar", fr: "Retirer" }),
    uploading: t({ en: "Uploading…", es: "Subiendo…", fr: "Envoi…" }),
    types: t({
      en: "JPG, PNG or WebP",
      es: "JPG, PNG o WebP",
      fr: "JPG, PNG ou WebP",
    }),
    max: t({ en: "max", es: "máx.", fr: "max." }),
    errorType: t({
      en: "Use a JPG, PNG or WebP image.",
      es: "Usa una imagen JPG, PNG o WebP.",
      fr: "Utilisez une image JPG, PNG ou WebP.",
    }),
    errorSize: t({
      en: "That file is too large.",
      es: "El archivo es demasiado grande.",
      fr: "Ce fichier est trop volumineux.",
    }),
    errorUpload: t({
      en: "Upload failed. Try again.",
      es: "No se pudo subir. Inténtalo de nuevo.",
      fr: "L’envoi a échoué. Réessayez.",
    }),
  },
} satisfies Dictionary;
