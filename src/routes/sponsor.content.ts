import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "sponsor",
  content: {
    seePlans: t({ en: "See plans", es: "Ver planes", fr: "Voir les formules" }),
    limited: t({
      en: "Limited availability",
      es: "Disponibilidad limitada",
      fr: "Places limitées",
    }),
    pitch: t({
      en: "Reach the people who make product films and motion design with AI and code.",
      es: "Llega a quienes crean vídeos de producto y motion design con IA y código.",
      fr: "Touchez celles et ceux qui créent des films produit et du motion design avec l’IA et le code.",
    }),
    note: t({
      en: "MotionVideo stays free and independent through a few labelled placements. Pick a plan below to book one.",
      es: "MotionVideo sigue siendo gratuito e independiente gracias a unos pocos espacios patrocinados y señalizados. Elige un plan para reservar uno.",
      fr: "MotionVideo reste gratuit et indépendant grâce à quelques emplacements sponsorisés et signalés. Choisissez une formule ci-dessous pour en réserver un.",
    }),
    soldOut: t({ en: "Sold out", es: "Agotado", fr: "Complet" }),
    sponsors: t({ en: "Sponsors", es: "Patrocinadores", fr: "Sponsors" }),
    founding: t({ en: "Founding", es: "Fundadores", fr: "Fondateurs" }),
    takeSlot: t({
      en: "Take this slot",
      es: "Ocupa este espacio",
      fr: "Prendre cette place",
    }),
    sponsorsSeats: t({
      en: "All seats are taken",
      es: "Todos los espacios están ocupados",
      fr: "Toutes les places sont prises",
    }),
    plans: t({ en: "Plans", es: "Planes", fr: "Formules" }),
    perMonth: t({ en: "/ month", es: "/ mes", fr: "/ mois" }),
    tiers: {
      diamond: {
        name: t({ en: "Diamond", es: "Diamante", fr: "Diamant" }),
        firstSponsor: t({
          en: "Be the first Diamond sponsor",
          es: "Sé el primer patrocinador Diamante",
          fr: "Devenez le premier sponsor Diamant",
        }),
        join: t({
          en: "Become a Diamond sponsor",
          es: "Hazte patrocinador Diamante",
          fr: "Devenez sponsor Diamant",
        }),
        choose: t({
          en: "Choose Diamond",
          es: "Elegir Diamante",
          fr: "Choisir Diamant",
        }),
        perks: [
          t({
            en: "Your logo on the sponsors page",
            es: "Tu logotipo en la página de patrocinadores",
            fr: "Votre logo sur la page des sponsors",
          }),
          t({
            en: "The sponsored card on every page, shown first",
            es: "La tarjeta patrocinada en cada página, en primer lugar",
            fr: "La carte sponsorisée sur chaque page, en premier",
          }),
          t({
            en: "Your logo in the sponsor slots on every page",
            es: "Tu logotipo en los espacios de patrocinio de cada página",
            fr: "Votre logo dans les emplacements sponsors de chaque page",
          }),
          t({
            en: "A shoutout on X",
            es: "Una mención en X",
            fr: "Une mention sur X",
          }),
        ],
      },
      gold: {
        name: t({ en: "Gold", es: "Oro", fr: "Or" }),
        firstSponsor: t({
          en: "Be the first Gold sponsor",
          es: "Sé el primer patrocinador Oro",
          fr: "Devenez le premier sponsor Or",
        }),
        join: t({
          en: "Become a Gold sponsor",
          es: "Hazte patrocinador Oro",
          fr: "Devenez sponsor Or",
        }),
        choose: t({ en: "Choose Gold", es: "Elegir Oro", fr: "Choisir Or" }),
        perks: [
          t({
            en: "Your logo on the sponsors page",
            es: "Tu logotipo en la página de patrocinadores",
            fr: "Votre logo sur la page des sponsors",
          }),
          t({
            en: "The sponsored card on your category’s page, after Diamond",
            es: "La tarjeta patrocinada en la página de tu categoría, tras Diamante",
            fr: "La carte sponsorisée sur la page de votre catégorie, après Diamant",
          }),
          t({
            en: "Your logo in that page’s sponsor slots",
            es: "Tu logotipo en los espacios de patrocinio de esa página",
            fr: "Votre logo dans les emplacements sponsors de cette page",
          }),
          t({
            en: "A shoutout on X",
            es: "Una mención en X",
            fr: "Une mention sur X",
          }),
        ],
      },
      silver: {
        name: t({ en: "Silver", es: "Plata", fr: "Argent" }),
        firstSponsor: t({
          en: "Be the first Silver sponsor",
          es: "Sé el primer patrocinador Plata",
          fr: "Devenez le premier sponsor Argent",
        }),
        join: t({
          en: "Become a Silver sponsor",
          es: "Hazte patrocinador Plata",
          fr: "Devenez sponsor Argent",
        }),
        choose: t({
          en: "Choose Silver",
          es: "Elegir Plata",
          fr: "Choisir Argent",
        }),
        perks: [
          t({
            en: "Your logo on the sponsors page",
            es: "Tu logotipo en la página de patrocinadores",
            fr: "Votre logo sur la page des sponsors",
          }),
          t({
            en: "The sponsored card on your category’s page, after Diamond and Gold",
            es: "La tarjeta patrocinada en la página de tu categoría, tras Diamante y Oro",
            fr: "La carte sponsorisée sur la page de votre catégorie, après Diamant et Or",
          }),
        ],
      },
    },
    mostImpact: t({
      en: "Most impact",
      es: "Más impacto",
      fr: "Le plus d’impact",
    }),
    customTitle: t({
      en: "Questions, or need a custom package?",
      es: "¿Preguntas o necesitas un paquete a medida?",
      fr: "Des questions, ou besoin d’une offre sur mesure ?",
    }),
    customBody: t({
      en: "Happy to put something together that fits what you have in mind. Reach out directly.",
      es: "Con gusto preparo algo que encaje con lo que tienes en mente. Escríbeme directamente.",
      fr: "Je peux préparer quelque chose qui correspond à ce que vous avez en tête. Écrivez-moi directement.",
    }),
    email: t({ en: "Email me", es: "Escríbeme", fr: "M’écrire" }),
    dmX: t({ en: "DM on X", es: "MD en X", fr: "MP sur X" }),
    faq: t({
      en: "Frequently asked questions",
      es: "Preguntas frecuentes",
      fr: "Questions fréquentes",
    }),
    faqs: [
      {
        question: t({
          en: "Does sponsoring get my work into the catalogue?",
          es: "¿Patrocinar hace que mi trabajo entre en el catálogo?",
          fr: "Sponsoriser fait-il entrer mon travail dans le catalogue ?",
        }),
        answer: t({
          en: "No. Videos, tools, and creatives are picked on merit and none was paid for. Sponsoring buys the placements above, nothing else.",
          es: "No. Los vídeos, herramientas y creativos se eligen por mérito y ninguno se ha pagado. Patrocinar compra los espacios de arriba, nada más.",
          fr: "Non. Les vidéos, outils et créatifs sont choisis au mérite et aucun n’a été payé. Sponsoriser achète les emplacements ci-dessus, rien de plus.",
        }),
      },
      {
        question: t({
          en: "Is it labelled as sponsored?",
          es: "¿Se indica que es patrocinado?",
          fr: "Est-ce signalé comme sponsorisé ?",
        }),
        answer: t({
          en: 'Yes, on the page and as rel="sponsored" in the markup.',
          es: 'Sí, en la página y como rel="sponsored" en el código.',
          fr: 'Oui, sur la page et via rel="sponsored" dans le code.',
        }),
      },
      {
        question: t({
          en: "What do you need from me?",
          es: "¿Qué necesitas de mí?",
          fr: "De quoi avez-vous besoin ?",
        }),
        answer: t({
          en: "A square mark, a name, a link, one line of copy, a cover image, and a category for Gold and Silver. You add them before checkout and can change them anytime on your Sponsorships page; the placement goes live once we have reviewed it.",
          es: "Un logotipo cuadrado, un nombre, un enlace, una línea de texto, una imagen de portada y una categoría para Oro y Plata. Los añades antes de pagar y puedes cambiarlos cuando quieras en tu página de Patrocinios; el espacio se publica cuando lo hayamos revisado.",
          fr: "Un logo carré, un nom, un lien, une ligne de texte, une image de couverture, et une catégorie pour Or et Argent. Vous les ajoutez avant le paiement et pouvez les modifier à tout moment sur votre page Parrainages ; l’emplacement est publié dès que nous l’avons validé.",
        }),
      },
      {
        question: t({
          en: "Can I stop?",
          es: "¿Puedo cancelar?",
          fr: "Puis-je arrêter ?",
        }),
        answer: t({
          en: "Whenever you want. Monthly plans cancel anytime, and a one-off run simply ends after its 30 days. Billing runs through Dodo Payments, our merchant of record.",
          es: "Cuando quieras. Los planes mensuales se cancelan en cualquier momento y una campaña única termina sola a los 30 días. La facturación la gestiona Dodo Payments, nuestro comerciante registrado.",
          fr: "Quand vous voulez. Les formules mensuelles sont résiliables à tout moment, et une diffusion ponctuelle s’arrête d’elle-même après 30 jours. La facturation passe par Dodo Payments, notre marchand officiel.",
        }),
      },
    ],
  },
} satisfies Dictionary;
