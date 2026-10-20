import type { ReactElement } from "react";
import { render } from "react-email";

// HTML plus a plain-text alternative, which spam filters and text-only
// clients expect alongside HTML.
export const renderEmail = async (
  email: ReactElement
): Promise<{ html: string; text: string }> => {
  const [html, text] = await Promise.all([
    render(email),
    render(email, { plainText: true }),
  ]);
  return { html, text };
};
