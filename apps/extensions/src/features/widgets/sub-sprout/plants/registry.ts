import type { ComponentType } from "react";

export type PlantId =
  | "classic"
  | "rose"
  | "sunflower"
  | "cactus"
  | "tulip"
  | "bamboo"
  | "carnivorous"
  | "pine"
  | "lotus"
  | "aloe"
  | "lily"
  | "carrot"
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
  "bamboo",
  "carnivorous",
  "pine",
  "lotus",
  "aloe",
  "lily",
  "carrot",
  "palm",
  "vine",
];

import { ClassicPlant } from "./classic";
import { RosePlant } from "./rose";
import { SunflowerPlant } from "./sunflower";
import { CactusPlant } from "./cactus";
import { TulipPlant } from "./tulip";
import { BambooPlant } from "./bamboo";
import { CarnivorousPlant } from "./carnivorous";
import { PinePlant } from "./pine";
import { LotusPlant } from "./lotus";
import { AloePlant } from "./aloe";
import { LilyPlant } from "./lily";
import { CarrotPlant } from "./carrot";
import { PalmPlant } from "./palm";
import { VinePlant } from "./vine";

export const PLANT_REGISTRY: Record<PlantId, PlantDefinition> = {
  classic: {
    id: "classic",
    label: "Classic Sprout",
    stages: 5,
    accentColor: "#6B8E55",
    Component: ClassicPlant,
  },
  rose: {
    id: "rose",
    label: "Rose",
    stages: 6,
    accentColor: "#E11D48",
    Component: RosePlant,
  },
  sunflower: {
    id: "sunflower",
    label: "Sunflower",
    stages: 6,
    accentColor: "#F59E0B",
    Component: SunflowerPlant,
  },
  cactus: {
    id: "cactus",
    label: "Cactus",
    stages: 5,
    accentColor: "#10B981",
    Component: CactusPlant,
  },
  tulip: {
    id: "tulip",
    label: "Tulip",
    stages: 5,
    accentColor: "#EC4899",
    Component: TulipPlant,
  },
  bamboo: {
    id: "bamboo",
    label: "Bamboo",
    stages: 6,
    accentColor: "#65A30D",
    Component: BambooPlant,
  },
  carnivorous: {
    id: "carnivorous",
    label: "Venus Flytrap",
    stages: 5,
    accentColor: "#7C3AED",
    Component: CarnivorousPlant,
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
    stages: 5,
    accentColor: "#FB7185",
    Component: LotusPlant,
  },
  aloe: {
    id: "aloe",
    label: "Aloe Vera",
    stages: 5,
    accentColor: "#84CC16",
    Component: AloePlant,
  },
  lily: {
    id: "lily",
    label: "Lily",
    stages: 6,
    accentColor: "#F9A8D4",
    Component: LilyPlant,
  },
  carrot: {
    id: "carrot",
    label: "Carrot",
    stages: 5,
    accentColor: "#F97316",
    Component: CarrotPlant,
  },
  palm: {
    id: "palm",
    label: "Palm Tree",
    stages: 6,
    accentColor: "#059669",
    Component: PalmPlant,
  },
  vine: {
    id: "vine",
    label: "Climbing Vine",
    stages: 6,
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
