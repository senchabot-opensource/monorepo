import { z } from "zod";
import { isInvalidColorCode } from "../utils/functions";

export const TwitchConfigInputValidation = z.object({
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
          message: "String must be a valid hexadecimal color code.", // String must be a valid color code
          fatal: true,
        });
      }
    }),
});

export const createSenchaColorInput = z.object({
  senchaBg: z
    .string()
    .length(7)
    .superRefine((val, ctx) => {
      if (isInvalidColorCode(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "String must be a valid color code",
          fatal: true,
        });
      }
    }),
  senchaFg: z
    .string()
    .length(7)
    .superRefine((val, ctx) => {
      if (isInvalidColorCode(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "String must be a valid color code",
          fatal: true,
        });
      }
    }),
});

//export type CreateColorInputSchema = z.TypeOf<typeof createColorInput>;
