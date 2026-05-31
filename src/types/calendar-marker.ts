export enum EventGroupShape {
  NONE = "NONE",
  SINGLE = "SINGLE",
  START = "START",
  MIDDLE = "MIDDLE",
  END = "END",
}

export type CalendarMarker = {
  date: Date;
  actualColor: string | null;
  actualGroup: EventGroupShape;
  predictionColor: string | null;
  predictionGroup: EventGroupShape;
  textColor: string;
  dotColor: string;
  selected: boolean;
};
