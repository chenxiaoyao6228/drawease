import { IPoint } from '../types';
export * from './DataManager';
export * from './EventEmitter';
export * from './math/Matrix';

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

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function svgToDataURL(svgString: string): string {
  const encoded = encodeURIComponent(svgString).replace(/'/g, '%27').replace(/"/g, '%22');
  const header = 'data:image/svg+xml,';
  return `${header}${encoded}`;
}

export const normalizeAngle = (angle: number): number => {
  if (angle < 0) {
    return angle + 2 * Math.PI;
  }
  if (angle >= 2 * Math.PI) {
    return angle - 2 * Math.PI;
  }
  return angle;
};
