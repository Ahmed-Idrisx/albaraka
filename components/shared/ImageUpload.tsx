"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const MAX_SIZE = 5 * 1024 * 1024; // matches the API's upload limit

interface ImageUploadProps {
  /** The file input's name, so a plain <form> submits the picked image. */
  name: string;
  /** The image already saved (when editing). */
  currentUrl?: string;
  required?: boolean;
  invalid?: boolean;
  /** Square for products/categories; wide is not needed yet. */
  className?: string;
  onChange?: (file: File | null) => void;
}

export function ImageUpload({
  name,
  currentUrl,
  required,
  invalid,
  className = "",
  onChange,
}: ImageUploadProps) {
  const t = useTranslations("upload");
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );
  // Free the temporary preview URL when it is replaced or the form goes away.
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const accept = (picked: File | undefined) => {
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      toast.error(t("notImage"));
      return;
    }
    if (picked.size > MAX_SIZE) {
      toast.error(t("tooLarge"));
      return;
    }
    // Put dropped files into the real input too, so the form submits them.
    const transfer = new DataTransfer();
    transfer.items.add(picked);
    if (inputRef.current) inputRef.current.files = transfer.files;
    setFile(picked);
    onChange?.(picked);
  };

  const clear = () => {
    if (inputRef.current) inputRef.current.value = "";
    setFile(null);
    onChange?.(null);
  };

  const shown = preview ?? currentUrl;

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files[0]);
        }}
        className={`group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none ${
          dragging
            ? "border-primary bg-secondary"
            : invalid
              ? "border-destructive"
              : "border-input hover:border-primary"
        } ${shown ? "photo-frame" : "bg-muted/40"}`}
      >
        {shown ? (
          <>
            {/* A local blob preview can't go through the image optimizer. */}
            <Image
              src={shown}
              alt={t("preview")}
              fill
              sizes="320px"
              unoptimized={!!preview}
              className="object-contain p-3"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">
              {t("replaceHint")}
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-2 p-4 text-center text-sm text-muted-foreground">
            <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
              <ImagePlus className="size-6" />
            </span>
            <span className="font-medium text-foreground">{t("choose")}</span>
            <span className="text-xs">{t("dropHint")}</span>
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        required={required && !currentUrl}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => accept(e.target.files?.[0])}
      />

      {file && (
        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="truncate" dir="ltr">
            {file.name} • {(file.size / 1024).toFixed(0)} KB
          </span>
          <span className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-secondary hover:text-foreground"
            >
              <RefreshCw className="size-3" />
              {t("change")}
            </button>
            <button
              type="button"
              onClick={clear}
              className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="size-3" />
              {currentUrl ? t("keepCurrent") : t("remove")}
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
