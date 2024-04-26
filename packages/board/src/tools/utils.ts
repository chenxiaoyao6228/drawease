export const isTargetCanvasElement = (event: PointerEvent): boolean => {
  return event.target instanceof HTMLElement && event.target.tagName === 'CANVAS';
};
