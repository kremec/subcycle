export type PartnerInsight = {
  dayInCycle: number;
  name: string;
  description: string;
};

export function createDefaultPartnerInsight(): PartnerInsight {
  return {
    dayInCycle: 1,
    name: "",
    description: "",
  };
}
