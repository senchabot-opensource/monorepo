import { z } from "zod";

export const TwitchBotConfigMutationInputValidation = z.object({
  configs: z
    .object({
      configName: z.string(),
      configValue: z.string(),
    })
    .array(),
});

export const TwitchBotConfigQueryInputValidation = z.object({
  configName: z.string(),
});
