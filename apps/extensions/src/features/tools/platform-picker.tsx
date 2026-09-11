import type { ChatPlatform } from "./command-users";

const PLATFORMS: { id: ChatPlatform; label: string; active: string; text: string }[] = [
  { id: "twitch", label: "Twitch", active: "bg-purple-600 text-white", text: "text-purple-600 dark:text-purple-400" },
  { id: "kick", label: "Kick", active: "bg-green-600 text-white", text: "text-green-600 dark:text-green-400" },
];

export function PlatformPicker({
  value,
  onChange,
  label,
}: {
  value: ChatPlatform;
  onChange: (platform: ChatPlatform) => void;
  label: string;
}) {
  return (
    <fieldset
      aria-label={label}
      className="m-0 flex shrink-0 overflow-hidden rounded-md border border-zinc-300 p-0 text-xs dark:border-zinc-700"
    >
      {PLATFORMS.map((p) => (
        <button
          key={p.id}
          type="button"
          aria-pressed={value === p.id}
          onClick={() => onChange(p.id)}
          className={`px-2.5 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-500 ${
            value === p.id
              ? p.active
              : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          {p.label}
        </button>
      ))}
    </fieldset>
  );
}

export function PlatformTag({ platform }: { platform: ChatPlatform }) {
  const p = PLATFORMS.find((x) => x.id === platform);
  return p ? <span className={`font-semibold ${p.text}`}>{p.label}</span> : null;
}
