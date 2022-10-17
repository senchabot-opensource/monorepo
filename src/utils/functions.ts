export function isInvalidColorCode(color: string) {
  if (typeof window !== "undefined") {
    const styleOption = new Option().style;

    styleOption.color = color;

    return styleOption.color === "" && true;
  }
}
