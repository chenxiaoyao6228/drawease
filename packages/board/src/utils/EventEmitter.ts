type EventData = Record<string, any>;
interface ICallbackFn {
  (data?: EventData): void;
  ONCE?: boolean;
}

export class EventEmitter {
  listeners: Record<string, ICallbackFn[]>;
  uuid: number;
  constructor() {
    this.listeners = {};
    this.uuid = 0;
  }
  on = (name: string, callback: ICallbackFn) => {
    // 这里也可以使用二维数组的形式[[],[]], 取消事件的时候将该项的索引设置为null
    // 可以避免在遍历是删除元素带来的问题
    this.listeners[name] = this.listeners[name] || {};
    this.listeners[name][this.uuid] = callback;
    this.uuid++;
  };
  emit(name: string, data?: EventData) {
    this.listeners[name] &&
      Object.keys(this.listeners[name]).forEach((key) => {
        const index = key as unknown as number;
        const callback = this.listeners[name][index];
        callback(data);
        if (callback.ONCE) {
          delete this.listeners[name][index];
        }
      });
  }
  once(name: string, callback: ICallbackFn) {
    const callbackWrapper = () => callback();
    callbackWrapper.ONCE = true;
    this.on(name, callbackWrapper);
  }
  off(name: string, listener: ICallbackFn) {
    this.listeners[name] &&
      Object.keys(this.listeners[name]).forEach((key) => {
        const index = key as unknown as number;
        const callback = this.listeners[name][index];
        if (callback === listener) {
          delete this.listeners[name][index];
        }
      });
  }
}
