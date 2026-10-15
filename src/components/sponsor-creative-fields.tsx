import { useIntlayer } from "react-intlayer";

import { ImageDropzone } from "@/components/image-dropzone";
import { FormSection } from "@/components/page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUBMISSION_CATEGORIES, SUBMISSION_KINDS } from "@/lib/community";
import type { SubmissionKind } from "@/lib/community";
import type { DirectorySlug } from "@/lib/directories";
import { SPONSOR_NAME_MAX, SPONSOR_TAGLINE_MAX } from "@/lib/sponsorships";
import { imageRefSchema } from "@/lib/uploads";

// The placement a sponsor fills in, shared by the checkout form on
// /sponsorships/new and the edit form of a paid sponsorship on /sponsorships.

export interface CreativeFields {
  name: string;
  url: string;
  tagline: string;
  logo: string;
  cover: string;
  categoryKind: SubmissionKind | null;
  category: string | null;
  darkInvert: boolean;
}

export const EMPTY_CREATIVE: CreativeFields = {
  name: "",
  url: "",
  tagline: "",
  logo: "",
  cover: "",
  categoryKind: null,
  category: null,
  darkInvert: false,
};

const fieldClass = "flex flex-col gap-2";
const helpClass = "text-muted-foreground text-xs leading-relaxed";

/** The image when it is an upload or a public HTTPS URL, never junk. */
const previewUrl = (value: string) =>
  imageRefSchema.safeParse(value.trim()).success ? value.trim() : undefined;

// Roughly how the placement renders: the sponsored grid card (every tier).
export const CreativePreview = ({ fields }: { fields: CreativeFields }) => {
  const content = useIntlayer("sponsorships-page");
  const logo = previewUrl(fields.logo);
  const cover = previewUrl(fields.cover);
  const name = fields.name.trim() || content.name.value;

  return (
    <div className="bg-card shadow-outline flex justify-center rounded-xl p-6">
      <div className="bg-muted shadow-outline relative aspect-video w-full max-w-sm overflow-hidden rounded-xl">
        {cover && (
          <img
            src={cover}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <span className="absolute top-2.5 left-2.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {content.sponsored}
        </span>
        <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-linear-to-t from-black/70 to-transparent p-2.5 pt-6">
          <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-sm">
            {logo && (
              <img
                src={logo}
                alt=""
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="size-full object-contain"
              />
            )}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium tracking-tight text-white">
              {name}
            </span>
            {fields.tagline.trim() && (
              <span className="truncate text-xs text-white/75">
                {fields.tagline}
              </span>
            )}
          </span>
        </span>
      </div>
    </div>
  );
};

/**
 * Campaign copy, logo, cover and (for Gold and Silver) the category page:
 * one FormSection each, in that order.
 */
export const CreativeSections = ({
  idPrefix,
  fields,
  update,
  needsCategory,
}: {
  /** Keeps input ids unique when several forms share a page. */
  idPrefix: string;
  fields: CreativeFields;
  update: (patch: Partial<CreativeFields>) => void;
  needsCategory: boolean;
}) => {
  const content = useIntlayer("sponsorships-page");
  const gallery = useIntlayer("motion-gallery");
  const directory = useIntlayer("resource-directory");
  const id = (field: string) => `${idPrefix}-${field}`;

  // The gallery categories for Discover, the directory chips elsewhere.
  let categoryOptions: { value: string; label: string }[] = [];
  if (fields.categoryKind === "video") {
    categoryOptions = SUBMISSION_CATEGORIES.video.map((value) => ({
      value,
      label: gallery.categories[value].value,
    }));
  } else if (fields.categoryKind) {
    const slugs: readonly DirectorySlug[] =
      SUBMISSION_CATEGORIES[fields.categoryKind];
    const labels: Partial<Record<string, { value: string }>> =
      directory.labels[fields.categoryKind];
    categoryOptions = slugs.map((value) => ({
      value,
      label: labels[value]?.value ?? value,
    }));
  }
  const categoryLabel = categoryOptions.find(
    (option) => option.value === fields.category
  )?.label;

  return (
    <>
      <FormSection
        title={content.campaignSection}
        description={content.campaignSectionBody}
      >
        <div className={fieldClass}>
          <Label htmlFor={id("name")}>{content.name}</Label>
          <Input
            id={id("name")}
            value={fields.name}
            onChange={(event) => update({ name: event.target.value })}
            required
            maxLength={SPONSOR_NAME_MAX}
          />
        </div>
        <div className={fieldClass}>
          <Label htmlFor={id("tagline")}>{content.tagline}</Label>
          <Input
            id={id("tagline")}
            value={fields.tagline}
            onChange={(event) => update({ tagline: event.target.value })}
            required
            maxLength={SPONSOR_TAGLINE_MAX}
          />
        </div>
        <div className={fieldClass}>
          <Label htmlFor={id("url")}>{content.url}</Label>
          <Input
            id={id("url")}
            type="url"
            placeholder="https://"
            value={fields.url}
            onChange={(event) => update({ url: event.target.value })}
            required
            maxLength={2048}
          />
        </div>
      </FormSection>

      <FormSection
        title={content.brandSection}
        description={content.brandSectionBody}
      >
        <ImageDropzone
          purpose="logo"
          value={fields.logo}
          onChange={(logo) => update({ logo })}
          label={content.logoDrop.value}
          hint={content.logoSize.value}
          required
        />
        <label className="text-muted-foreground flex items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            checked={fields.darkInvert}
            onChange={(event) => update({ darkInvert: event.target.checked })}
            className="accent-primary mt-0.5 size-4 shrink-0"
          />
          {content.darkInvert}
        </label>
      </FormSection>

      <FormSection
        title={content.mediaSection}
        description={content.mediaSectionBody}
      >
        <ImageDropzone
          purpose="cover"
          value={fields.cover}
          onChange={(cover) => update({ cover })}
          label={content.coverDrop.value}
          hint={content.coverSize.value}
          required
        />
      </FormSection>

      {needsCategory && (
        <FormSection
          title={content.placementSection}
          description={content.placementSectionBody}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className={fieldClass}>
              <Label htmlFor={id("section")}>{content.section}</Label>
              <Select
                value={fields.categoryKind}
                onValueChange={(value) => {
                  if (value) {
                    // Categories differ per section.
                    update({ categoryKind: value, category: null });
                  }
                }}
              >
                <SelectTrigger id={id("section")} className="w-full">
                  <SelectValue>
                    {fields.categoryKind
                      ? content.sections[fields.categoryKind]
                      : content.pickCategory}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SUBMISSION_KINDS.map((value) => (
                    <SelectItem key={value} value={value}>
                      {content.sections[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={fieldClass}>
              <Label htmlFor={id("category")}>{content.category}</Label>
              <Select
                value={fields.category}
                onValueChange={(value) => update({ category: value })}
                disabled={!fields.categoryKind}
              >
                <SelectTrigger
                  id={id("category")}
                  className="w-full"
                  aria-describedby={id("category-help")}
                >
                  <SelectValue>
                    {categoryLabel ?? content.pickCategory}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p id={id("category-help")} className={helpClass}>
                {content.categoryHelp}
              </p>
            </div>
          </div>
        </FormSection>
      )}
    </>
  );
};
