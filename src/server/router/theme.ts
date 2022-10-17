import { z } from "zod";
import { t } from "../trpc";

export const themeRouter = t.router({
  get: t.procedure
    .input(z.object({ themeName: z.string() }))
    .query(async ({ ctx, input }) => {
      const { themeName } = input;

      const themeData = ctx.prisma.colorTheme.findFirst<{ where: any }>({
        where: { themeName },
      });

      return themeData;
    }),
});
