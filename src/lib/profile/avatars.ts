export const DEFAULT_AVATARS = Array.from(
  { length: 8 },
  (_, index) => `/avatars/avatar-${String(index + 1).padStart(2, "0")}.svg`,
);

export type AvatarSource = "google" | "preset" | "upload";

