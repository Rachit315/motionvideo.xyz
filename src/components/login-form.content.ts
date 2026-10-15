import { t } from "intlayer";
import type { Dictionary } from "intlayer";

const account = {
  key: "account",
  content: {
    terms: t({ en: "Terms", es: "Términos", fr: "Conditions" }),
    privacy: t({ en: "Privacy", es: "Privacidad", fr: "Confidentialité" }),
    signInTitle: t({
      en: "Sign in or create an account",
      es: "Inicia sesión o crea una cuenta",
      fr: "Connectez-vous ou créez un compte",
    }),
    signInDescription: t({
      en: "We’ll email you a 6-digit code. New here? Your account is created when you sign in.",
      es: "Te enviaremos un código de 6 dígitos por correo. ¿Eres nuevo? Tu cuenta se crea al iniciar sesión.",
      fr: "Nous vous enverrons un code à 6 chiffres par e-mail. Nouveau ici ? Votre compte est créé à la connexion.",
    }),
    email: t({ en: "Email", es: "Correo electrónico", fr: "Adresse e-mail" }),
    emailPlaceholder: t({
      en: "you@example.com",
      es: "tu@ejemplo.com",
      fr: "vous@exemple.com",
    }),
    sending: t({ en: "Sending…", es: "Enviando…", fr: "Envoi en cours…" }),
    sendCode: t({
      en: "Send code",
      es: "Enviar código",
      fr: "Envoyer le code",
    }),
    code: t({ en: "Code", es: "Código", fr: "Code" }),
    signIn: t({ en: "Sign in", es: "Iniciar sesión", fr: "Se connecter" }),
    signingIn: t({
      en: "Signing in…",
      es: "Iniciando sesión…",
      fr: "Connexion…",
    }),
    changeEmail: t({
      en: "Use a different email",
      es: "Usar otro correo",
      fr: "Utiliser une autre adresse",
    }),
    resend: t({
      en: "Send a new code",
      es: "Enviar un código nuevo",
      fr: "Envoyer un nouveau code",
    }),
    resent: t({
      en: "New code sent.",
      es: "Código nuevo enviado.",
      fr: "Nouveau code envoyé.",
    }),
    checkEmail: t({
      en: "Check your email",
      es: "Revisa tu correo",
      fr: "Consultez votre messagerie",
    }),
    sentCode: t({
      en: "We sent a 6-digit code to",
      es: "Hemos enviado un código de 6 dígitos a",
      fr: "Nous avons envoyé un code à 6 chiffres à",
    }),
    expires: t({
      en: "It expires in 10 minutes.",
      es: "Caduca en 10 minutos.",
      fr: "Il expire dans 10 minutes.",
    }),
    invalidCode: t({
      en: "That code is wrong or expired. Check it, or send a new one.",
      es: "Ese código no es correcto o ha caducado. Revísalo o pide uno nuevo.",
      fr: "Ce code est erroné ou expiré. Vérifiez-le ou demandez-en un nouveau.",
    }),
    tooManyAttempts: t({
      en: "Too many tries with that code. Send a new one.",
      es: "Demasiados intentos con ese código. Pide uno nuevo.",
      fr: "Trop d’essais avec ce code. Demandez-en un nouveau.",
    }),
    sendError: t({
      en: "Could not send the sign-in code. Try again.",
      es: "No se ha podido enviar el código de acceso. Inténtalo de nuevo.",
      fr: "Impossible d’envoyer le code de connexion. Réessayez.",
    }),
    rateLimited: t({
      en: "Too many sign-in requests. Wait a minute and try again.",
      es: "Demasiadas solicitudes de acceso. Espera un minuto e inténtalo de nuevo.",
      fr: "Trop de demandes de connexion. Patientez une minute et réessayez.",
    }),
    thanks: t({
      en: "Thanks for buying",
      es: "Gracias por comprar",
      fr: "Merci d’avoir acheté",
    }),
    confirming: t({
      en: "Confirming your payment",
      es: "Confirmando tu pago",
      fr: "Confirmation de votre paiement",
    }),
    checkAgain: t({
      en: "Check again",
      es: "Comprobar de nuevo",
      fr: "Vérifier à nouveau",
    }),
    seconds: t({
      en: "This usually takes a few seconds.",
      es: "Esto suele tardar unos segundos.",
      fr: "Cela prend généralement quelques secondes.",
    }),
    opening: t({ en: "Opening…", es: "Abriendo…", fr: "Ouverture en cours…" }),
    portal: t({
      en: "Open customer portal",
      es: "Abrir el portal de clientes",
      fr: "Ouvrir le portail client",
    }),
    portalPreview: t({
      en: "Customer portal (preview)",
      es: "Portal de clientes (vista previa)",
      fr: "Portail client (aperçu)",
    }),
    own: t({ en: "You own", es: "Ya tienes", fr: "Vous possédez" }),
    portalDescription: t({
      en: "Open the customer portal to connect your GitHub account and get access to the private skill pack repository. Receipts and invoices live there too.",
      es: "Abre el portal de clientes para conectar tu cuenta de GitHub y acceder al repositorio privado del paquete de habilidades. Allí también encontrarás los recibos y las facturas.",
      fr: "Ouvrez le portail client pour connecter votre compte GitHub et accéder au dépôt privé du pack de compétences. Vous y trouverez également vos reçus et factures.",
    }),
    get: t({ en: "Get", es: "Consigue", fr: "Obtenez" }),
    purchaseDescription: t({
      en: "One-time purchase. You’ll get access to the private skill pack repository and every future update.",
      es: "Compra única. Tendrás acceso al repositorio privado del paquete de habilidades y a todas las futuras actualizaciones.",
      fr: "Achat unique. Vous aurez accès au dépôt privé du pack de compétences et à toutes les mises à jour futures.",
    }),
    dashboard: t({ en: "Dashboard", es: "Panel", fr: "Tableau de bord" }),
    localPreview: t({
      en: "Local UI preview",
      es: "Vista previa local de la interfaz",
      fr: "Aperçu local de l’interface",
    }),
    signOut: t({ en: "Sign out", es: "Cerrar sesión", fr: "Se déconnecter" }),
  },
} satisfies Dictionary;

export default account;
