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
      en: "Dodo Payments is still confirming your payment. It usually takes under a minute; refresh to check again.",
      es: "Dodo Payments aún está confirmando tu pago. Suele tardar menos de un minuto; actualiza para comprobarlo.",
      fr: "Dodo Payments confirme encore votre paiement. Cela prend en général moins d’une minute ; actualisez pour vérifier.",
    }),
    refresh: t({ en: "Refresh", es: "Actualizar", fr: "Actualiser" }),
    activeTitle: t({
      en: "Thank you for sponsoring MotionVideo.",
      es: "Gracias por patrocinar MotionVideo.",
      fr: "Merci de sponsoriser MotionVideo.",
    }),
    activeBody: t({
      en: "Payment received. We’re reviewing your placement; it goes live once approved, and you can still edit it below.",
      es: "Pago recibido. Estamos revisando tu espacio; se publica al aprobarse y aún puedes editarlo abajo.",
      fr: "Paiement reçu. Nous validons votre emplacement ; il est publié une fois approuvé, et vous pouvez encore le modifier ci-dessous.",
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
    startCampaign: t({
      en: "Start a campaign",
      es: "Empezar una campaña",
      fr: "Lancer une campagne",
    }),
    tiers: {
      diamond: t({ en: "Diamond", es: "Diamante", fr: "Diamant" }),
      gold: t({ en: "Gold", es: "Oro", fr: "Or" }),
      silver: t({ en: "Silver", es: "Plata", fr: "Argent" }),
    },
    newSponsorship: t({
      en: "New sponsorship",
      es: "Nuevo patrocinio",
      fr: "Nouveau parrainage",
    }),
    billings: {
      monthly: t({ en: "Monthly", es: "Mensual", fr: "Mensuel" }),
      once: t({
        en: "One-off, 30 days",
        es: "Pago único, 30 días",
        fr: "Ponctuel, 30 jours",
      }),
    },
    priceSuffix: {
      monthly: t({ en: "/ month", es: "/ mes", fr: "/ mois" }),
      once: t({ en: "once", es: "una vez", fr: "une fois" }),
    },
    finishCheckout: t({
      en: "Continue to checkout",
      es: "Continuar al pago",
      fr: "Continuer vers le paiement",
    }),
    deleteDraft: t({ en: "Delete", es: "Eliminar", fr: "Supprimer" }),
    statuses: {
      unpaid: t({ en: "Unpaid", es: "Sin pagar", fr: "Non payé" }),
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
        en: "Waiting for payment",
        es: "Esperando el pago",
        fr: "En attente du paiement",
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
    placements: {
      card: t({ en: "Grid card", es: "Tarjeta", fr: "Carte" }),
      slot: t({
        en: "Sponsor slot",
        es: "Espacio de patrocinio",
        fr: "Emplacement sponsor",
      }),
    },
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
    checkout: {
      heroTitle: t({
        en: "Put your brand in front of motion makers.",
        es: "Muestra tu marca a quienes crean motion.",
        fr: "Présentez votre marque aux créateurs de motion.",
      }),
      heroIntro: t({
        en: "Pick a plan, add your creative, and check out. Your placement goes live after a quick review.",
        es: "Elige un plan, añade tu creatividad y paga. Tu espacio se publica tras una revisión rápida.",
        fr: "Choisissez une formule, ajoutez votre visuel et payez. Votre emplacement est publié après une rapide validation.",
      }),
      planSection: t({ en: "Plan", es: "Plan", fr: "Formule" }),
      planSectionBody: t({
        en: "Where your placement shows.",
        es: "Dónde aparece tu espacio.",
        fr: "Où s’affiche votre emplacement.",
      }),
      details: t({ en: "Details", es: "Detalles", fr: "Détails" }),
      soldOut: t({
        en: "Sold out: every seat is taken.",
        es: "Agotado: todos los espacios están ocupados.",
        fr: "Complet : toutes les places sont prises.",
      }),
      billingSection: t({
        en: "Billing",
        es: "Facturación",
        fr: "Facturation",
      }),
      billingSectionBody: t({
        en: "Renew monthly to stay visible, or run once for 30 days.",
        es: "Renueva cada mes para seguir visible, o publica una vez durante 30 días.",
        fr: "Renouvelez chaque mois pour rester visible, ou diffusez une fois pendant 30 jours.",
      }),
      billingBodies: {
        monthly: t({
          en: "Renews every month. Cancel anytime.",
          es: "Se renueva cada mes. Cancela cuando quieras.",
          fr: "Renouvelé chaque mois. Résiliable à tout moment.",
        }),
        once: t({
          en: "One 30-day run from approval. Never renews.",
          es: "Una sola campaña de 30 días desde la aprobación. No se renueva.",
          fr: "Une diffusion de 30 jours à partir de la validation. Jamais renouvelée.",
        }),
      },
      reviewSection: t({ en: "Review", es: "Resumen", fr: "Récapitulatif" }),
      reviewSectionBody: t({
        en: "Check your order before checkout.",
        es: "Revisa tu pedido antes de pagar.",
        fr: "Vérifiez votre commande avant le paiement.",
      }),
      dueToday: t({
        en: "Due today",
        es: "A pagar hoy",
        fr: "À payer aujourd’hui",
      }),
      signedInAs: t({
        en: "Signed in as",
        es: "Sesión iniciada como",
        fr: "Connecté en tant que",
      }),
      note: t({
        en: "After checkout, manage your sponsorship and update your creative anytime from Sponsorships. Payments run through Dodo Payments, our merchant of record.",
        es: "Tras el pago, gestiona tu patrocinio y actualiza tu creatividad cuando quieras desde Patrocinios. Los pagos los gestiona Dodo Payments, nuestro comerciante registrado.",
        fr: "Après le paiement, gérez votre parrainage et modifiez votre visuel à tout moment depuis Parrainages. Les paiements passent par Dodo Payments, notre marchand officiel.",
      }),
      submit: t({ en: "Checkout", es: "Pagar", fr: "Payer" }),
      opening: t({
        en: "Opening checkout…",
        es: "Abriendo el pago…",
        fr: "Ouverture du paiement…",
      }),
      errors: {
        validation: t({
          en: "Check the fields: every required one needs a value, and links must be public HTTPS addresses.",
          es: "Revisa los campos: todos los obligatorios necesitan un valor y los enlaces deben ser direcciones HTTPS públicas.",
          fr: "Vérifiez les champs : chaque champ obligatoire doit être rempli et les liens doivent être des adresses HTTPS publiques.",
        }),
        cover: t({
          en: "Add a cover image for your placement.",
          es: "Añade una imagen de portada para tu espacio.",
          fr: "Ajoutez une image de couverture pour votre emplacement.",
        }),
        category: t({
          en: "Pick the category your placement shows on.",
          es: "Elige la categoría donde aparece tu espacio.",
          fr: "Choisissez la catégorie où s’affiche votre emplacement.",
        }),
        "sold-out": t({
          en: "Diamond just sold out. Pick another plan.",
          es: "Diamante acaba de agotarse. Elige otro plan.",
          fr: "Diamant vient d’être complet. Choisissez une autre formule.",
        }),
        drafts: t({
          en: "You have 10 unpaid drafts. Finish or delete one on Sponsorships first.",
          es: "Tienes 10 borradores sin pagar. Completa o elimina uno en Patrocinios primero.",
          fr: "Vous avez 10 brouillons non payés. Finalisez-en ou supprimez-en un dans Parrainages d’abord.",
        }),
        save: t({
          en: "Could not save. Try again.",
          es: "No se pudo guardar. Inténtalo de nuevo.",
          fr: "Enregistrement impossible. Réessayez.",
        }),
        checkout: t({
          en: "Could not open checkout. Try again.",
          es: "No se pudo abrir el pago. Inténtalo de nuevo.",
          fr: "Impossible d’ouvrir le paiement. Réessayez.",
        }),
      },
    },
    billingError: t({
      en: "Could not open billing. Try again.",
      es: "No se pudo abrir la facturación. Inténtalo de nuevo.",
      fr: "Impossible d’ouvrir la facturation. Réessayez.",
    }),
  },
} satisfies Dictionary;
