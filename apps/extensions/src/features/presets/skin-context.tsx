import { createContext, type ReactNode, useContext } from 'react';
import type { Skin } from './skin';

const SkinContext = createContext<Skin | null>(null);

/** The overlay's preset, or null for its classic look. */
export const useSkin = () => useContext(SkinContext);

/** Gives an overlay's parts its preset and loads the preset's fonts. */
export function SkinProvider({ skin, children }: { skin: Skin | null; children: ReactNode }) {
  return (
    <SkinContext.Provider value={skin}>
      {/* React hoists it into <head>; only the URL knows which fonts are needed. */}
      {skin && <link rel="stylesheet" href={skin.fontHref} precedence="default" />}
      {children}
    </SkinContext.Provider>
  );
}
