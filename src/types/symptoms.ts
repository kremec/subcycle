export type Symptoms = {
  date: Date;
  symptomsIntestinalProblems: boolean;
  symptomsAppetiteChanges: boolean;
  symptomsBloating: boolean;
  symptomsChills: boolean;
  symptomsCramps: boolean;
  symptomsDrySkin: boolean;
  symptomsInsomnia: boolean;
  symptomsNausea: boolean;
  dischargeWatery: boolean;
  dischargeCreamy: boolean;
  dischargeSticky: boolean;
  dischargeDry: boolean;
  libidoVeryLow: boolean;
  libidoLow: boolean;
  libidoHigh: boolean;
  libidoVeryHigh: boolean;
  exerciseRunning: boolean;
  exerciseCycling: boolean;
  exerciseHiking: boolean;
  exerciseGym: boolean;
  moodAngry: boolean;
  moodHappy: boolean;
  moodNeutral: boolean;
  moodSad: boolean;
  moodAnnoyed: boolean;
  moodSensitive: boolean;
  moodIrritated: boolean;
};

export type SymptomsKey = Exclude<keyof Symptoms, "date">;

export function createDefaultSymptoms(date: Date): Symptoms {
  return {
    date,
    symptomsIntestinalProblems: false,
    symptomsAppetiteChanges: false,
    symptomsBloating: false,
    symptomsChills: false,
    symptomsCramps: false,
    symptomsDrySkin: false,
    symptomsInsomnia: false,
    symptomsNausea: false,
    dischargeWatery: false,
    dischargeCreamy: false,
    dischargeSticky: false,
    dischargeDry: false,
    libidoVeryLow: false,
    libidoLow: false,
    libidoHigh: false,
    libidoVeryHigh: false,
    exerciseRunning: false,
    exerciseCycling: false,
    exerciseHiking: false,
    exerciseGym: false,
    moodAngry: false,
    moodHappy: false,
    moodNeutral: false,
    moodSad: false,
    moodAnnoyed: false,
    moodSensitive: false,
    moodIrritated: false,
  };
}

export function hasAnySymptoms(symptoms: Symptoms): boolean {
  return Object.entries(symptoms).some(
    ([key, value]) => key !== "date" && Boolean(value),
  );
}
