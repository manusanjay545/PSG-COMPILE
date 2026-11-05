"use client";

import * as React from "react";
import { Check, ImagePlus, LoaderCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DEFAULT_AVATARS, type AvatarSource } from "@/lib/profile/avatars";
import { createClient } from "@/lib/supabase/client";

async function compressAvatar(file: File) {
  let image: CanvasImageSource;
  let width: number;
  let height: number;
  let closeImage: () => void = () => {};
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    image = bitmap;
    width = bitmap.width;
    height = bitmap.height;
    closeImage = () => bitmap.close();
  } else {
    const objectUrl = URL.createObjectURL(file);
    const fallback = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not read this photo."));
      img.src = objectUrl;
    }).finally(() => URL.revokeObjectURL(objectUrl));
    image = fallback;
    width = fallback.naturalWidth;
    height = fallback.naturalHeight;
  }
  const edge = 320;
  const scale = Math.min(1, edge / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const context = canvas.getContext("2d");
  if (!context) { closeImage(); throw new Error("Could not prepare this photo."); }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  closeImage();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((image) => image ? resolve(image) : reject(new Error("Could not compress this photo.")), "image/webp", 0.78));
  return new File([blob], "avatar.webp", { type: "image/webp", lastModified: Date.now() });
}

type AvatarPickerProps = {
  value: string;
  source?: AvatarSource;
  userId?: string;
  allowUpload?: boolean;
  onChange: (url: string, source: AvatarSource) => void;
};

export function AvatarPicker({ value, source, userId, allowUpload = false, onChange }: AvatarPickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    setError("");
    if (!file) return;
    if (!userId) {
      setError("Sign in before uploading a profile photo.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Choose an image smaller than 8 MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const compressed = await compressAvatar(file);
      if (compressed.size > 250 * 1024) throw new Error("This photo could not be compressed enough. Choose a smaller image.");
      const path = `${userId}/avatar.webp`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, compressed, {
        cacheControl: "3600",
        contentType: "image/webp",
        upsert: true,
      });
      if (uploadError) throw uploadError;
      await supabase.storage.from("avatars").remove([`${userId}/avatar.jpg`, `${userId}/avatar.jpeg`, `${userId}/avatar.png`]);
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      onChange(`${data.publicUrl}?v=${Date.now()}`, "upload");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload this photo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14 border border-zinc-700">
          <AvatarImage src={value} alt="Selected profile picture" />
          <AvatarFallback className="bg-indigo-600 text-white">You</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-zinc-100">Profile picture</p>
          <p className="text-xs text-zinc-400">Choose an avatar or upload your own.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {DEFAULT_AVATARS.map((avatar, index) => {
          const selected = value === avatar;
          return (
            <button
              key={avatar}
              type="button"
              aria-label={`Choose default avatar ${index + 1}`}
              aria-pressed={selected}
              onClick={() => onChange(avatar, "preset")}
              className={`relative rounded-full p-0.5 transition ${selected ? "ring-2 ring-indigo-400" : "hover:ring-2 hover:ring-zinc-600"}`}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatar} alt="" />
                <AvatarFallback>{index + 1}</AvatarFallback>
              </Avatar>
              {selected && <span className="absolute -right-0.5 -top-0.5 rounded-full bg-indigo-500 p-0.5 text-white"><Check className="h-2.5 w-2.5" /></span>}
            </button>
          );
        })}
        {allowUpload && (
          <>
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={uploadAvatar} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="h-11 border-zinc-700 bg-zinc-950 text-zinc-200"
            >
              {uploading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-2 h-4 w-4" />}
              Upload photo
            </Button>
          </>
        )}
      </div>
      {source === "google" && <p className="text-xs text-zinc-500">Your Google profile photo is being used.</p>}
      {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

