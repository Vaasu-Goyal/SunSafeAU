export type SkinType = "I" | "II" | "III" | "IV" | "V" | "VI";

export type SkinTypeInfo = {
  type: SkinType;
  label: string;
  description: string;
  baseMinutesAtUvOne: number;
  color: string;
};

export const SKIN_TYPES: SkinTypeInfo[] = [
  {
    type: "I",
    label: "Type I",
    description: "Very fair, always burns, never tans",
    baseMinutesAtUvOne: 150,
    color: "#FFE0C2",
  },
  {
    type: "II",
    label: "Type II",
    description: "Fair, burns easily, tans minimally",
    baseMinutesAtUvOne: 250,
    color: "#F0C29B",
  },
  {
    type: "III",
    label: "Type III",
    description: "Medium, sometimes burns, tans gradually",
    baseMinutesAtUvOne: 350,
    color: "#D9A374",
  },
  {
    type: "IV",
    label: "Type IV",
    description: "Olive, rarely burns, tans well",
    baseMinutesAtUvOne: 450,
    color: "#B87D4E",
  },
  {
    type: "V",
    label: "Type V",
    description: "Brown, very rarely burns, tans easily",
    baseMinutesAtUvOne: 600,
    color: "#8A5A34",
  },
  {
    type: "VI",
    label: "Type VI",
    description: "Dark brown/black, rarely/never burns",
    baseMinutesAtUvOne: 750,
    color: "#4F3220",
  },
];

export function getSkinTypeInfo(type: SkinType): SkinTypeInfo {
  const info = SKIN_TYPES.find((s) => s.type === type);
  if (!info) throw new Error(`Unknown skin type: ${type}`);
  return info;
}
