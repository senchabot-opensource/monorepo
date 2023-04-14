import { z } from "zod";

export const TwitchBotConfigMutationInputValidation = z.object({
  configName: z.string(),
  configValue: z.string(),
});

export const TwitchBotConfigQueryInputValidation = z.object({
  configName: z.string(),
});
