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
