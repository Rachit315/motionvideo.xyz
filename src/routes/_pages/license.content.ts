import { t } from "intlayer";
import type { Dictionary } from "intlayer";

const licenseContent = {
  key: "legal-license",
  content: {
    title: t({
      en: "Skill license",
      es: "Licencia del skill",
      fr: "Licence du skill",
    }),
    intro: t({
      en: "This license covers the MotionVideo Skill Bundle: the SKILL.md files, scene starters, motion tokens, scripts and everything else in its private repository. Buying it gives you a license to use the files; you are not buying the files themselves. It sits alongside our",
      es: "Esta licencia cubre el MotionVideo Skill Bundle: los archivos SKILL.md, plantillas de escenas, tokens de motion, scripts y todo lo demás de su repositorio privado. Al comprarlo obtienes una licencia de uso de los archivos, no los archivos en sí. Complementa nuestras",
      fr: "Cette licence couvre le MotionVideo Skill Bundle : les fichiers SKILL.md, amorces de scènes, tokens de motion, scripts et tout le reste de son dépôt privé. L’achat vous donne une licence d’utilisation des fichiers, pas les fichiers eux-mêmes. Elle complète nos",
    }),
    terms: t({
      en: "terms of service",
      es: "condiciones de servicio",
      fr: "conditions d’utilisation",
    }),
    allowedTitle: t({
      en: "1. What you can do",
      es: "1. Qué puedes hacer",
      fr: "1. Ce que vous pouvez faire",
    }),
    allowed: [
      t({
        en: "Use the skill with any coding agent, on any number of your own machines.",
        es: "Usar el skill con cualquier agente de código, en tantos equipos propios como quieras.",
        fr: "Utiliser le skill avec n’importe quel agent de code, sur autant de vos machines que vous voulez.",
      }),
      t({
        en: "Make unlimited videos for yourself and for clients, including paid client work.",
        es: "Crear videos ilimitados para ti y para clientes, incluido trabajo de pago.",
        fr: "Créer des vidéos sans limite pour vous et pour vos clients, y compris en mission payée.",
      }),
      t({
        en: "Edit the files for your own use.",
        es: "Modificar los archivos para tu propio uso.",
        fr: "Modifier les fichiers pour votre propre usage.",
      }),
      t({
        en: "Own, publish and sell the videos you make. The outputs are yours.",
        es: "Ser dueño de los videos que crees, publicarlos y venderlos. Los resultados son tuyos.",
        fr: "Posséder, publier et vendre les vidéos que vous créez. Elles vous appartiennent.",
      }),
    ],
    forbiddenTitle: t({
      en: "2. What you can’t do",
      es: "2. Qué no puedes hacer",
      fr: "2. Ce que vous ne pouvez pas faire",
    }),
    forbidden: [
      t({
        en: "Share, resell, sublicense or give away the files, in original or edited form.",
        es: "Compartir, revender, sublicenciar o regalar los archivos, originales o modificados.",
        fr: "Partager, revendre, sous-licencier ou donner les fichiers, d’origine ou modifiés.",
      }),
      t({
        en: "Publish them in a public repository, skill registry, marketplace, template pack or course.",
        es: "Publicarlos en un repositorio público, registro de skills, marketplace, pack de plantillas o curso.",
        fr: "Les publier dans un dépôt public, un registre de skills, une marketplace, un pack de modèles ou un cours.",
      }),
      t({
        en: "Build them into a product, tool or service that lets others use the skill without their own license.",
        es: "Integrarlos en un producto, herramienta o servicio que permita a otros usar el skill sin su propia licencia.",
        fr: "Les intégrer à un produit, outil ou service qui permet à d’autres d’utiliser le skill sans leur propre licence.",
      }),
      t({
        en: "Share your repository access, invite others to it, or use the files to train or fine-tune AI models.",
        es: "Compartir tu acceso al repositorio, invitar a otros o usar los archivos para entrenar o ajustar modelos de IA.",
        fr: "Partager votre accès au dépôt, y inviter d’autres personnes ou utiliser les fichiers pour entraîner ou affiner des modèles d’IA.",
      }),
      t({
        en: "Use them to make a competing skill, prompt pack or motion design product.",
        es: "Usarlos para crear un skill, pack de prompts o producto de motion competidor.",
        fr: "Les utiliser pour créer un skill, un pack de prompts ou un produit de motion concurrent.",
      }),
    ],
    teamsTitle: t({
      en: "3. Teams and agencies",
      es: "3. Equipos y agencias",
      fr: "3. Équipes et agences",
    }),
    teams: t({
      en: "One license is for one person. Everyone on a team who uses the skill needs their own license. For a team license, email us at",
      es: "Una licencia es para una persona. Cada miembro del equipo que use el skill necesita su propia licencia. Para una licencia de equipo, escríbenos a",
      fr: "Une licence vaut pour une personne. Chaque membre d’une équipe qui utilise le skill a besoin de sa propre licence. Pour une licence d’équipe, écrivez-nous à",
    }),
    ownershipTitle: t({
      en: "4. Ownership",
      es: "4. Propiedad",
      fr: "4. Propriété",
    }),
    ownership: t({
      en: "The skill files, their structure and their wording remain ours. Updates pushed to the repository are covered by the same license.",
      es: "Los archivos del skill, su estructura y su redacción siguen siendo nuestros. Las actualizaciones del repositorio quedan cubiertas por la misma licencia.",
      fr: "Les fichiers du skill, leur structure et leur rédaction restent les nôtres. Les mises à jour du dépôt relèvent de la même licence.",
    }),
    endTitle: t({
      en: "5. Breaking the license",
      es: "5. Incumplimiento",
      fr: "5. Non-respect de la licence",
    }),
    end: t({
      en: "If you break these terms, your license ends, your repository access is removed, and no refund is due. Videos you made before then stay yours.",
      es: "Si incumples estas condiciones, tu licencia termina, se retira tu acceso al repositorio y no corresponde reembolso. Los videos que hiciste antes siguen siendo tuyos.",
      fr: "En cas de non-respect, votre licence prend fin, votre accès au dépôt est retiré et aucun remboursement n’est dû. Les vidéos créées avant restent les vôtres.",
    }),
    warrantyTitle: t({
      en: "6. No warranty",
      es: "6. Sin garantía",
      fr: "6. Absence de garantie",
    }),
    warranty: t({
      en: "The skill is provided as is. Results depend on your agent, model and prompts, and we don’t guarantee any particular output.",
      es: "El skill se ofrece tal cual. Los resultados dependen de tu agente, modelo y prompts, y no garantizamos ningún resultado concreto.",
      fr: "Le skill est fourni tel quel. Les résultats dépendent de votre agent, modèle et prompts, et nous ne garantissons aucun résultat précis.",
    }),
    contactTitle: t({
      en: "7. Questions",
      es: "7. Preguntas",
      fr: "7. Questions",
    }),
    contact: t({
      en: "Not sure whether something is allowed? Ask first at",
      es: "¿No sabes si algo está permitido? Pregunta antes en",
      fr: "Un doute sur ce qui est autorisé ? Demandez d’abord à",
    }),
  },
} satisfies Dictionary;

export default licenseContent;
