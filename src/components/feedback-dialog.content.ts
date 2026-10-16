import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "feedback-dialog",
  content: {
    trigger: t({ en: "Feedback", es: "Comentarios", fr: "Avis" }),
    title: t({
      en: "Share feedback",
      es: "Envía tus comentarios",
      fr: "Donnez votre avis",
    }),
    description: t({
      en: "What works, what’s missing, what broke. Every message is read.",
      es: "Qué funciona, qué falta, qué se rompió. Leemos cada mensaje.",
      fr: "Ce qui marche, ce qui manque, ce qui casse. Chaque message est lu.",
    }),
    moodLabel: t({
      en: "How is MotionVideo so far?",
      es: "¿Qué te parece MotionVideo hasta ahora?",
      fr: "Que pensez-vous de MotionVideo jusqu’ici ?",
    }),
    moods: {
      love: t({ en: "Love it", es: "Me encanta", fr: "J’adore" }),
      okay: t({ en: "It’s okay", es: "Está bien", fr: "Pas mal" }),
      bad: t({ en: "Not great", es: "No me convence", fr: "Bof" }),
    },
    message: t({
      en: "Your feedback",
      es: "Tus comentarios",
      fr: "Votre avis",
    }),
    messagePlaceholder: t({
      en: "Tell us anything: an idea, a bug, a video we should add…",
      es: "Cuéntanos lo que quieras: una idea, un error, un vídeo que deberíamos añadir…",
      fr: "Dites-nous tout : une idée, un bug, une vidéo à ajouter…",
    }),
    email: t({
      en: "Email (optional, if you’d like a reply)",
      es: "Correo (opcional, si quieres respuesta)",
      fr: "E-mail (facultatif, pour recevoir une réponse)",
    }),
    emailPlaceholder: t({
      en: "you@example.com",
      es: "tu@ejemplo.com",
      fr: "vous@exemple.com",
    }),
    signedInAs: t({
      en: "We’ll reply to your account email if needed.",
      es: "Te responderemos al correo de tu cuenta si hace falta.",
      fr: "Nous répondrons à l’e-mail de votre compte si besoin.",
    }),
    send: t({ en: "Send feedback", es: "Enviar", fr: "Envoyer" }),
    sending: t({ en: "Sending…", es: "Enviando…", fr: "Envoi…" }),
    enter: t({ en: "Enter", es: "Intro", fr: "Entrée" }),
    toSend: t({ en: "to send", es: "para enviar", fr: "pour envoyer" }),
    validationError: t({
      en: "Write a few words, and check the email address if you added one.",
      es: "Escribe unas palabras y revisa el correo si lo añadiste.",
      fr: "Écrivez quelques mots et vérifiez l’e-mail si vous en avez saisi un.",
    }),
    rateLimitError: t({
      en: "Too many messages. Try again in a minute.",
      es: "Demasiados mensajes. Inténtalo de nuevo en un minuto.",
      fr: "Trop de messages. Réessayez dans une minute.",
    }),
    sendError: t({
      en: "Couldn’t send that. Please try again.",
      es: "No se pudo enviar. Inténtalo de nuevo.",
      fr: "Envoi impossible. Veuillez réessayer.",
    }),
    thanksTitle: t({
      en: "Thanks for the feedback",
      es: "Gracias por tus comentarios",
      fr: "Merci pour votre avis",
    }),
    thanksBody: t({
      en: "It’s in. It helps decide what gets built next.",
      es: "Recibido. Nos ayuda a decidir qué construir después.",
      fr: "C’est reçu. Cela aide à décider de la suite.",
    }),
    done: t({ en: "Done", es: "Listo", fr: "Terminé" }),
  },
} satisfies Dictionary;
