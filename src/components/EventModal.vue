<template>
  <div
    class="modal"
    v-if="show"
    ref="modalRef"
    :style="{ top: `${pos.y}px`, left: `${pos.x}px` }"
  >
    <button class="close-btn" @click="$emit('close')">×</button>
    <div class="modal-content">
      <div class="input-group">
        <input
          v-model="eventForm.title"
          placeholder="event name"
          class="input-field"
          @blur="validateFields('title')"
        />
        <span v-if="validation.title" class="error">{{
          validation.title
        }}</span>
      </div>

      <div class="input-group">
        <input
          type="date"
          placeholder="event start date"
          v-model="eventForm.startDate"
          class="input-field"
          @blur="validateFields('startDate')"
        />
        <span v-if="validation.startDate" class="error">{{
          validation.startDate
        }}</span>
      </div>

      <div class="input-group">
        <input
          type="time"
          placeholder="event time"
          v-model="eventForm.time"
          class="input-field"
          @blur="validateFields('time')"
        />
        <span v-if="validation.time" class="error">{{ validation.time }}</span>
      </div>

      <div class="input-group">
        <input
          placeholder="notes"
          v-model="eventForm.notes"
          class="input-field"
          @blur="validateFields('notes')"
        />
        <span v-if="validation.notes" class="error">{{
          validation.notes
        }}</span>
      </div>

      <div class="input-group color-picker">
        <input type="color" v-model="eventForm.color" class="color-input" />
        <span class="color-label">Select color</span>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')">
          {{ isNewEvent ? "Cancel" : "Discard" }}
        </button>
        <button
          @click="handleSave"
          :disabled="!!eventForm.titleError || !!eventForm.dateError"
        >
          {{ isNewEvent ? "Save" : "Edit" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  ref,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
} from "vue";
import { DateSelectArg, EventApi } from "@fullcalendar/core";
import { computed } from "@vue/reactivity";
import { adjustPosition, formatDate, formatTime } from "@/utils/helper";
import { CalendarEvent, Position } from "@/data/interfaces";

type Props = {
  show: boolean;
  editingEvent: EventApi | DateSelectArg | null;
  position: { x: number; y: number };
};

type Emits = {
  (e: "save", eventData: CalendarEvent): void;
  (e: "delete", eventId: string): void;
  (e: "close"): void;
};

type EventForm = {
  title: string;
  startDate: string;
  endDate: string;
  time: string;
  notes: string;
  color: string;
  titleError: string;
  dateError: string;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const initState = {
  title: "",
  startDate: "",
  endDate: "",
  time: "",
  notes: "",
  color: "#3788d8",
  titleError: "",
  dateError: "",
};

const eventForm = ref<EventForm>({ ...initState });
const modalRef = ref<HTMLElement | null>(null);
const validation = ref<Partial<EventForm>>({
  title: "",
  startDate: "",
  endDate: "",
  time: "",
  notes: "",
});
const pos = ref<Position>({ x: props.position.x, y: props.position.y });

const isNewEvent = computed(() => !props.editingEvent);

const validateFields = (field?: keyof EventForm) => {
  Object.keys(validation.value).forEach((f) => {
    const fieldName = field || (f as keyof EventForm);
    validation.value[fieldName as keyof typeof validation.value] = !eventForm
      .value[fieldName]
      ? "This field is required"
      : "";

    if (fieldName === "title") {
      validateTitle();
    }
    if (fieldName === "startDate" || fieldName === "endDate") {
      validateDate();
    }
  });

  return Object.values(validation.value).some((v) => v);
};

const validateTitle = () => {
  const { title } = eventForm.value;
  if (title.length > 30) {
    validation.value.title = "Maximum 30 characters";
  }
};

const validateDate = () => {
  const { startDate, endDate } = eventForm.value;
  [startDate, endDate].forEach((dateStr, index) => {
    const date = new Date(dateStr);
    if (!dateStr || isNaN(date.getTime())) {
      const field = index === 0 ? "startDate" : "endDate";
      validation.value[field] = "Not a valid date";
    } else {
      const field = index === 0 ? "startDate" : "endDate";
      validation.value[field] = "";
    }
  });
};

const handleSave = () => {
  const { title, color, startDate, endDate, time } = eventForm.value;

  if (validateFields()) {
    return;
  }

  const id = props.editingEvent
    ? (props.editingEvent as EventApi).id
    : Date.now().toString();

  emit("save", {
    id,
    title,
    start: `${startDate}T${time}:00`,
    end: `${endDate}T${time}:00`,
    backgroundColor: color,
    borderColor: color,
  });
  resetForm();
};

const resetForm = () => {
  eventForm.value = initState;
};

const handleOutsideClick = (e: MouseEvent) => {
  if (modalRef.value && !modalRef.value.contains(e.target as Node)) {
    emit("close");
  }
};

const onEscClose = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    emit("close");
  }
};

watch(
  () => props.show,
  (val) => {
    if (val) {
      nextTick().then(() => {
        adjustPosition(modalRef.value, props.position, (newPos) => {
          pos.value = newPos;
        });
      });
    }
  },
  { immediate: true }
);

onMounted(() => {
  const { editingEvent } = props;
  if (editingEvent) {
    const { title, start, end, backgroundColor } = editingEvent as EventApi;
    eventForm.value.title = title || "";

    const startDate = start ? new Date(start) : new Date();

    eventForm.value.startDate = formatDate(new Date(start || ""));
    eventForm.value.endDate = formatDate(new Date(end || ""));
    eventForm.value.time = formatTime(startDate);

    eventForm.value.color = backgroundColor || "#3788d8";
  } else {
    resetForm();
  }

  window.addEventListener("keydown", onEscClose);
  document.addEventListener("mousedown", handleOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onEscClose);
  document.removeEventListener("mousedown", handleOutsideClick);
});
</script>
