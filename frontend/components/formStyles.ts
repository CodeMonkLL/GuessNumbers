// Shared Tailwind classes for the auth forms and game, chosen for WCAG AA
// contrast: input borders >= 3:1 (1.4.11), text >= 4.5:1 (1.4.3), and
// clickable targets at least 24x24 px (2.5.8).

export const cardClass =
  "flex w-full max-w-sm flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900";

export const labelClass = "text-sm font-medium text-black dark:text-zinc-50";

export const inputClass =
  "rounded-lg border border-zinc-500 bg-transparent px-3 py-2 text-black aria-invalid:border-red-700 dark:border-zinc-400 dark:text-zinc-50 dark:aria-invalid:border-red-400";

export const primaryButtonClass =
  "min-h-10 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]";

export const linkButtonClass =
  "min-h-6 px-1 text-sm text-zinc-700 underline hover:text-black dark:text-zinc-300 dark:hover:text-white";

// Error paragraphs stay mounted as live regions; empty:sr-only hides them
// visually without removing them from the accessibility tree.
export const errorClass = "text-sm text-red-700 empty:sr-only dark:text-red-400";

export const hintClass = "text-sm text-zinc-600 dark:text-zinc-400";
