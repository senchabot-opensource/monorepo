import { z } from "zod";

export const TwitchBotConfigMutationInputValidation = z.object({
  configs: z
    .object({
      key: z.string(),
      value: z.string(),
    })
    .array(),
});

export const TwitchBotConfigQueryInputValidation = z.object({
  key: z.string(),
});
