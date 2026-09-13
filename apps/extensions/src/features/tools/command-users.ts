import type { ChatMessagesType } from "../widgets/chat-widget/chat-messages";

export type ChatPlatform = ChatMessagesType["platform"];

// platform is null for names saved before the list had platforms ("bob" instead of "twitch:bob").
export type CommandUser = { platform: ChatPlatform | null; name: string };

const PLATFORMS: readonly ChatPlatform[] = ["twitch", "kick"];

export function commandUserKey(platform: ChatPlatform, name: string): string {
  return `${platform}:${name.trim().toLowerCase()}`;
}

export function parseCommandUsers(raw: string | null | undefined): CommandUser[] {
  const users: CommandUser[] = [];
  for (const entry of raw?.split(",") ?? []) {
    const [prefix, ...rest] = entry.split(":");
    const platform = PLATFORMS.find((p) => p === prefix.trim().toLowerCase());
    const name = (platform ? rest.join(":") : entry).trim().toLowerCase();
    if (name && !users.some((u) => u.platform === (platform ?? null) && u.name === name)) {
      users.push({ platform: platform ?? null, name });
    }
  }
  return users;
}

export function formatCommandUsers(users: CommandUser[]): string {
  return users.map((u) => (u.platform ? `${u.platform}:${u.name}` : u.name)).join(",");
}

// A name without a platform is only unambiguous when the link sets up a single platform. With both,
// "bob" could be anyone who takes that name on the other one, so it is left out until a platform is
// picked.
export function resolveCommandUsers(
  users: CommandUser[],
  platforms: { twitch: boolean; kick: boolean },
): { allowed: Set<string>; unassigned: string[] } {
  const configured = PLATFORMS.filter((p) => platforms[p]);
  const allowed = new Set<string>();
  const unassigned: string[] = [];
  for (const user of users) {
    const platform = user.platform ?? (configured.length === 1 ? configured[0] : null);
    if (platform) {
      allowed.add(commandUserKey(platform, user.name));
    } else if (configured.length > 1) {
      unassigned.push(user.name);
    }
  }
  return { allowed, unassigned };
}
