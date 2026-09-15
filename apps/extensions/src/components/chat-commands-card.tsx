import { type ReactNode, useId } from 'react';

export interface ChatCommand {
  /** What to type, e.g. "!goal add 5". */
  usage: string;
  /** What it does, already translated. */
  action: string;
}

/** The chat commands a widget's mods can use, shown under its setup page. */
export function ChatCommandsCard({
  title,
  intro,
  commands,
  footer,
}: {
  title: string;
  intro: string;
  commands: readonly ChatCommand[];
  /** A closing note under the list. */
  footer?: ReactNode;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={`${id}-commands`}
      className="rounded-xl border border-zinc-200 bg-zinc-100/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/50"
    >
      <h2
        id={`${id}-commands`}
        className="mb-2 text-base font-semibold text-zinc-900 dark:text-white"
      >
        {title}
      </h2>
      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">{intro}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {commands.map((command) => (
          <div key={command.usage} className="contents">
            <dt>
              <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                {command.usage}
              </code>
            </dt>
            <dd className="self-center text-zinc-600 dark:text-zinc-400">{command.action}</dd>
          </div>
        ))}
      </dl>
      {footer}
    </section>
  );
}
