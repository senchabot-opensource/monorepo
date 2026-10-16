/**
 * A mod's or the broadcaster's "!" message, from whichever chat reader of the page got it. A
 * command for the overlay as a whole, like !preset, listens here instead of reading chat itself,
 * so it works in every overlay that reads chat, for whatever reason that overlay reads it.
 */
export interface ModCommand {
  platform: 'twitch' | 'kick';
  /** The chat message's id, so one message that two readers of the page got counts once. */
  id: string;
  text: string;
}

type Listener = (command: ModCommand) => void;

const listeners = new Set<Listener>();
// The latest commands' platform:id keys, for the second reader of the same chat.
const recent: string[] = [];
const RECENT = 50;

/** Hands a chat message to every listener if it's a mod command, once. Readers call it for each. */
export function publishModCommand(command: ModCommand | null) {
  if (!command || listeners.size === 0) return;
  if (command.id) {
    const key = `${command.platform}:${command.id}`;
    if (recent.includes(key)) return;
    recent.push(key);
    if (recent.length > RECENT) recent.shift();
  }
  for (const listener of listeners) listener(command);
}

/** Calls `listener` with each mod command the page's chat readers get; returns the way to stop. */
export function onModCommand(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
