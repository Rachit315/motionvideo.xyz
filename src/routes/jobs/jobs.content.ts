import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "jobs-page",
  content: {
    heroTitle: t({
      en: "Jobs in motion.",
      es: "Empleos de motion.",
      fr: "Emplois motion.",
    }),
    heroIntro: t({
      en: "Open roles for motion designers, creative developers and video engineers who build with AI.",
      es: "Puestos para motion designers, desarrolladores creativos e ingenieros de video que crean con IA.",
      fr: "Postes pour motion designers, développeurs créatifs et ingénieurs vidéo qui créent avec l’IA.",
    }),
    typeHeadings: {
      "full-time": t({
        en: "Full-time roles.",
        es: "Tiempo completo.",
        fr: "Temps plein.",
      }),
      "part-time": t({
        en: "Part-time roles.",
        es: "Medio tiempo.",
        fr: "Temps partiel.",
      }),
      contract: t({
        en: "Contract roles.",
        es: "Por contrato.",
        fr: "Missions en contrat.",
      }),
      freelance: t({
        en: "Freelance gigs.",
        es: "Freelance.",
        fr: "Freelance.",
      }),
    },
    typeDescriptions: {
      "full-time": t({
        en: "Full-time motion, creative developer and video roles at teams building with AI.",
        es: "Puestos a tiempo completo de motion, desarrollo creativo y video en equipos que usan IA.",
        fr: "Postes à temps plein en motion, dev créatif et vidéo, dans des équipes qui utilisent l’IA.",
      }),
      "part-time": t({
        en: "Part-time motion and video roles, for a few days a week alongside your own work.",
        es: "Puestos de motion y video a medio tiempo, unos días a la semana junto a tu trabajo.",
        fr: "Postes motion et vidéo à temps partiel, quelques jours par semaine en parallèle.",
      }),
      contract: t({
        en: "Fixed-term contracts for launch films, product videos and motion systems.",
        es: "Contratos temporales para lanzamientos, videos de producto y sistemas de motion.",
        fr: "Contrats à durée fixe pour films de lancement, vidéos produit et systèmes motion.",
      }),
      freelance: t({
        en: "Freelance projects for motion designers and creative developers, one film at a time.",
        es: "Proyectos freelance para motion designers y desarrolladores creativos, film a film.",
        fr: "Projets freelance pour motion designers et développeurs créatifs, un film à la fois.",
      }),
    },
    all: t({ en: "All", es: "Todos", fr: "Tous" }),
    filterType: t({
      en: "Filter by type",
      es: "Filtrar por tipo",
      fr: "Filtrer par type",
    }),
    emptyTitle: t({
      en: "No jobs yet",
      es: "Aún no hay empleos",
      fr: "Aucune offre pour le moment",
    }),
    emptyBody: t({
      en: "New roles show up here as soon as they’re approved.",
      es: "Los nuevos puestos aparecen aquí en cuanto se aprueban.",
      fr: "Les nouveaux postes apparaissent ici dès leur validation.",
    }),
    widgetTitle: t({
      en: "Motion jobs",
      es: "Empleos de motion",
      fr: "Emplois motion",
    }),
    seeAll: t({
      en: "See all jobs",
      es: "Ver todos los empleos",
      fr: "Voir toutes les offres",
    }),
    postJob: t({
      en: "Post a job",
      es: "Publicar empleo",
      fr: "Publier une offre",
    }),
    featured: t({ en: "Featured", es: "Destacado", fr: "À la une" }),
    remote: t({ en: "Remote", es: "Remoto", fr: "Télétravail" }),
    types: {
      "full-time": t({
        en: "Full-time",
        es: "Tiempo completo",
        fr: "Temps plein",
      }),
      "part-time": t({
        en: "Part-time",
        es: "Medio tiempo",
        fr: "Temps partiel",
      }),
      contract: t({ en: "Contract", es: "Contrato", fr: "Contrat" }),
      freelance: t({ en: "Freelance", es: "Freelance", fr: "Freelance" }),
    },
    perPost: t({
      en: "one-time · 30 days",
      es: "pago único · 30 días",
      fr: "paiement unique · 30 jours",
    }),
    plans: {
      standard: {
        name: t({ en: "Standard", es: "Estándar", fr: "Standard" }),
        choose: t({
          en: "Choose Standard",
          es: "Elegir Estándar",
          fr: "Choisir Standard",
        }),
        perks: [
          t({
            en: "Listed on Jobs for 30 days",
            es: "Publicado en Empleos durante 30 días",
            fr: "Publiée dans Emplois pendant 30 jours",
          }),
          t({
            en: "Your logo, salary and apply link",
            es: "Tu logo, salario y enlace para postular",
            fr: "Votre logo, salaire et lien de candidature",
          }),
          t({
            en: "Reviewed within one business day",
            es: "Revisado en un día hábil",
            fr: "Relue sous un jour ouvré",
          }),
        ],
      },
      featured: {
        name: t({ en: "Featured", es: "Destacado", fr: "À la une" }),
        choose: t({
          en: "Choose Featured",
          es: "Elegir Destacado",
          fr: "Choisir À la une",
        }),
        perks: [
          t({
            en: "Everything in Standard",
            es: "Todo lo de Estándar",
            fr: "Tout ce qu’inclut Standard",
          }),
          t({
            en: "Pinned above standard posts",
            es: "Fijado sobre las ofertas estándar",
            fr: "Épinglée au-dessus des offres standard",
          }),
          t({
            en: "Highlighted with a Featured badge",
            es: "Resaltado con una insignia de Destacado",
            fr: "Mise en avant avec un badge À la une",
          }),
          t({
            en: "A shoutout on X",
            es: "Una mención en X",
            fr: "Une mention sur X",
          }),
        ],
      },
    },
    // /jobs/post
    postHeroTitle: t({
      en: "Post a job to the people who make motion.",
      es: "Publica un empleo para quienes crean motion.",
      fr: "Publiez une offre auprès de celles et ceux qui font du motion.",
    }),
    postHeroIntro: t({
      en: "List your role where motion designers and creative developers already look for their next thing.",
      es: "Publica tu puesto donde motion designers y desarrolladores creativos ya buscan su próximo proyecto.",
      fr: "Publiez votre poste là où motion designers et développeurs créatifs cherchent déjà leur prochain projet.",
    }),
    planSection: t({ en: "Plan", es: "Plan", fr: "Formule" }),
    planSectionBody: t({
      en: "Standard lists the role; Featured pins it and adds a shoutout.",
      es: "Estándar publica el puesto; Destacado lo fija y suma una mención.",
      fr: "Standard publie le poste ; À la une l’épingle et ajoute une mention.",
    }),
    planTerms: t({
      en: "One-off, 30 days",
      es: "Pago único, 30 días",
      fr: "Ponctuel, 30 jours",
    }),
    details: t({ en: "Details", es: "Detalles", fr: "Détails" }),
    jobSection: t({ en: "Job", es: "Puesto", fr: "Poste" }),
    jobSectionBody: t({
      en: "The role, where people apply, and how it’s structured.",
      es: "El puesto, dónde postularse y cómo se organiza.",
      fr: "Le poste, où postuler et son organisation.",
    }),
    workLocation: t({
      en: "Work location",
      es: "Lugar de trabajo",
      fr: "Lieu de travail",
    }),
    employerSection: t({ en: "Employer", es: "Empresa", fr: "Employeur" }),
    employerSectionBody: t({
      en: "Company name and logo shown on the listing.",
      es: "Nombre y logo de la empresa en la oferta.",
      fr: "Nom et logo de l’entreprise affichés sur l’offre.",
    }),
    logoDrop: t({
      en: "Upload your company logo",
      es: "Sube el logo de tu empresa",
      fr: "Importez le logo de votre entreprise",
    }),
    logoSize: t({
      en: "Up to 512 × 512 px",
      es: "Hasta 512 × 512 px",
      fr: "Jusqu’à 512 × 512 px",
    }),
    detailsSection: t({ en: "Details", es: "Detalles", fr: "Détails" }),
    detailsSectionBody: t({
      en: "A short description, and a salary range if you share one.",
      es: "Una descripción breve y un rango salarial si lo compartes.",
      fr: "Une courte description, et une fourchette de salaire si vous la partagez.",
    }),
    reviewSection: t({ en: "Review", es: "Revisión", fr: "Récapitulatif" }),
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
    alreadyPaid: t({ en: "Already paid", es: "Ya pagado", fr: "Déjà payé" }),
    checkout: t({ en: "Checkout", es: "Pagar", fr: "Payer" }),
    afterCheckout: t({
      en: "After checkout, your post goes to review. Manage it anytime from Listings. Payments run through Dodo Payments, our merchant of record.",
      es: "Tras el pago, tu oferta pasa a revisión. Gestiónala cuando quieras desde Ofertas. Los pagos los gestiona Dodo Payments, nuestro comerciante registrado.",
      fr: "Après le paiement, votre offre passe en relecture. Gérez-la à tout moment depuis Annonces. Les paiements passent par Dodo Payments, notre marchand officiel.",
    }),
    // /listings
    listingsTitle: t({ en: "Listings", es: "Ofertas", fr: "Annonces" }),
    listingsIntro: t({
      en: "Your job posts: drafts, posts in review, and live listings.",
      es: "Tus ofertas de empleo: borradores, en revisión y publicadas.",
      fr: "Vos offres d’emploi : brouillons, en relecture et en ligne.",
    }),
    listingsEmpty: t({
      en: "No job posts yet",
      es: "Aún no hay ofertas",
      fr: "Aucune offre pour l’instant",
    }),
    listingsEmptyBody: t({
      en: "Post a role and it shows up here, with its review status and end date.",
      es: "Publica un puesto y aparecerá aquí, con su estado y fecha de fin.",
      fr: "Publiez un poste et il apparaîtra ici, avec son statut et sa date de fin.",
    }),
    status: {
      draft: t({
        en: "Unpaid draft",
        es: "Borrador sin pagar",
        fr: "Brouillon non payé",
      }),
      pending: t({ en: "In review", es: "En revisión", fr: "En relecture" }),
      approved: t({
        en: "Live until",
        es: "Publicado hasta",
        fr: "En ligne jusqu’au",
      }),
      expired: t({ en: "Expired", es: "Vencido", fr: "Expirée" }),
      rejected: t({
        en: "Changes requested",
        es: "Cambios solicitados",
        fr: "Modifications demandées",
      }),
      refunded: t({ en: "Refunded", es: "Reembolsado", fr: "Remboursée" }),
    },
    reviewNote: t({
      en: "Reviewer’s note:",
      es: "Nota del revisor:",
      fr: "Note de relecture :",
    }),
    edit: t({ en: "Edit", es: "Editar", fr: "Modifier" }),
    pay: t({
      en: "Pay and submit",
      es: "Pagar y enviar",
      fr: "Payer et envoyer",
    }),
    paidTitle: t({
      en: "Payment received",
      es: "Pago recibido",
      fr: "Paiement reçu",
    }),
    paidBody: t({
      en: "Your post is in review. We’ll email you when it’s live.",
      es: "Tu oferta está en revisión. Te escribiremos cuando esté publicada.",
      fr: "Votre offre est en relecture. Nous vous écrirons dès sa mise en ligne.",
    }),
    jobTitle: t({ en: "Job title", es: "Puesto", fr: "Intitulé du poste" }),
    company: t({ en: "Company", es: "Empresa", fr: "Entreprise" }),
    location: t({ en: "Location", es: "Ubicación", fr: "Lieu" }),
    locationHelp: t({
      en: "A city and country, or a time zone range.",
      es: "Una ciudad y país, o un rango de husos horarios.",
      fr: "Une ville et un pays, ou une plage de fuseaux horaires.",
    }),
    remoteLabel: t({
      en: "Remote friendly",
      es: "Admite remoto",
      fr: "Télétravail possible",
    }),
    type: t({ en: "Type", es: "Tipo", fr: "Type" }),
    salary: t({
      en: "Salary (optional)",
      es: "Salario (opcional)",
      fr: "Salaire (facultatif)",
    }),
    salaryHelp: t({
      en: "For example $120k–$150k or €60/hour.",
      es: "Por ejemplo, 120 000–150 000 $ o 60 €/hora.",
      fr: "Par exemple 120 k–150 k $ ou 60 €/heure.",
    }),
    description: t({ en: "Description", es: "Descripción", fr: "Description" }),
    descriptionHelp: t({
      en: "What the role is and who it suits. Plain text, up to 600 characters.",
      es: "En qué consiste el puesto y para quién es. Texto plano, hasta 600 caracteres.",
      fr: "Le poste et le profil recherché. Texte brut, 600 caractères maximum.",
    }),
    applyUrl: t({
      en: "Apply link",
      es: "Enlace para postular",
      fr: "Lien de candidature",
    }),
    applyHelp: t({
      en: "Your job page or application form.",
      es: "La página del puesto o el formulario de solicitud.",
      fr: "La page du poste ou le formulaire de candidature.",
    }),
    logo: t({
      en: "Logo URL (optional)",
      es: "URL del logo (opcional)",
      fr: "URL du logo (facultatif)",
    }),
    resubmit: t({
      en: "Resubmit for review",
      es: "Reenviar a revisión",
      fr: "Renvoyer en relecture",
    }),
    saving: t({ en: "Saving…", es: "Guardando…", fr: "Enregistrement…" }),
    opening: t({
      en: "Opening checkout…",
      es: "Abriendo el pago…",
      fr: "Ouverture du paiement…",
    }),
    errorValidation: t({
      en: "Check the fields: every required one needs a value, and links must be public HTTPS addresses.",
      es: "Revisa los campos: todos los obligatorios necesitan un valor y los enlaces deben ser direcciones HTTPS públicas.",
      fr: "Vérifiez les champs : chaque champ obligatoire doit être rempli et les liens doivent être des adresses HTTPS publiques.",
    }),
    errorSave: t({
      en: "Could not save. Try again.",
      es: "No se pudo guardar. Inténtalo de nuevo.",
      fr: "Enregistrement impossible. Réessayez.",
    }),
    errorCheckout: t({
      en: "Could not open checkout. Your draft is saved; try again.",
      es: "No se pudo abrir el pago. Tu borrador está guardado; inténtalo de nuevo.",
      fr: "Impossible d’ouvrir le paiement. Votre brouillon est enregistré ; réessayez.",
    }),
  },
} satisfies Dictionary;
