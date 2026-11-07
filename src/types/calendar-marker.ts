import { type Event } from "@/types/event";

export enum EventGroupShape {
  NONE = "NONE",
  SINGLE = "SINGLE",
  START = "START",
  MIDDLE = "MIDDLE",
  END = "END",
}

export type CalendarMarker = {
  date: Date;
  color: string | null;
  group: EventGroupShape;
  prediction: boolean;
  textColor: string;
  pill: boolean;
  event: Event | undefined;
  selected: boolean;
};
