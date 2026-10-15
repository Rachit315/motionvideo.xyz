import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "motion-gallery",
  content: {
    eyebrow: t({
      en: "The motion library",
      es: "La biblioteca de movimiento",
      fr: "La bibliothèque du mouvement",
    }),
    title: t({
      en: "Motion worth making.",
      es: "Motion que inspira.",
      fr: "Du motion qui inspire.",
    }),
    intro: t({
      en: "AI-made motion videos with the prompts and skills behind them. Find one and make it your own.",
      es: "Videos de motion hechos con IA, con los prompts y skills detrás. Encuentra uno y hazlo tuyo.",
      fr: "Des vidéos motion faites par IA, avec leurs prompts et skills. Trouvez-en une, faites-la vôtre.",
    }),
    submitVideo: t({
      en: "Submit a video",
      es: "Enviar un vídeo",
      fr: "Proposer une vidéo",
    }),
    surprise: t({ en: "Surprise me", es: "Sorpréndeme", fr: "Surprenez-moi" }),
    browse: t({
      en: "Explore the collection",
      es: "Explorar la colección",
      fr: "Explorer la collection",
    }),
    all: t({ en: "All", es: "Todos", fr: "Tous" }),
    prompt: t({ en: "Prompt", es: "Instrucción", fr: "Instruction" }),
    skill: t({ en: "Skill", es: "Habilidad", fr: "Compétence" }),
    filterType: t({
      en: "Filter by resource",
      es: "Filtrar por recurso",
      fr: "Filtrer par ressource",
    }),
    filterCategory: t({
      en: "Filter by category",
      es: "Filtrar por categoría",
      fr: "Filtrer par catégorie",
    }),
    sort: t({
      en: "Sort videos",
      es: "Ordenar vídeos",
      fr: "Trier les vidéos",
    }),
    popular: t({ en: "Popular", es: "Populares", fr: "Populaires" }),
    newest: t({
      en: "Newest first",
      es: "Más recientes",
      fr: "Les plus récentes",
    }),
    oldest: t({
      en: "Oldest first",
      es: "Más antiguos",
      fr: "Les plus anciennes",
    }),
    pause: t({
      en: "Pause previews",
      es: "Pausar vistas previas",
      fr: "Suspendre les aperçus",
    }),
    play: t({
      en: "Play previews",
      es: "Reproducir vistas previas",
      fr: "Lire les aperçus",
    }),
    noResults: t({
      en: "No videos found.",
      es: "No se encontraron vídeos.",
      fr: "Aucune vidéo trouvée.",
    }),
    tryAgain: t({
      en: "Try another category or resource type.",
      es: "Prueba otra categoría o tipo de recurso.",
      fr: "Essayez une autre catégorie ou un autre type de ressource.",
    }),
    watch: t({ en: "Watch video", es: "Ver vídeo", fr: "Voir la vidéo" }),
    open: t({ en: "Open", es: "Abrir", fr: "Ouvrir" }),
    previous: t({
      en: "Previous video",
      es: "Vídeo anterior",
      fr: "Vidéo précédente",
    }),
    next: t({ en: "Next video", es: "Vídeo siguiente", fr: "Vidéo suivante" }),
    noPrevious: t({
      en: "This is the first video",
      es: "Este es el primer vídeo",
      fr: "C’est la première vidéo",
    }),
    noNext: t({
      en: "This is the last video",
      es: "Este es el último vídeo",
      fr: "C’est la dernière vidéo",
    }),
    creator: t({ en: "Creator", es: "Creador", fr: "Créateur" }),
    close: t({ en: "Close video", es: "Cerrar vídeo", fr: "Fermer la vidéo" }),
    copy: t({
      en: "Copy prompt",
      es: "Copiar instrucción",
      fr: "Copier l’instruction",
    }),
    copied: t({ en: "Copied", es: "Copiado", fr: "Copiée" }),
    copyError: t({
      en: "Clipboard unavailable. Select and copy the prompt below.",
      es: "Portapapeles no disponible. Selecciona y copia la instrucción de abajo.",
      fr: "Presse-papiers indisponible. Sélectionnez et copiez l’instruction ci-dessous.",
    }),
    questions: t({
      en: "Questions, credit, or want this removed?",
      es: "¿Preguntas, créditos o quieres que lo retiremos?",
      fr: "Une question, un crédit ou un retrait ?",
    }),
    contactUs: t({ en: "Contact us", es: "Escríbenos", fr: "Contactez-nous" }),
    unavailablePrompt: t({
      en: "The prompt is not published in this collection. Check the creator’s original post for more context.",
      es: "La instrucción no está publicada en esta colección. Consulta la publicación original del creador.",
      fr: "L’instruction n’est pas publiée dans cette collection. Consultez la publication originale du créateur.",
    }),
    viewSkill: t({
      en: "View creator’s skill",
      es: "Ver habilidad del creador",
      fr: "Voir la compétence du créateur",
    }),
    viewSource: t({
      en: "View source",
      es: "Ver fuente",
      fr: "Voir la source",
    }),
    openOnX: t({ en: "Open on X", es: "Abrir en X", fr: "Ouvrir sur X" }),
    watchOnYouTube: t({
      en: "Watch on YouTube",
      es: "Ver en YouTube",
      fr: "Regarder sur YouTube",
    }),
    viewOnGitHub: t({
      en: "View on GitHub",
      es: "Ver en GitHub",
      fr: "Voir sur GitHub",
    }),
    visitWebsite: t({
      en: "Visit website",
      es: "Visitar el sitio",
      fr: "Visiter le site",
    }),
    sponsored: t({
      en: "Sponsored",
      es: "Patrocinado",
      fr: "Sponsorisé",
    }),
    category: t({ en: "Category", es: "Categoría", fr: "Catégorie" }),
    type: t({ en: "Type", es: "Tipo", fr: "Type" }),
    previewError: t({
      en: "Preview unavailable",
      es: "Vista previa no disponible",
      fr: "Aperçu indisponible",
    }),
    videoError: t({
      en: "This hosted video could not load. You can still watch it in the original post.",
      es: "No se pudo cargar el vídeo alojado. Puedes verlo en la publicación original.",
      fr: "Cette vidéo n’a pas pu être chargée. Vous pouvez la regarder dans la publication originale.",
    }),
    categories: {
      "product-ui": t({
        en: "Product UI",
        es: "Interfaz de producto",
        fr: "Interface produit",
      }),
      phone: t({ en: "Phone", es: "Móvil", fr: "Téléphone" }),
      charts: t({ en: "Charts", es: "Gráficos", fr: "Graphiques" }),
      diagrams: t({ en: "Diagrams", es: "Diagramas", fr: "Diagrammes" }),
      "kinetic-type": t({
        en: "Kinetic type",
        es: "Tipografía cinética",
        fr: "Typographie animée",
      }),
      // Source catalog category, not an implementation-structure name.
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names
      shapes: t({ en: "Shapes", es: "Formas", fr: "Formes" }),
      particles: t({ en: "Particles", es: "Partículas", fr: "Particules" }),
      characters: t({ en: "Characters", es: "Personajes", fr: "Personnages" }),
      photos: t({ en: "Photos", es: "Fotos", fr: "Photos" }),
      music: t({ en: "Music", es: "Música", fr: "Musique" }),
      code: t({ en: "Code", es: "Código", fr: "Code" }),
    },
    // Intro heading and copy on each category page, e.g. /category/product-ui.
    categoryTitles: {
      "product-ui": t({
        en: "Product UI motion.",
        es: "Motion de interfaz.",
        fr: "Motion d’interface.",
      }),
      phone: t({
        en: "Phone and app motion.",
        es: "Motion de móviles.",
        fr: "Motion mobile.",
      }),
      charts: t({
        en: "Animated charts.",
        es: "Gráficos animados.",
        fr: "Graphiques animés.",
      }),
      diagrams: t({
        en: "Animated diagrams.",
        es: "Diagramas animados.",
        fr: "Diagrammes animés.",
      }),
      "kinetic-type": t({
        en: "Kinetic typography.",
        es: "Tipografía cinética.",
        fr: "Typo cinétique.",
      }),
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names
      shapes: t({
        en: "Shapes in motion.",
        es: "Formas en movimiento.",
        fr: "Formes en mouvement.",
      }),
      particles: t({
        en: "Particle animation.",
        es: "Partículas animadas.",
        fr: "Particules animées.",
      }),
      characters: t({
        en: "Character animation.",
        es: "Personajes animados.",
        fr: "Personnages animés.",
      }),
      photos: t({
        en: "Photos in motion.",
        es: "Fotos en movimiento.",
        fr: "Photos en mouvement.",
      }),
      music: t({
        en: "Motion set to music.",
        es: "Motion con música.",
        fr: "Motion en musique.",
      }),
      code: t({
        en: "Code in motion.",
        es: "Código en movimiento.",
        fr: "Code en mouvement.",
      }),
    },
    categoryIntros: {
      "product-ui": t({
        en: "Dashboards, app walkthroughs and launch films, with the prompts and skills behind them.",
        es: "Dashboards, recorridos de apps y lanzamientos, con los prompts y skills detrás.",
        fr: "Dashboards, parcours d’apps et films de lancement, avec les prompts et skills derrière.",
      }),
      phone: t({
        en: "Animated app screens, device mockups and launches, with the prompts and skills behind them.",
        es: "Pantallas animadas, mockups de móvil y lanzamientos, con los prompts y skills detrás.",
        fr: "Écrans animés, mockups mobiles et lancements, avec les prompts et skills derrière.",
      }),
      charts: t({
        en: "Animated graphs, metrics and number reveals, with the prompts and skills behind them.",
        es: "Gráficas, métricas y cifras animadas, con los prompts y skills detrás.",
        fr: "Graphiques, métriques et chiffres animés, avec les prompts et skills derrière.",
      }),
      diagrams: t({
        en: "Animated flows, architectures and explainers, with the prompts and skills behind them.",
        es: "Flujos, arquitecturas y explicaciones animadas, con los prompts y skills detrás.",
        fr: "Flux, architectures et explications animés, avec les prompts et skills derrière.",
      }),
      "kinetic-type": t({
        en: "Animated text, titles and type-led videos, with the prompts and skills behind them.",
        es: "Texto, títulos y videos tipográficos animados, con los prompts y skills detrás.",
        fr: "Textes, titres et vidéos typographiques animés, avec les prompts et skills derrière.",
      }),
      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names
      shapes: t({
        en: "Abstract loops, morphing forms and graphic animation, with the prompts and skills behind them.",
        es: "Bucles abstractos, formas que mutan y animación gráfica, con los prompts y skills detrás.",
        fr: "Boucles abstraites, formes qui se muent et animation graphique, avec les prompts et skills derrière.",
      }),
      particles: t({
        en: "Swarms, dots and generative motion, with the prompts and skills behind them.",
        es: "Enjambres, puntos y motion generativo, con los prompts y skills detrás.",
        fr: "Essaims, points et motion génératif, avec les prompts et skills derrière.",
      }),
      characters: t({
        en: "Mascots, avatars and illustrated motion, with the prompts and skills behind them.",
        es: "Mascotas, avatares y motion ilustrado, con los prompts y skills detrás.",
        fr: "Mascottes, avatars et motion illustré, avec les prompts et skills derrière.",
      }),
      photos: t({
        en: "Slideshows, collages and photo animation, with the prompts and skills behind them.",
        es: "Presentaciones, collages y fotos animadas, con los prompts y skills detrás.",
        fr: "Diaporamas, collages et photos animées, avec les prompts et skills derrière.",
      }),
      music: t({
        en: "Beat-synced edits, visualizers and audio-reactive motion, with the prompts and skills behind them.",
        es: "Ediciones al ritmo, visualizadores y motion reactivo al audio, con los prompts y skills detrás.",
        fr: "Montages rythmés, visualiseurs et motion réactif au son, avec les prompts et skills derrière.",
      }),
      code: t({
        en: "Animated editors, terminals and dev tool launches, with the prompts and skills behind them.",
        es: "Editores, terminales y lanzamientos de herramientas animados, con los prompts y skills detrás.",
        fr: "Éditeurs, terminaux et lancements d’outils animés, avec les prompts et skills derrière.",
      }),
    },
  },
} satisfies Dictionary;
