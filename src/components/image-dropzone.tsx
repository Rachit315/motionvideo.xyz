import { useId, useRef, useState } from "react";
import type { DragEvent } from "react";
import { useIntlayer } from "react-intlayer";
import { GalleryAdd } from "reicon-react/icons/GalleryAdd";

import { Button } from "@/components/ui/button";
import { UPLOAD_MAX_BYTES } from "@/lib/uploads";
import type { UploadPurpose } from "@/lib/uploads";
import { cn } from "@/lib/utils";

const ACCEPT = "image/png,image/jpeg,image/webp";
const ACCEPTED_TYPES = new Set(ACCEPT.split(","));

type DropzoneError = "type" | "size" | "upload";

/**
 * A dashed drop area that uploads one image to /api/upload and reports the
 * stored path. Shows the image once set, with Replace and Remove.
 */
export const ImageDropzone = ({
  purpose,
  value,
  onChange,
  label,
  hint,
  required = false,
}: {
  purpose: UploadPurpose;
  /** The current image path or URL; empty when none. */
  value: string;
  onChange: (value: string) => void;
  /** What to drop, e.g. "Upload your company logo". */
  label: string;
  /** Recommended size, e.g. "512 × 512 px". */
  hint: string;
  required?: boolean;
}) => {
  const content = useIntlayer("image-dropzone");
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<DropzoneError | null>(null);
  const maxMb = UPLOAD_MAX_BYTES[purpose] / 1024 / 1024;

  const upload = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("type");
      return;
    }
    if (file.size > UPLOAD_MAX_BYTES[purpose]) {
      setError("size");
      return;
    }
    setBusy(true);
    setError(null);
    const form = new FormData();
    form.set("purpose", purpose);
    form.set("file", file);
    let path: string | null = null;
    let failure: DropzoneError | null = null;
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      if (response.ok) {
        // SAFETY: /api/upload answers 200 only with `{ path }`.
        ({ path } = (await response.json()) as { path: string });
      } else {
        failure = response.status === 415 ? "type" : "upload";
      }
    } catch {
      failure = "upload";
    }
    setBusy(false);
    setError(failure);
    if (path) {
      onChange(path);
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void upload(event.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        aria-busy={busy}
        className={cn(
          "bg-muted/40 border-foreground/20 relative flex flex-col overflow-hidden rounded-2xl border border-dashed transition-colors",
          purpose === "cover" ? "aspect-video" : "min-h-56",
          dragging && "border-primary bg-primary/5"
        )}
      >
        {value ? (
          <img
            src={value}
            alt=""
            decoding="async"
            referrerPolicy="no-referrer"
            className={cn(
              "absolute inset-0 size-full",
              purpose === "cover" ? "object-cover" : "object-contain p-10"
            )}
          />
        ) : (
          <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-1 p-6 text-center text-xs">
            <GalleryAdd aria-hidden="true" className="mb-2 size-7" />
            <span>{content.types}</span>
            <span>{hint}</span>
            <span>
              {maxMb} MB {content.max}
            </span>
          </div>
        )}
        <div className="relative mt-auto flex items-center justify-between gap-2 p-3">
          <label
            htmlFor={inputId}
            className={cn(
              "text-muted-foreground text-xs",
              value && "bg-background/80 rounded-md px-2 py-1 backdrop-blur"
            )}
          >
            {busy ? content.uploading : label}
          </label>
          <div className="flex gap-1.5">
            {value && !required && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onChange("")}
                disabled={busy}
              >
                {content.remove}
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => input.current?.click()}
              disabled={busy}
            >
              {value ? content.replace : content.browse}
            </Button>
          </div>
        </div>
        <input
          ref={input}
          id={inputId}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(event) => {
            void upload(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
      {error && (
        <p role="alert" className="text-destructive text-xs">
          {
            {
              type: content.errorType,
              size: content.errorSize,
              upload: content.errorUpload,
            }[error]
          }
        </p>
      )}
    </div>
  );
};
