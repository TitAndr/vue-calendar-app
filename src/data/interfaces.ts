export interface CalendarEvent {
  id?: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
}

export interface EventContext {
  eventState: { events: CalendarEvent[] };
  addEvent: (newEvent: CalendarEvent) => void;
  updateEvent: (updatedEvent: CalendarEvent) => void;
  deleteEvent: (eventId: string) => void;
}

export interface Position {
  x: number;
  y: number;
}

export interface PopupCallback {
  (position: Position): void;
}
