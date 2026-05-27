"use client";

import { useRef, useState } from "react";

type AcceptMode = "image" | "video" | "any";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: AcceptMode;
};

const FILE_ACCEPT: Record<AcceptMode, string> = {
  image: "image/*",
  video: "video/*",
  any: "image/*,video/*,application/pdf",
};

const BUTTON_LABEL: Record<AcceptMode, string> = {
  image: "Upload image",
  video: "Upload video",
  any: "Upload file",
};

export default function CloudinaryImageField({
  value,
  onChange,
  label,
  accept = "image",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const isVideo = file.type.startsWith("video/");
    const resourceType = isVideo ? "video" : file.type === "application/pdf" ? "raw" : "image";
    const endpoint = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME}/${resourceType}/upload`;

    try {
      const res = await fetch(endpoint, { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || res.statusText);
      }
      const data = await res.json();
      onChange(data.secure_url);
    } catch (err) {
      alert(`Upload failed: ${err instanceof Error ? err.message : err}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const isImage =
    value && /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/i.test(value);
  const isVideoUrl =
    value && /\.(mp4|webm|mov|ogg)(\?|$)/i.test(value);

  return (
    <div className="space-y-2">
      {value && isImage && (
        <div className="relative w-full max-w-xs">
          <img
            src={value}
            alt={label || "Preview"}
            className="w-full h-auto rounded-md border border-gray-200 object-cover max-h-40"
          />
        </div>
      )}

      {value && isVideoUrl && (
        <div className="relative w-full max-w-xs">
          <video
            src={value}
            controls
            className="w-full h-auto rounded-md border border-gray-200 max-h-40"
          />
        </div>
      )}

      {value && !isImage && !isVideoUrl && (
        <p className="text-xs text-gray-500 truncate max-w-xs">
          Current file: {value.split("/").pop()}
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 shrink-0"
        >
          {uploading ? "Uploading…" : BUTTON_LABEL[accept]}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-red-500 text-xs hover:underline shrink-0"
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={FILE_ACCEPT[accept]}
        onChange={handleUpload}
        className="hidden"
      />

    </div>
  );
}
