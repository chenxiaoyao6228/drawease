import { Board } from '..';
import { EventEmitter } from '../utils';

interface IViewportSize {
  width: number;
  height: number;
}

interface IViewportScroll {
  scrollX: number;
  scrollY: number;
}

interface IViewportOptions extends IViewportSize, IViewportScroll {}

type ISelectedElementsManagerEvent = {
  viewportScrollChange: IViewportScroll;
  viewportSizeChange: IViewportSize;
};

export class ViewportManager {
  private _app: Board;
  private offsetLeft: number;
  private offsetTop: number;
  private scrollX;
  private scrollY;
  private width;
  private height;
  eventEmitter = new EventEmitter<ISelectedElementsManagerEvent>();

  constructor(board: Board, options?: IViewportOptions) {
    this._app = board;
    this.scrollX = options?.scrollX || 0;
    this.scrollY = options?.scrollY || 0;
    this.height = options?.height || 0;
    this.width = options?.width || 0;
    this.offsetLeft = 0;
    this.offsetTop = 0;
  }

  getViewportSize() {
    return {
      width: this.width,
      height: this.height
    };
  }
  updateViewportSize(options: IViewportSize) {
    this.width = options.width;
    this.height = options.height;
    this.eventEmitter.emit('viewportSizeChange', {
      width: this.width,
      height: this.height
    });
  }
  updateViewportOffset(params: { offsetLeft: number; offsetTop: number }) {
    this.offsetLeft = params.offsetLeft;
    this.offsetTop = params.offsetTop;
  }

  getViewportScroll() {
    return {
      scrollX: this.scrollX,
      scrollY: this.scrollY
    };
  }
  updateViewportScroll(options: IViewportScroll) {
    this.scrollX = options.scrollX;
    this.scrollY = options.scrollY;
    this.eventEmitter.emit('viewportScrollChange', {
      scrollX: this.scrollX,
      scrollY: this.scrollY
    });
  }

  getViewport() {
    return {
      offsetLeft: this.offsetLeft,
      offsetTop: this.offsetTop,
      scrollX: this.scrollX,
      scrollY: this.scrollY,
      width: this.width,
      height: this.height
    };
  }

  getViewportCenter() {
    const zoom = this._app.zoomManager.getZoom();
    return {
      x: this.scrollX + this.width / 2 / zoom,
      y: this.scrollY + this.height / 2 / zoom
    };
  }

  getMousePosition(event: any) {
    return {
      x: event.clientX - this.offsetLeft,
      y: event.clientY - this.offsetTop
    };
  }

  translate(x: number, y: number) {
    this.updateViewportScroll({ scrollX: x + this.scrollX, scrollY: y + this.scrollY });
  }
}
