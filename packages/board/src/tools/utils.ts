export function getMousePosFromEvent(event: PointerEvent) {
  return {
    x: event.clientX,
    y: event.clientY
  };
}

export const isTargetCanvasElement = (event: PointerEvent): boolean => {
  return event.target instanceof HTMLElement && event.target.tagName === 'CANVAS';
};
