import { ITwitchBotWebhookData } from "../types";

export function isInvalidColorCode(color: string) {
  if (typeof window !== "undefined") {
    const styleOption = new Option().style;

    styleOption.color = color;

    return styleOption.color === "" && true;
  }
}

export function capitalizeWord(word: string) {
  const capitalizedChar = word.charAt(0).toLocaleUpperCase();
  return capitalizedChar + word.slice(1);
}

export const getTwitchBotWebhookFetchOptions = (
  webhookData: ITwitchBotWebhookData,
): RequestInit => {
  return {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(webhookData),
  };
};
