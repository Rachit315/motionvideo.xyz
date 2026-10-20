import { SITE } from "../constants/site";
import { EmailLayout, Paragraph } from "./_layout";

export const signInSubject = (code: string) =>
  `${code} is your ${SITE.NAME} sign-in code`;

const SignInEmail = ({ code }: { code: string }) => (
  <EmailLayout
    code={code}
    heading={`Sign in to ${SITE.NAME}`}
    preview="Your sign-in code expires in 10 minutes."
    reason="You received this because this address was used to sign in on"
  >
    <Paragraph>
      Enter this code on {SITE.NAME} to sign in. It expires in 10 minutes.
    </Paragraph>
    <Paragraph>
      If you didn’t ask to sign in, you can ignore this email.
    </Paragraph>
  </EmailLayout>
);

SignInEmail.PreviewProps = { code: "482913" };

export default SignInEmail;
