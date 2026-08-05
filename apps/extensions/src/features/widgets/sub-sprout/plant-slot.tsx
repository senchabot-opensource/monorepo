import { getPlant, type PlantId } from "./plants/registry";

export interface PlantSlotProps {
  x: number;
  y: number;
  variety: PlantId | string;
  stage: number;
  progress: number;
}

export function PlantSlot({ x, y, variety, stage, progress }: PlantSlotProps) {
  const plant = getPlant(variety);
  const PlantComponent = plant.Component;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="0" rx="75" ry="10" fill="#A85F45" />
      <ellipse cx="0" cy="0" rx="75" ry="10" fill="#5C4A42" />
      <polygon points="-70,20 70,20 50,130 -50,130" fill="#C87A5E" />
      <rect x="-85" y="0" width="170" height="25" rx="4" fill="#E89B7E" />
      <polygon
        points="-70,20 70,20 65,35 -65,35"
        fill="#A85F45"
        opacity="0.3"
      />
      <PlantComponent stage={stage} progress={progress} />
    </g>
  );
}
