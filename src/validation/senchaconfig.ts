import { z } from "zod";
import { isInvalidColorCode } from "../utils/functions";

export const SenchaConfigInputValidation = z.object({
  bootScene: z.string(),
  background: z
    .string()
    .length(7)
    .superRefine((val, ctx) => {
      if (isInvalidColorCode(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "String must be a valid hexadecimal color code.",
          fatal: true,
        });
      }
    }),
  foreground: z
    .string()
    .length(7)
    .superRefine((val, ctx) => {
      if (isInvalidColorCode(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "String must be a valid hexadecimal color code.",
          fatal: true,
        });
      }
    }),
});

//export type CreateColorInputSchema = z.TypeOf<typeof createColorInput>;
