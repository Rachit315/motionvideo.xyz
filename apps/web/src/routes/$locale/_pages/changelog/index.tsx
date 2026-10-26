import { Link, createFileRoute } from "@tanstack/react-router";
import { getIntlayer } from "intlayer";
import { useIntlayer, useLocale } from "react-intlayer";

import { PageHeader } from "@/components/page";
import { DEFAULT_LOCALE, isLocale } from "@/constants/locales";
import { ROUTES } from "@/constants/routes";
import { CHANGELOG_ENTRIES, formatChangelogDate } from "@/lib/changelog";
import { breadcrumbJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

const Changelog = () => {
  const content = useIntlayer("changelog");
  const { locale } = useLocale();
  return (
    <>
      <PageHeader
        title={content.title.value}
        intro={
          locale === DEFAULT_LOCALE
            ? content.intro
            : `${content.intro.value} ${content.englishOnly.value}`
        }
      />
      <ol className="flex flex-col">
        {CHANGELOG_ENTRIES.map((entry) => (
          <li
            key={entry.url}
            className="grid gap-1 border-t py-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6"
          >
            <time
              dateTime={entry.data.date}
              className="text-muted-foreground text-sm sm:pt-0.5"
            >
              {formatChangelogDate(entry.data.date, locale)}
            </time>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold tracking-tight">
                <Link
                  to="/$locale/changelog/$slug"
                  params={{ locale, slug: entry.slugs.join("/") }}
                  className="hover:underline hover:underline-offset-4"
                >
                  {entry.data.title}
                </Link>
              </h2>
              <p className="text-muted-foreground text-pretty">
                {entry.data.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
};

export const Route = createFileRoute("/$locale/_pages/changelog/")({
  component: Changelog,
  head: ({ params }) => {
    const content = getIntlayer(
      "changelog",
      isLocale(params.locale) ? params.locale : DEFAULT_LOCALE
    );
    return {
      ...createMetadata({
        description: content.intro,
        title: content.title,
      }),
      scripts: [
        breadcrumbJsonLd(
          { page: "changelog", path: ROUTES.CHANGELOG },
          params.locale
        ),
      ],
    };
  },
});
