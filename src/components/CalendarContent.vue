<template>
  <div class="calendar-content">
    <FullCalendar :options="calendarOptions" />
    <EventModal
      v-if="showModal"
      :show="showModal"
      :position="modalPosition"
      :editing-event="selectedEvent"
      @save="handleSave"
      @delete="handleDelete"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, defineAsyncComponent } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  CalendarOptions,
  DateSelectArg,
  EventApi,
  EventClickArg,
  EventDropArg,
} from "@fullcalendar/core";
import { CalendarEvent, EventContext, Position } from "@/data/interfaces";
import { E } from "@fullcalendar/core/internal-common";

const EventModal = defineAsyncComponent(() => import("./EventModal.vue"));

const { eventState, addEvent, updateEvent } = inject(
  "eventsContext"
) as EventContext;

const showModal = ref(false);
const selectedEvent = ref<EventApi | DateSelectArg | null>(null);
const modalPosition = ref<Position>({ x: 0, y: 0 });

const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: "today prev,next",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  titleFormat: { month: "long", year: "numeric" },
  eventTimeFormat: { hour: "2-digit", minute: "2-digit" },
  initialView: "dayGridMonth",
  eventDisplay: "block",
  eventOverlap: true,
  height: "auto",
  editable: true,
  selectable: true,
  events: eventState.events,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventDrop: handleEventDrop,
}));

const triggerModal = (
  trigger: boolean,
  info?: EventClickArg | DateSelectArg | null
) => {
  if (info && info.jsEvent) {
    modalPosition.value = {
      x: info.jsEvent.pageX,
      y: info.jsEvent.pageY,
    };
  } else {
    modalPosition.value = {
      x: window.innerWidth / 2 - 200,
      y: window.innerHeight / 2 - 200,
    };
  }

  showModal.value = trigger;
};

const handleDateSelect = (event: DateSelectArg) => {
  selectedEvent.value = event;
  triggerModal(true, event);
};

const handleEventClick = (clickInfo: EventClickArg) => {
  selectedEvent.value = clickInfo.event;
  triggerModal(true, clickInfo);
};

const handleEventDrop = (dropInfo: EventDropArg) => {
  const { event } = dropInfo;
  const { id, title, start, backgroundColor, end, borderColor } = event;

  const updatedEvent: CalendarEvent = {
    id,
    title,
    start: start ? start.toISOString() : "",
    end: end ? end.toISOString() : "",
    backgroundColor: backgroundColor || "#3788d8",
    borderColor: borderColor || "#3788d8",
  };
  updateEvent(updatedEvent);
};

const handleSave = (eventData: CalendarEvent) => {
  if (eventData.id) {
    updateEvent(eventData);
  } else {
    eventData.id = Date.now().toString();
    addEvent(eventData);
  }
  closeModal();
};

const handleDelete = (eventId: string) => {
  if (confirm("Are you sure you want to delete this event?")) {
    const { deleteEvent } = inject("eventsContext") as EventContext;
    deleteEvent(eventId);
    closeModal();
  }
};

const closeModal = () => {
  showModal.value = false;
  triggerModal(false);
};
</script>
