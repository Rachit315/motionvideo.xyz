import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useIntlayer } from "react-intlayer";

import { Brand } from "@/components/brand";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Turnstile } from "@/components/turnstile";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CAPTCHA_HEADER, WELCOME_HEADER } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import { track } from "@/lib/analytics";
import { authClient } from "@/lib/auth-client";

const CODE_LENGTH = 6;
const textButtonClass =
  "hover:text-foreground cursor-pointer underline underline-offset-4 transition-colors disabled:opacity-50";

type LoginError = "sending" | "rate-limit" | "invalid-code" | "attempts";

// Brand, the form, and the legal footer. It fills its container (the
// /sign-in column or the dialog) and sets its own base text size, so both
// render the same.
export const AuthCard = ({ children }: { children: ReactNode }) => {
  const content = useIntlayer("account");
  return (
    <div className="flex w-full flex-col gap-6 text-base">
      <div className="flex justify-center">
        <Brand />
      </div>
      {children}
      <FieldDescription className="flex items-center justify-center gap-2 text-center">
        <a href={ROUTES.TERMS}>{content.terms}</a>
        <span aria-hidden>·</span>
        <a href={ROUTES.PRIVACY}>{content.privacy}</a>
      </FieldDescription>
      <div className="flex justify-center">
        <LocaleSwitcher />
      </div>
    </div>
  );
};

/** Title and one line, centred, at the top of each step. */
export const AuthHeading = ({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-3 text-center">
    <h1 className="text-xl font-semibold">{title}</h1>
    <FieldDescription className="text-center">{children}</FieldDescription>
  </div>
);

/**
 * Email-code sign-in, used by `/sign-in`, the sign-in dialog and `/welcome`:
 * enter an email, receive a six-digit code, enter it. Any email works; the
 * account is created on first sign-in. Once signed in it goes to
 * `callbackURL` when given (the dialog closes itself instead).
 */
export const LoginForm = ({
  callbackURL,
  description,
  presetEmail,
  welcome = false,
  title,
}: {
  callbackURL?: string;
  /** Replaces the line under the first step's title. */
  description?: ReactNode;
  /** Skip the email step: send a code to this address straight away. */
  presetEmail?: string;
  /** Send the code in the post-checkout welcome email (/welcome). */
  welcome?: boolean;
  /** Replaces the code step's title. */
  title?: ReactNode;
}) => {
  const content = useIntlayer("account");
  const emailId = useId();
  const codeId = useId();
  const [email, setEmail] = useState(presetEmail ?? "");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">(
    presetEmail ? "code" : "email"
  );
  const [busy, setBusy] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const [verified, setVerified] = useState(false);
  const codeForm = useRef<HTMLFormElement>(null);
  // Turnstile: a token is needed to send a code, and each one is single-use.
  // The buttons never wait for it: a send before the first token arrives
  // shows "Sending…" until it does.
  const captcha = useRef<string | null>(null);
  const captchaWaiters = useRef<((token: string) => void)[]>([]);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [captchaReset, setCaptchaReset] = useState(0);
  const onCaptcha = (token: string | null) => {
    captcha.current = token;
    setCaptchaReady(token !== null);
    if (token) {
      for (const resolve of captchaWaiters.current.splice(0)) {
        resolve(token);
      }
    }
  };
  const nextCaptcha = () =>
    captcha.current ??
    // Settled by onCaptcha, a callback with no promise of its own.
    // oxlint-disable-next-line promise/avoid-new
    new Promise<string>((resolve) => {
      captchaWaiters.current.push(resolve);
    });

  const sendCode = async (address: string) => {
    setBusy(true);
    setError(null);
    const token = await nextCaptcha();
    // Spent: the next send waits for the fresh token the reset brings.
    captcha.current = null;
    const headers = {
      [CAPTCHA_HEADER]: token,
      [WELCOME_HEADER]: welcome ? "1" : "0",
    };
    const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
      email: address,
      type: "sign-in",
      fetchOptions: { headers },
    });
    setBusy(false);
    setCaptchaReset((count) => count + 1);
    if (sendError) {
      setError(sendError.status === 429 ? "rate-limit" : "sending");
      return false;
    }
    track("sign_in_code_sent", { welcome });
    return true;
  };

  // /welcome: the buyer's email is known, so the code goes out as soon as
  // Turnstile hands over its first token.
  const autoSent = useRef(false);
  useEffect(() => {
    if (presetEmail && captchaReady && !autoSent.current) {
      autoSent.current = true;
      void sendCode(presetEmail);
    }
  });

  const onEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) {
      return;
    }
    if (await sendCode(email)) {
      setCode("");
      setResent(false);
      setStep("code");
    }
  };

  const onCodeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || code.length !== CODE_LENGTH) {
      return;
    }
    setBusy(true);
    setError(null);
    const { error: verifyError } = await authClient.signIn.emailOtp({
      email,
      otp: code,
    });
    if (verifyError) {
      setBusy(false);
      if (verifyError.status === 429) {
        setError("rate-limit");
      } else if (verifyError.code === "TOO_MANY_ATTEMPTS") {
        setError("attempts");
      } else {
        setError("invalid-code");
      }
      return;
    }
    setVerified(true);
    track("sign_in");
    if (callbackURL) {
      // A full load, so every loader sees the new session.
      window.location.assign(callbackURL);
    }
  };

  const resend = async () => {
    if (await sendCode(email)) {
      setCode("");
      setResent(true);
    }
  };

  const errorMessages = {
    sending: content.sendError,
    "rate-limit": content.rateLimited,
    "invalid-code": content.invalidCode,
    attempts: content.tooManyAttempts,
  };

  return (
    <AuthCard>
      {step === "email" ? (
        <div className="flex flex-col gap-6">
          <AuthHeading title={content.signInTitle}>
            {description ?? content.signInDescription}
          </AuthHeading>
          <form onSubmit={onEmailSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={emailId}>{content.email}</FieldLabel>
                <Input
                  className="h-9"
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  required
                  placeholder={content.emailPlaceholder.value}
                  // oxlint-disable-next-line jsx-a11y/no-autofocus -- the only field of this step
                  autoFocus
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>
              {error && <FieldError>{errorMessages[error]}</FieldError>}
              <Field>
                <Button type="submit" size="lg" disabled={busy}>
                  {busy ? content.sending : content.sendCode}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <AuthHeading title={title ?? content.checkEmail}>
            {content.sentCode} <strong>{email}</strong>. {content.expires}
          </AuthHeading>
          <form ref={codeForm} onSubmit={onCodeSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={codeId} className="sr-only">
                  {content.code}
                </FieldLabel>
                <InputOTP
                  id={codeId}
                  maxLength={CODE_LENGTH}
                  value={code}
                  onChange={setCode}
                  // Submits as soon as the last digit lands (typed or pasted).
                  onComplete={() => codeForm.current?.requestSubmit()}
                  aria-invalid={
                    error === "invalid-code" || error === "attempts"
                  }
                  success={verified}
                  // oxlint-disable-next-line jsx-a11y/no-autofocus -- the only field of this step
                  autoFocus
                  containerClassName="justify-center"
                >
                  <InputOTPGroup>
                    {Array.from({ length: CODE_LENGTH }, (_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </Field>
              {error && <FieldError>{errorMessages[error]}</FieldError>}
              {resent && !error && (
                <FieldDescription>{content.resent}</FieldDescription>
              )}
              <Field>
                <Button
                  type="submit"
                  size="lg"
                  disabled={busy || code.length !== CODE_LENGTH}
                >
                  {busy ? content.signingIn : content.signIn}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <FieldDescription className="flex items-center justify-center gap-2 text-center">
            {!presetEmail && (
              <>
                <button
                  type="button"
                  className={textButtonClass}
                  onClick={() => {
                    setError(null);
                    setStep("email");
                  }}
                >
                  {content.changeEmail}
                </button>
                <span aria-hidden>·</span>
              </>
            )}
            <button
              type="button"
              className={textButtonClass}
              onClick={resend}
              disabled={busy}
            >
              {content.resend}
            </button>
          </FieldDescription>
        </div>
      )}
      {/* One widget for both steps (kept mounted), so a fresh token is
          ready for "Send a new code" too. */}
      <Turnstile onToken={onCaptcha} resetKey={captchaReset} />
    </AuthCard>
  );
};
