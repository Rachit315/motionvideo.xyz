import { t } from "intlayer";
import type { Dictionary } from "intlayer";

export default {
  key: "settings-page",
  content: {
    title: t({ en: "Settings", es: "Ajustes", fr: "Réglages" }),
    intro: t({
      en: "Your account preferences.",
      es: "Tus preferencias de cuenta.",
      fr: "Vos préférences de compte.",
    }),
    account: t({ en: "Account", es: "Cuenta", fr: "Compte" }),
    accountBody: t({
      en: "How you appear and the email you sign in with.",
      es: "Cómo apareces y el correo con el que inicias sesión.",
      fr: "Votre apparence et l’e-mail avec lequel vous vous connectez.",
    }),
    email: t({ en: "Email", es: "Correo", fr: "E-mail" }),
    avatar: t({ en: "Avatar", es: "Avatar", fr: "Avatar" }),
    name: t({ en: "Name", es: "Nombre", fr: "Nom" }),
    noName: t({ en: "Not set", es: "Sin definir", fr: "Non défini" }),
    edit: t({ en: "Edit", es: "Editar", fr: "Modifier" }),
    save: t({ en: "Save", es: "Guardar", fr: "Enregistrer" }),
    saving: t({ en: "Saving…", es: "Guardando…", fr: "Enregistrement…" }),
    cancel: t({ en: "Cancel", es: "Cancelar", fr: "Annuler" }),
    saveError: t({
      en: "Could not save. Try again.",
      es: "No se pudo guardar. Inténtalo de nuevo.",
      fr: "Enregistrement impossible. Réessayez.",
    }),
    connections: t({
      en: "Connections",
      es: "Conexiones",
      fr: "Connexions",
    }),
    connectionsBody: t({
      en: "Other ways to sign in to this account.",
      es: "Otras formas de iniciar sesión en esta cuenta.",
      fr: "D’autres façons de vous connecter à ce compte.",
    }),
    connected: t({ en: "Connected", es: "Conectado", fr: "Connecté" }),
    connect: t({ en: "Connect", es: "Conectar", fr: "Connecter" }),
    preferences: t({
      en: "Preferences",
      es: "Preferencias",
      fr: "Préférences",
    }),
    preferencesBody: t({
      en: "How the site behaves for you.",
      es: "Cómo se comporta el sitio para ti.",
      fr: "Le comportement du site pour vous.",
    }),
    language: t({ en: "Language", es: "Idioma", fr: "Langue" }),
    cursors: t({ en: "Cursors", es: "Cursores", fr: "Curseurs" }),
    cursorsHelp: t({
      en: "See and share live cursors with other visitors.",
      es: "Ver y compartir cursores en vivo con otros visitantes.",
      fr: "Voir et partager les curseurs en direct avec les autres visiteurs.",
    }),
    delete: t({ en: "Delete", es: "Eliminar", fr: "Supprimer" }),
    emailsBody: t({
      en: "What we send you, besides sign-in codes and receipts.",
      es: "Lo que te enviamos, además de los códigos de acceso y los recibos.",
      fr: "Ce que nous vous envoyons, en plus des codes de connexion et des reçus.",
    }),
    danger: t({
      en: "Danger zone",
      es: "Zona de peligro",
      fr: "Zone de danger",
    }),
    dangerBody: t({
      en: "Permanent and can’t be undone.",
      es: "Es permanente y no se puede deshacer.",
      fr: "Définitif et irréversible.",
    }),
    deleteAccount: t({
      en: "Delete account",
      es: "Eliminar cuenta",
      fr: "Supprimer le compte",
    }),
    deleteNote: t({
      en: "Removes your account, submissions, and bookmarks.",
      es: "Elimina tu cuenta, tus propuestas y tus guardados.",
      fr: "Supprime votre compte, vos propositions et vos favoris.",
    }),
    emails: t({ en: "Emails", es: "Correos", fr: "E-mails" }),
    updates: t({
      en: "MotionVideo updates",
      es: "Novedades de MotionVideo",
      fr: "Actualités de MotionVideo",
    }),
    updatesDescription: t({
      en: "New features and featured work, occasionally.",
      es: "Novedades y trabajo destacado, de vez en cuando.",
      fr: "Nouveautés et œuvres à l’honneur, occasionnellement.",
    }),
  },
} satisfies Dictionary;
