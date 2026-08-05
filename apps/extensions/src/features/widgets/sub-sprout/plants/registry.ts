import type { ComponentType } from "react";

export type PlantId =
  | "classic"
  | "rose"
  | "sunflower"
  | "cactus"
  | "tulip"
  | "pine"
  | "lotus"
  | "lily"
  | "palm"
  | "vine";

export interface PlantProps {
  stage: number;
  progress: number;
}

export interface PlantDefinition {
  id: PlantId;
  label: string;
  stages: number;
  accentColor: string;
  Component: ComponentType<PlantProps>;
}

export const PLANT_IDS: PlantId[] = [
  "classic",
  "rose",
  "sunflower",
  "cactus",
  "tulip",
  "pine",
  "lotus",
  "lily",
  "palm",
  "vine",
];

import { ClassicPlant } from "./classic";
import { RosePlant } from "./rose";
import { SunflowerPlant } from "./sunflower";
import { CactusPlant } from "./cactus";
import { TulipPlant } from "./tulip";
import { PinePlant } from "./pine";
import { LotusPlant } from "./lotus";
import { LilyPlant } from "./lily";
import { PalmPlant } from "./palm";
import { VinePlant } from "./vine";

export const PLANT_REGISTRY: Record<PlantId, PlantDefinition> = {
  classic: {
    id: "classic",
        label: "Classic Sprout",
        stages: 10,
        accentColor: "#6B8E55",
    Component: ClassicPlant,
  },
  rose: {
    id: "rose",
    label: "Rose",
    stages: 10,
    accentColor: "#E11D48",
    Component: RosePlant,
  },
  sunflower: {
    id: "sunflower",
    label: "Sunflower",
    stages: 7,
    accentColor: "#F59E0B",
    Component: SunflowerPlant,
  },
  cactus: {
    id: "cactus",
    label: "Cactus",
    stages: 6,
    accentColor: "#10B981",
    Component: CactusPlant,
  },
  tulip: {
    id: "tulip",
    label: "Tulip",
    stages: 7,
    accentColor: "#EC4899",
    Component: TulipPlant,
  },
  pine: {
    id: "pine",
    label: "Pine Tree",
    stages: 5,
    accentColor: "#166534",
    Component: PinePlant,
  },
  lotus: {
    id: "lotus",
    label: "Lotus",
    stages: 7,
    accentColor: "#FB7185",
    Component: LotusPlant,
  },
  lily: {
    id: "lily",
    label: "Lily",
    stages: 9,
    accentColor: "#F9A8D4",
    Component: LilyPlant,
  },
  palm: {
    id: "palm",
    label: "Palm Tree",
    stages: 10,
    accentColor: "#059669",
    Component: PalmPlant,
  },
  vine: {
    id: "vine",
    label: "Climbing Vine",
    stages: 11,
    accentColor: "#5A9238",
    Component: VinePlant,
  },
};

export const getPlant = (id: PlantId | string | undefined): PlantDefinition => {
  if (id && id in PLANT_REGISTRY) {
    return PLANT_REGISTRY[id as PlantId];
  }
  return PLANT_REGISTRY.classic;
};

export const isValidPlantId = (id: string | undefined): id is PlantId => {
  return !!id && (PLANT_IDS as string[]).includes(id);
};
