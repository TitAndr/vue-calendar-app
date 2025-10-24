import { PopupCallback, Position } from "@/data/interfaces";

export const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

export const formatTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const adjustPosition = (
  popup: HTMLElement | null,
  position: Position,
  callback: PopupCallback
) => {
  if (!popup) return;

  const rect = popup.getBoundingClientRect();
  const padding = 8;

  let x = position.x - rect.width / 2;
  let y = position.y + 16;

  if (y + rect.height + padding > window.innerHeight) {
    y = position.y - rect.height - 20;
  }

  if (x + rect.width > window.innerWidth - padding)
    x = window.innerWidth - rect.width - padding;
  if (x < padding) x = padding;

  callback({ x, y });
};
