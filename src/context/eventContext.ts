import { CalendarEvent, EventContext } from "@/data/interfaces";
import { reactive } from "vue";

export const useEventContext = (): EventContext => {
  const eventState = reactive({
    events: JSON.parse(
      localStorage.getItem("calendarEvents") || "[]"
    ) as CalendarEvent[],
  });

  const addEvent = (newEvent: CalendarEvent) => {
    eventState.events.push(newEvent);
    saveToLocalStorage();
  };

  const updateEvent = (updatedEvent: CalendarEvent) => {
    const index = eventState.events.findIndex((e) => e.id === updatedEvent.id);
    if (index !== -1) {
      eventState.events[index] = {
        ...eventState.events[index],
        ...updatedEvent,
      };
      saveToLocalStorage();
    }
  };

  const deleteEvent = (eventId: string) => {
    eventState.events = eventState.events.filter((e) => e.id !== eventId);
    saveToLocalStorage();
  };

  const saveToLocalStorage = () => {
    localStorage.setItem("calendarEvents", JSON.stringify(eventState.events));
  };

  return {
    eventState,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
