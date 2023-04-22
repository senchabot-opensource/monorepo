export function getTextWidth(text: string, font: any) {
  const canvas = document.createElement("canvas");
  const context: any = canvas.getContext("2d");

  context.font = font || getComputedStyle(document.body).font;

  return context.measureText(text).width;
}

export function calculateColorBrightness(colorCode: string) {
  let colorOption = new Option().style;

  colorOption.color = colorCode;

  let colorRGB = colorOption.color;

  let rgbArray: string[] | RegExpMatchArray | null = colorRGB?.match(
    /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
  );

  if (!rgbArray) return;

  const brightness = Math.round(
    (parseInt(rgbArray[1]) * 299 +
      parseInt(rgbArray[2]) * 587 +
      parseInt(rgbArray[3]) * 114) /
      1000,
  );

  return brightness > 125 ? "#000000" : "#FFFFFF";
}
