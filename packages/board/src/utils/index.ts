import { IPoint } from '../types';

export { DataManager } from './DataManager';
export { EventEmitter } from './EventEmitter';

export const randomInteger = () => Math.floor(Math.random() * 2 ** 31);

export function rafThrottle<T extends (...args: any[]) => void>(fn: T): T {
  let requestId: number | null = null;

  const throttled = (...args: Parameters<T>) => {
    if (!requestId) {
      requestId = requestAnimationFrame(() => {
        fn(...args);
        requestId = null;
      });
    }
  };

  return throttled as T;
}

export function getCursorPos(e: PointerEvent) {
  return {
    x: e.offsetX,
    y: e.offsetY
  };
}

interface ITransformParams {
  scrollX: number;
  scrollY: number;
  zoom: number;
}

export function convertViewportToSceneCoords(viewportCoords: IPoint, params: ITransformParams): IPoint {
  return {
    x: viewportCoords.x / params.zoom + params.scrollX,
    y: viewportCoords.y / params.zoom + params.scrollY
  };
}

export function convertSceneToViewportCoords(sceneCoords: IPoint, params: ITransformParams): IPoint {
  return {
    x: (sceneCoords.x - params.scrollX) * params.zoom,
    y: (sceneCoords.y - params.scrollY) * params.zoom
  };
}

export function svgToDataURL(svgString: string): string {
  const encoded = encodeURIComponent(svgString).replace(/'/g, '%27').replace(/"/g, '%22');
  const header = 'data:image/svg+xml,';
  return `${header}${encoded}`;
}
