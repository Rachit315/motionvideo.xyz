import { Link, createFileRoute } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";

import {
  LegalPageHeader,
  PageList,
  PageSection,
  SupportEmail,
} from "@/components/page";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { breadcrumbJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

const linkClass = "text-foreground underline underline-offset-4";

// What a MotionVideo Skill Bundle purchase lets you do with the files, and
// what it doesn't: personal and client use yes, sharing or reselling no.
const License = () => {
  const copy = useIntlayer("legal-license");

  return (
    <>
      <LegalPageHeader title={copy.title.value} />
      <p className="text-muted-foreground leading-7">
        {copy.intro}{" "}
        <Link to={ROUTES.TERMS} className={linkClass}>
          {copy.terms}
        </Link>
        .
      </p>

      <PageSection title={copy.allowedTitle.value}>
        <PageList>
          {copy.allowed.map((item) => (
            <li key={item.value}>{item}</li>
          ))}
        </PageList>
      </PageSection>

      <PageSection title={copy.forbiddenTitle.value}>
        <PageList>
          {copy.forbidden.map((item) => (
            <li key={item.value}>{item}</li>
          ))}
        </PageList>
      </PageSection>

      <PageSection title={copy.teamsTitle.value}>
        <p>
          {copy.teams} <SupportEmail />.
        </p>
      </PageSection>

      <PageSection title={copy.ownershipTitle.value}>
        <p>{copy.ownership}</p>
      </PageSection>

      <PageSection title={copy.endTitle.value}>
        <p>{copy.end}</p>
      </PageSection>

      <PageSection title={copy.warrantyTitle.value}>
        <p>{copy.warranty}</p>
      </PageSection>

      <PageSection title={copy.contactTitle.value}>
        <p>
          {copy.contact} <SupportEmail />.
        </p>
      </PageSection>
    </>
  );
};

export const Route = createFileRoute("/_pages/license")({
  component: License,
  head: () => ({
    ...createMetadata({
      canonical: ROUTES.LICENSE,
      description: `What the ${SITE.NAME} Skill Bundle license allows: personal and client work, not sharing or reselling the files.`,
      title: "Skill license",
    }),
    scripts: [breadcrumbJsonLd({ name: "License", path: ROUTES.LICENSE })],
  }),
});
