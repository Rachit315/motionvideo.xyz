import { SITE } from "../constants/site";
import { EmailLayout, Paragraph } from "./_layout";

export interface WelcomeEmailProps {
  code: string;
  /** From the Dodo Payments customer; null when the buyer left it blank. */
  firstName: string | null;
}

export const welcomeSubject = ({
  firstName,
}: Pick<WelcomeEmailProps, "firstName">) =>
  `${firstName ? `${firstName}, thanks` : "Thanks"} for buying ${SITE.NAME}`;

// Sent instead of the plain sign-in email when the code is requested from
// /welcome, right after checkout.
const WelcomeEmail = ({ code, firstName }: WelcomeEmailProps) => (
  <EmailLayout
    code={code}
    heading={`${firstName ? `Welcome aboard, ${firstName}` : "Welcome aboard"}!`}
    preview="Your purchase is confirmed. Here’s your sign-in code."
    reason={`You received this because you bought ${SITE.NAME} on`}
  >
    <Paragraph>
      Thanks for buying {SITE.NAME}. Your order is confirmed.
    </Paragraph>
    <Paragraph>
      Sign in, open the Dodo Payments customer portal from your dashboard,
      connect your GitHub account, and accept the private repository invite.
    </Paragraph>
    <Paragraph>
      Enter the code below on the page you just paid on; it expires in 10
      minutes. Questions or ideas? Just reply, it comes straight to me.
    </Paragraph>
    <Paragraph>— Aniket</Paragraph>
  </EmailLayout>
);

WelcomeEmail.PreviewProps = {
  firstName: "Aniket",
  code: "482913",
} satisfies WelcomeEmailProps;

export default WelcomeEmail;
