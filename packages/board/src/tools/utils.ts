export function getMousePosFromEvent(event: PointerEvent) {
  return {
    x: event.clientX,
    y: event.clientY
  };
}
