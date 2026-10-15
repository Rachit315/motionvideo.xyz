import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "resource-directory",
  content: {
    // "All" page heading and intro for each section.
    titles: {
      tool: t({
        en: "Tools for motion.",
        es: "Herramientas.",
        fr: "Outils motion.",
      }),
      studio: t({
        en: "Creative partners.",
        es: "Socios creativos.",
        fr: "Partenaires créatifs.",
      }),
      skill: t({
        en: "Agent skills.",
        es: "Skills para agentes.",
        fr: "Skills d’agents.",
      }),
      extra: t({
        en: "Extras for makers.",
        es: "Extras útiles.",
        fr: "Extras utiles.",
      }),
    },
    intros: {
      tool: t({
        en: "Editors, motion tools, AI video generators and mockup kits for your next product film.",
        es: "Editores, herramientas de motion, generadores de video con IA y mockups para tu próximo film.",
        fr: "Éditeurs, outils motion, générateurs vidéo IA et mockups pour votre prochain film produit.",
      }),
      studio: t({
        en: "Motion studios and independent designers who make memorable product films. Reach out directly.",
        es: "Estudios y diseñadores de motion que crean films de producto memorables. Contáctalos directamente.",
        fr: "Studios et designers motion indépendants qui créent des films produit marquants. Contactez-les.",
      }),
      skill: t({
        en: "Open-source skills that let your coding agent write, animate and render motion videos.",
        es: "Skills de código abierto para que tu agente escriba, anime y renderice videos de motion.",
        fr: "Des skills open source pour que votre agent écrive, anime et rende des vidéos motion.",
      }),
      extra: t({
        en: "Articles, guides and references for making motion videos and product films.",
        es: "Artículos, guías y referencias para crear videos de motion y films de producto.",
        fr: "Articles, guides et références pour créer des vidéos motion et des films produit.",
      }),
    },
    submit: {
      tool: t({
        en: "Submit a tool",
        es: "Enviar una herramienta",
        fr: "Proposer un outil",
      }),
      studio: t({
        en: "Submit a creative",
        es: "Enviar un creativo",
        fr: "Proposer un créatif",
      }),
      skill: t({
        en: "Submit a skill",
        es: "Enviar una habilidad",
        fr: "Proposer une compétence",
      }),
      extra: t({
        en: "Submit a resource",
        es: "Enviar un recurso",
        fr: "Proposer une ressource",
      }),
    },
    categories: t({
      en: "Filter by category",
      es: "Filtrar por categoría",
      fr: "Filtrer par catégorie",
    }),
    all: t({ en: "All", es: "Todo", fr: "Tout" }),
    // Chip and card labels, keyed by section and URL slug.
    labels: {
      tool: {
        ai: t({ en: "AI", es: "IA", fr: "IA" }),
        editors: t({ en: "Editors", es: "Editores", fr: "Montage" }),
        mockups: t({ en: "Mockups", es: "Maquetas", fr: "Maquettes" }),
        motion: t({ en: "Motion", es: "Movimiento", fr: "Motion design" }),
      },
      studio: {
        studios: t({ en: "Studios", es: "Estudios", fr: "Studios" }),
        designers: t({ en: "Designers", es: "Diseñadores", fr: "Designers" }),
      },
      skill: {
        motion: t({
          en: "Motion graphics",
          es: "Motion graphics",
          fr: "Motion design",
        }),
        "product-films": t({
          en: "Product films",
          es: "Vídeos de producto",
          fr: "Films produit",
        }),
        "ai-video": t({ en: "AI video", es: "Vídeo con IA", fr: "Vidéo IA" }),
      },
      extra: {
        articles: t({ en: "Articles", es: "Artículos", fr: "Articles" }),
        resources: t({ en: "Resources", es: "Recursos", fr: "Ressources" }),
      },
    },
    // Intro heading on each category page, e.g. /tools/ai.
    headings: {
      tool: {
        ai: t({
          en: "AI video tools.",
          es: "Video con IA.",
          fr: "Vidéo IA.",
        }),
        editors: t({
          en: "Video editors.",
          es: "Editores de video.",
          fr: "Éditeurs vidéo.",
        }),
        mockups: t({
          en: "Mockup tools.",
          es: "Mockups.",
          fr: "Mockups.",
        }),
        motion: t({
          en: "Motion design tools.",
          es: "Diseño de motion.",
          fr: "Outils de motion.",
        }),
      },
      studio: {
        studios: t({
          en: "Motion studios.",
          es: "Estudios de motion.",
          fr: "Studios motion.",
        }),
        designers: t({
          en: "Motion designers.",
          es: "Diseñadores.",
          fr: "Designers motion.",
        }),
      },
      skill: {
        motion: t({
          en: "Motion graphics.",
          es: "Motion graphics.",
          fr: "Motion design.",
        }),
        "product-films": t({
          en: "Product film skills.",
          es: "Films de producto.",
          fr: "Films produit.",
        }),
        "ai-video": t({
          en: "AI video skills.",
          es: "Video con IA.",
          fr: "Vidéo IA.",
        }),
      },
      extra: {
        articles: t({
          en: "X articles.",
          es: "Artículos de X.",
          fr: "Articles X.",
        }),
        resources: t({
          en: "Resources.",
          es: "Recursos.",
          fr: "Ressources.",
        }),
      },
    },
    descriptions: {
      tool: {
        ai: t({
          en: "AI video generators, avatars, voiceovers and AI-assisted editing for product films.",
          es: "Generadores de video con IA, avatares, voces y edición asistida para films de producto.",
          fr: "Générateurs vidéo IA, avatars, voix off et montage assisté pour films produit.",
        }),
        editors: t({
          en: "Video editors for product films, from browser and text-based to AI-assisted cutting.",
          es: "Editores para films de producto: en el navegador, basados en texto o asistidos por IA.",
          fr: "Éditeurs pour films produit : dans le navigateur, par le texte ou assistés par IA.",
        }),
        mockups: t({
          en: "Device and UI mockups for product videos: cinematic screens and product shots.",
          es: "Mockups de dispositivos e interfaces para videos: pantallas cinematográficas y tomas de producto.",
          fr: "Mockups d’appareils et d’interfaces : écrans cinématiques et plans produit.",
        }),
        motion: t({
          en: "Motion design tools and templates for launch videos, animated UI and product films.",
          es: "Herramientas y plantillas para videos de lanzamiento, interfaces animadas y films.",
          fr: "Outils et modèles pour vidéos de lancement, interfaces animées et films produit.",
        }),
      },
      studio: {
        studios: t({
          en: "Studios that make launch films and brand videos. Browse their work and reach out directly.",
          es: "Estudios que crean films de lanzamiento y videos de marca. Mira su trabajo y escríbeles.",
          fr: "Des studios qui créent films de lancement et vidéos de marque. Voyez leur travail, écrivez-leur.",
        }),
        designers: t({
          en: "Independent designers who make memorable product films. Browse their work and reach out.",
          es: "Diseñadores independientes que crean films de producto memorables. Mira su trabajo y escríbeles.",
          fr: "Des designers indépendants aux films produit marquants. Voyez leur travail, écrivez-leur.",
        }),
      },
      skill: {
        motion: t({
          en: "Code-rendered motion: animated HTML, Remotion and whiteboard videos your agent renders.",
          es: "Motion renderizado en código: HTML animado, Remotion y pizarras que renderiza tu agente.",
          fr: "Du motion rendu en code : HTML animé, Remotion et tableaux blancs rendus par votre agent.",
        }),
        "product-films": t({
          en: "Skills that turn your real product into demos and launch films, made by your agent.",
          es: "Skills que convierten tu producto real en demos y lanzamientos hechos por tu agente.",
          fr: "Des skills qui font de votre produit des démos et films de lancement, par votre agent.",
        }),
        "ai-video": t({
          en: "Skills for AI video production, from script and generated footage to voiceover and final cut.",
          es: "Skills para producir video con IA: guion, metraje generado, voz y montaje final.",
          fr: "Des skills de production vidéo IA : script, images générées, voix off et montage final.",
        }),
      },
      extra: {
        articles: t({
          en: "Long-form X articles on making motion videos with Claude Opus: workflows, prompts, breakdowns.",
          es: "Artículos largos de X sobre hacer motion con Claude Opus: flujos, prompts y análisis.",
          fr: "Articles X sur le motion avec Claude Opus : méthodes, prompts et décryptages.",
        }),
        resources: t({
          en: "References and archives for making motion videos and product films.",
          es: "Referencias y archivos para crear videos de motion y films de producto.",
          fr: "Références et archives pour créer des vidéos motion et des films produit.",
        }),
      },
    },
    visit: t({
      en: "Visit website",
      es: "Visitar sitio web",
      fr: "Visiter le site",
    }),
    newTab: t({
      en: "opens in a new tab",
      es: "se abre en una pestaña nueva",
      fr: "s’ouvre dans un nouvel onglet",
    }),
    surprise: t({ en: "Surprise me", es: "Sorpréndeme", fr: "Surprenez-moi" }),
  },
} satisfies Dictionary;
