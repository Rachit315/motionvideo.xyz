import { useState } from "react";
import { useIntlayer } from "react-intlayer";

import { ImageDropzone } from "@/components/image-dropzone";
import { FormSection } from "@/components/page";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SponsorTier } from "@/constants/sponsors";
import { SUBMISSION_CATEGORIES, SUBMISSION_KINDS } from "@/lib/community";
import type { SubmissionKind } from "@/lib/community";
import type { DirectorySlug } from "@/lib/directories";
import { SPONSOR_NAME_MAX, SPONSOR_TAGLINE_MAX } from "@/lib/sponsorships";
import { imageRefSchema } from "@/lib/uploads";
import { cn } from "@/lib/utils";

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

type PreviewPlacement = "card" | "slot";

// Roughly how the placement renders: the sponsored grid card (every tier)
// or, for Diamond and Gold, the logo in the sponsor slots under a page's
// intro. A switch picks which one to show.
export const CreativePreview = ({
  fields,
  tier,
}: {
  fields: CreativeFields;
  tier: SponsorTier;
}) => {
  const content = useIntlayer("sponsorships-page");
  const [picked, setPicked] = useState<PreviewPlacement>("card");
  // Silver has no slot.
  const placement = tier === "silver" ? "card" : picked;
  const logo = previewUrl(fields.logo);
  const cover = previewUrl(fields.cover);
  const name = fields.name.trim() || content.name.value;

  return (
    // Fixed height, so switching placements never moves the page: the
    // preview centres in the space above the tabs, which stay at the bottom.
    <Tabs
      value={placement}
      onValueChange={(value) =>
        // SAFETY: the tab list only holds the two preview placements.
        setPicked(value as PreviewPlacement)
      }
      className="bg-card shadow-outline h-80 gap-4 rounded-xl p-6"
    >
      <TabsContent
        value="card"
        className="flex min-h-0 w-full items-center justify-center"
      >
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
      </TabsContent>
      <TabsContent
        value="slot"
        className="flex min-h-0 w-full items-center justify-center"
      >
        {/* A page intro in miniature: title and copy lines as skeletons, then
            the slots with this logo first and the open ones dashed. */}
        <div className="bg-background shadow-outline dark:bg-popover flex w-full max-w-sm flex-col gap-2 rounded-xl p-4">
          <Skeleton className="h-3 w-1/2 rounded-sm" />
          <Skeleton className="h-2 w-full rounded-sm" />
          <Skeleton className="h-2 w-3/4 rounded-sm" />
          <div className="mt-2 flex items-center gap-2">
            <span className="bg-background shadow-outline dark:bg-popover flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] p-1">
              {logo && (
                <img
                  src={logo}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className={cn(
                    "size-full object-contain",
                    fields.darkInvert && "dark:invert"
                  )}
                />
              )}
            </span>
            {[0, 1].map((index) => (
              <span
                key={index}
                className="text-muted-foreground flex size-8 items-center justify-center rounded-[10px] border border-dashed border-current/40"
              >
                <span aria-hidden="true" className="relative size-3.5">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
                </span>
              </span>
            ))}
          </div>
        </div>
      </TabsContent>
      {tier !== "silver" && (
        <TabsList aria-label={content.preview.value} className="mx-auto">
          {(["card", "slot"] as const).map((value) => (
            <TabsTrigger key={value} value={value}>
              {content.placements[value]}
            </TabsTrigger>
          ))}
        </TabsList>
      )}
    </Tabs>
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
          <Checkbox
            checked={fields.darkInvert}
            onCheckedChange={(checked) => update({ darkInvert: checked })}
            className="mt-0.5"
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
                  <SelectGroup>
                    {SUBMISSION_KINDS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {content.sections[value]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
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
                  <SelectGroup>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
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
