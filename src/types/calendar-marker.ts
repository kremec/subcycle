import { type Event } from "@/types/event";

export type CalendarMarker = {
  date: Date;
  color: string | null;
  prediction: boolean;
  pill: boolean;
  event: Event | undefined;
  selected: boolean;
};
