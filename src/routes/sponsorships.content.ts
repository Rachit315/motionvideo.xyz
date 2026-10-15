import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "sponsorships-page",
  content: {
    title: t({ en: "Sponsorships", es: "Patrocinios", fr: "Parrainages" }),
    intro: t({
      en: "Your sponsor plans and the placements they show. Every change goes live after a quick review.",
      es: "Tus planes de patrocinio y los espacios que muestran. Cada cambio se publica tras una revisión rápida.",
      fr: "Vos formules de parrainage et les emplacements qu’elles affichent. Chaque modification est publiée après une rapide validation.",
    }),
    confirmingTitle: t({
      en: "Confirming your payment…",
      es: "Confirmando tu pago…",
      fr: "Confirmation de votre paiement…",
    }),
    confirmingBody: t({
      en: "Dodo Payments is still confirming your subscription. It usually takes under a minute; refresh to check again.",
      es: "Dodo Payments aún está confirmando tu suscripción. Suele tardar menos de un minuto; actualiza para comprobarlo.",
      fr: "Dodo Payments confirme encore votre abonnement. Cela prend en général moins d’une minute ; actualisez pour vérifier.",
    }),
    refresh: t({ en: "Refresh", es: "Actualizar", fr: "Actualiser" }),
    activeTitle: t({
      en: "Thank you for sponsoring MotionVideo.",
      es: "Gracias por patrocinar MotionVideo.",
      fr: "Merci de sponsoriser MotionVideo.",
    }),
    activeBody: t({
      en: "Your plan is active. Set up your placement below; it goes live once we have reviewed it.",
      es: "Tu plan está activo. Configura tu espacio abajo; se publica cuando lo hayamos revisado.",
      fr: "Votre formule est active. Configurez votre emplacement ci-dessous ; il est publié dès que nous l’avons validé.",
    }),
    emptyTitle: t({
      en: "No sponsorships yet",
      es: "Aún no tienes patrocinios",
      fr: "Aucun parrainage pour le moment",
    }),
    emptyDescription: t({
      en: "Pick a plan to put your product in front of people who make product films and motion design.",
      es: "Elige un plan para mostrar tu producto a quienes crean vídeos de producto y motion design.",
      fr: "Choisissez une formule pour présenter votre produit à celles et ceux qui créent des films produit et du motion design.",
    }),
    seePlans: t({ en: "See plans", es: "Ver planes", fr: "Voir les formules" }),
    tiers: {
      diamond: t({ en: "Diamond", es: "Diamante", fr: "Diamant" }),
      gold: t({ en: "Gold", es: "Oro", fr: "Or" }),
      silver: t({ en: "Silver", es: "Plata", fr: "Argent" }),
    },
    statuses: {
      pending: t({
        en: "Payment pending",
        es: "Pago pendiente",
        fr: "Paiement en attente",
      }),
      active: t({ en: "Active", es: "Activa", fr: "Actif" }),
      on_hold: t({ en: "On hold", es: "En espera", fr: "En attente" }),
      paused: t({ en: "Paused", es: "En pausa", fr: "En pause" }),
      cancelled: t({ en: "Cancelled", es: "Cancelada", fr: "Résilié" }),
      failed: t({ en: "Failed", es: "Fallida", fr: "Échoué" }),
      expired: t({ en: "Expired", es: "Caducada", fr: "Expiré" }),
      past_due: t({ en: "Past due", es: "Vencida", fr: "Impayé" }),
    },
    renews: t({ en: "Renews", es: "Se renueva el", fr: "Renouvellement le" }),
    ends: t({ en: "Ends", es: "Termina el", fr: "Se termine le" }),
    placement: t({ en: "Placement", es: "Espacio", fr: "Emplacement" }),
    reviews: {
      draft: t({
        en: "Not set up yet",
        es: "Sin configurar",
        fr: "Pas encore configuré",
      }),
      pending: t({ en: "In review", es: "En revisión", fr: "En validation" }),
      approved: t({ en: "Live", es: "Publicado", fr: "En ligne" }),
      rejected: t({
        en: "Changes requested",
        es: "Cambios solicitados",
        fr: "Modifications demandées",
      }),
    },
    approvedInactive: t({
      en: "Approved, hidden until the subscription is active again",
      es: "Aprobado, oculto hasta que la suscripción vuelva a estar activa",
      fr: "Validé, masqué jusqu’à ce que l’abonnement soit de nouveau actif",
    }),
    reviewNote: t({
      en: "Note from the reviewer",
      es: "Nota de la revisión",
      fr: "Note de la validation",
    }),
    name: t({ en: "Name", es: "Nombre", fr: "Nom" }),
    url: t({ en: "Link", es: "Enlace", fr: "Lien" }),
    tagline: t({
      en: "Line of copy",
      es: "Línea de texto",
      fr: "Ligne de texte",
    }),
    section: t({ en: "Section", es: "Sección", fr: "Section" }),
    sections: {
      video: t({ en: "Discover", es: "Descubrir", fr: "Découvrir" }),
      tool: t({ en: "Tools", es: "Herramientas", fr: "Outils" }),
      studio: t({ en: "Creatives", es: "Creativos", fr: "Créatifs" }),
      skill: t({ en: "Skills", es: "Habilidades", fr: "Compétences" }),
      extra: t({ en: "Extras", es: "Extras", fr: "Extras" }),
    },
    category: t({ en: "Category", es: "Categoría", fr: "Catégorie" }),
    pickCategory: t({
      en: "Pick a category",
      es: "Elige una categoría",
      fr: "Choisissez une catégorie",
    }),
    categoryHelp: t({
      en: "Your placement shows on this category’s page.",
      es: "Tu espacio aparece en la página de esta categoría.",
      fr: "Votre emplacement s’affiche sur la page de cette catégorie.",
    }),
    darkInvert: t({
      en: "Invert the logo in dark mode (for a dark mark on a transparent background)",
      es: "Invertir el logotipo en modo oscuro (para un logotipo oscuro sobre fondo transparente)",
      fr: "Inverser le logo en mode sombre (pour un logo sombre sur fond transparent)",
    }),
    resubmit: t({
      en: "Saving sends the placement back to review; it is hidden until approved again.",
      es: "Al guardar, el espacio vuelve a revisión y queda oculto hasta que se apruebe de nuevo.",
      fr: "L’enregistrement renvoie l’emplacement en validation ; il est masqué jusqu’à sa nouvelle validation.",
    }),
    save: t({
      en: "Save and send for review",
      es: "Guardar y enviar a revisión",
      fr: "Enregistrer et envoyer en validation",
    }),
    saving: t({ en: "Saving…", es: "Guardando…", fr: "Enregistrement…" }),
    saved: t({
      en: "Saved. We will review it shortly.",
      es: "Guardado. Lo revisaremos en breve.",
      fr: "Enregistré. Nous le validerons sous peu.",
    }),
    errors: {
      validation: t({
        en: "Check the fields: links must be public HTTPS addresses.",
        es: "Revisa los campos: los enlaces deben ser direcciones HTTPS públicas.",
        fr: "Vérifiez les champs : les liens doivent être des adresses HTTPS publiques.",
      }),
      cover: t({
        en: "Add a cover image for this plan.",
        es: "Añade una imagen de portada para este plan.",
        fr: "Ajoutez une image de couverture pour cette formule.",
      }),
      category: t({
        en: "Pick the category your placement shows on.",
        es: "Elige la categoría donde aparece tu espacio.",
        fr: "Choisissez la catégorie où s’affiche votre emplacement.",
      }),
      storage: t({
        en: "Could not save. Try again.",
        es: "No se pudo guardar. Inténtalo de nuevo.",
        fr: "Enregistrement impossible. Réessayez.",
      }),
    },
    preview: t({ en: "Preview", es: "Vista previa", fr: "Aperçu" }),
    campaignSection: t({ en: "Campaign", es: "Campaña", fr: "Campagne" }),
    campaignSectionBody: t({
      en: "Who the placement is for, its line of copy, and where it links.",
      es: "Para quién es el anuncio, su texto y adónde enlaza.",
      fr: "Pour qui est l’emplacement, son accroche et sa destination.",
    }),
    brandSection: t({ en: "Brand", es: "Marca", fr: "Marque" }),
    brandSectionBody: t({
      en: "Your logo, shown with every placement and in the sponsor wall.",
      es: "Tu logo, en cada anuncio y en el muro de patrocinadores.",
      fr: "Votre logo, affiché avec chaque emplacement et sur le mur des sponsors.",
    }),
    logoDrop: t({
      en: "Upload your logo",
      es: "Sube tu logo",
      fr: "Importez votre logo",
    }),
    logoSize: t({
      en: "Square, up to 512 × 512 px",
      es: "Cuadrado, hasta 512 × 512 px",
      fr: "Carré, jusqu’à 512 × 512 px",
    }),
    mediaSection: t({ en: "Creative media", es: "Imagen", fr: "Visuel" }),
    mediaSectionBody: t({
      en: "One 16:9 image used for the card in the grid.",
      es: "Una imagen 16:9 para la tarjeta del muro.",
      fr: "Une image 16:9 pour la carte de la grille.",
    }),
    coverDrop: t({
      en: "Upload your cover image",
      es: "Sube tu imagen de portada",
      fr: "Importez votre image de couverture",
    }),
    coverSize: t({
      en: "1600 × 900 px recommended",
      es: "Recomendado 1600 × 900 px",
      fr: "1600 × 900 px recommandé",
    }),
    placementSection: t({
      en: "Placement",
      es: "Ubicación",
      fr: "Emplacement",
    }),
    placementSectionBody: t({
      en: "The section and category page your placement shows on.",
      es: "La sección y la categoría donde aparece tu anuncio.",
      fr: "La section et la catégorie où apparaît votre emplacement.",
    }),
    previewSectionBody: t({
      en: "Roughly how your placement will appear on the site.",
      es: "Más o menos cómo se verá tu anuncio en el sitio.",
      fr: "À peu près comment votre emplacement apparaîtra sur le site.",
    }),
    submitSection: t({ en: "Submit", es: "Enviar", fr: "Envoyer" }),
    submitSectionBody: t({
      en: "Saving sends the placement to review; it goes live once approved.",
      es: "Al guardar, el anuncio pasa a revisión; se publica al aprobarse.",
      fr: "L’enregistrement envoie l’emplacement en relecture ; il est publié une fois approuvé.",
    }),
    sponsored: t({ en: "Sponsored", es: "Patrocinado", fr: "Sponsorisé" }),
    manageBilling: t({
      en: "Manage billing",
      es: "Gestionar facturación",
      fr: "Gérer la facturation",
    }),
    opening: t({ en: "Opening…", es: "Abriendo…", fr: "Ouverture…" }),
    billingError: t({
      en: "Could not open billing. Try again.",
      es: "No se pudo abrir la facturación. Inténtalo de nuevo.",
      fr: "Impossible d’ouvrir la facturation. Réessayez.",
    }),
  },
} satisfies Dictionary;
