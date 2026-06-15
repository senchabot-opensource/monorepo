import type { PlantProps } from "./registry";
import { VineOverlay } from "./vine-overlay";

export function VinePlant({ stage, progress }: PlantProps) {
  return <VineOverlay stage={stage} progress={progress} />;
}
