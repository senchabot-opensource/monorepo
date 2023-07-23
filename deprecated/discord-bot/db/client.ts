// src/server/db/client.ts
import { PrismaClient } from "senchabot-prisma";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();
