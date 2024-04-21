import mitt, { Emitter, EventType, Handler } from 'mitt';

export class EventEmitter<T extends Record<EventType, unknown>> {
  private emitter: Emitter<T>;

  constructor() {
    this.emitter = mitt();
  }

  on<K extends keyof T>(eventName: K, handler: Handler<T[K]>) {
    this.emitter.on(eventName, handler);
  }

  off<K extends keyof T>(eventName: K, handler: Handler<T[K]>) {
    this.emitter.off(eventName, handler);
  }

  emit<K extends keyof T>(eventName: K, event: T[K]) {
    this.emitter.emit(eventName, event);
  }

  removeAllListeners() {
    this.emitter.all.clear();
  }
}

/*

type MyEvents {
  event1: string; // 事件名: 事件参数类型
  event2: number;
}

const emitter = new EventEmitter<MyEvents>();

emitter.on('event1', (data: string) => {
  console.log(data.toUpperCase()); 
});

emitter.emit('event1', 'hello');

*/
