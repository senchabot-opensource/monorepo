import { Session } from "next-auth";

export function getUserId(ctx: { session: Session | null }) {
  const userId = ctx.session?.user?.id;
  if (!userId) {
    throw new Error("Access denied.");
  }
  return userId;
}
