const NAMED_COLORS: Record<string, string> = {
  red: '#ff0000',
  blue: '#0000ff',
  green: '#00ff00',
  yellow: '#ffff00',
  cyan: '#00ffff',
  magenta: '#ff00ff',
  white: '#ffffff',
  black: '#000000',
  springgreen: '#00ff7f',
  dodgerblue: '#1e90ff',
  hotpink: '#ff69b4',
  coral: '#ff7f50',
  goldenrod: '#daa520',
  seagreen: '#2e8b57',
  cadetblue: '#5f9ea0',
  chocolate: '#d2691e',
  firebrick: '#b22222',
  blueviolet: '#8a2be2',
  yellowgreen: '#9acd32',
  orange: '#ffa500',
  orangered: '#ff4500',
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = NAMED_COLORS[hex.toLowerCase()] || hex.trim();
  const match = clean.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (match) {
    return {
      r: parseInt(match[1], 16),
      g: parseInt(match[2], 16),
      b: parseInt(match[3], 16),
    };
  }
  const shortMatch = clean.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
  if (shortMatch) {
    return {
      r: parseInt(shortMatch[1] + shortMatch[1], 16),
      g: parseInt(shortMatch[2] + shortMatch[2], 16),
      b: parseInt(shortMatch[3] + shortMatch[3], 16),
    };
  }
  return null;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(lum1: number, lum2: number): number {
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Adjusts nickname colors for WCAG AA contrast against light or dark backgrounds.
 */
export function getAccessibleColor(color: string | undefined, isDark: boolean = true): string | undefined {
  if (!color) return undefined;
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);

  if (!isDark) {
    let currentL = l;
    let currentRgb = rgb;
    let attempts = 0;
    while (attempts < 15) {
      const lum = getLuminance(currentRgb.r, currentRgb.g, currentRgb.b);
      const contrast = getContrast(1.0, lum);
      if (contrast >= 3.8 || currentL <= 20) break;
      currentL = Math.max(15, currentL - 5);
      currentRgb = hslToRgb(h, Math.min(s, 95), currentL);
      attempts++;
    }
    return `rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})`;
  } else {
    let currentL = l;
    let currentRgb = rgb;
    let attempts = 0;
    while (attempts < 15) {
      const lum = getLuminance(currentRgb.r, currentRgb.g, currentRgb.b);
      const contrast = getContrast(0.01, lum);
      if (contrast >= 3.5 || currentL >= 85) break;
      currentL = Math.min(85, currentL + 5);
      currentRgb = hslToRgb(h, Math.min(s, 95), currentL);
      attempts++;
    }
    return `rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})`;
  }
}
