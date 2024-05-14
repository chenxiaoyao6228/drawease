import { Board } from '..';
import { IPoint } from '../types';
import { convertSceneToViewportCoords, convertViewportToSceneCoords, EventEmitter } from '../utils';

type ISelectedElementsManagerEvent = {
  zoomChange: { oldZoom: number; newZoom: number };
};

interface IZoomOptions {
  zoom: number;
  maxZoom: number;
  minZoom: number;
  zoomStep: number;
}

export class ZoomManager {
  private _app: Board;
  private maxZoom: number;
  private zoomStep: number;
  private minZoom: number;
  private zoom = 1;
  eventEmitter = new EventEmitter<ISelectedElementsManagerEvent>();

  constructor(board: Board, options?: IZoomOptions) {
    this._app = board;
    this.zoom = options?.zoom || 1;
    this.maxZoom = options?.maxZoom || 10;
    this.minZoom = options?.minZoom || 0.1;
    this.zoomStep = options?.zoomStep || 0.1;
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('wheel', this.handleWheelEvent.bind(this), { passive: false });
  }
  handleWheelEvent(event: WheelEvent) {
    event.preventDefault();
    if (event.ctrlKey || event.metaKey) {
      const mousePos = this._app.viewportManager.getMousePosition(event);
      console.log('mousePos', mousePos);
      event.deltaY < 0 ? this.zoomIn(mousePos) : this.zoomOut(mousePos);
    }
  }

  getZoom() {
    return this.zoom;
  }

  setZoom(newZoom: number, centerBeforeZoom: IPoint) {
    const { scrollX, scrollY } = this._app.viewportManager.getViewport();
    const oldZoom = this.zoom;

    const paramsBefore = { zoom: oldZoom, scrollX: scrollX, scrollY: scrollY };
    const sceneCoords = convertViewportToSceneCoords(centerBeforeZoom, paramsBefore);

    this.zoom = newZoom;

    const paramsAfter = { zoom: newZoom, scrollX: scrollX, scrollY: scrollY };
    const centerAfterZoom = convertSceneToViewportCoords(sceneCoords, paramsAfter);

    this.eventEmitter.emit('zoomChange', {
      oldZoom: oldZoom,
      newZoom: newZoom
    });

    console.log(`[drawease:] oldZoom: ${oldZoom}, newZoom:${newZoom}`);
    const newScrollX = scrollX + (centerBeforeZoom.x - centerAfterZoom.x) / newZoom; // 注意不要忘了除以nextZoom
    const newScrollY = scrollY + (centerBeforeZoom.y - centerAfterZoom.y) / newZoom;

    this._app.viewportManager.updateViewportScroll({
      scrollX: newScrollX,
      scrollY: newScrollY
    });
  }

  zoomIn(center?: IPoint) {
    // this.setZoom(this.zoom + this.zoomStep, { x: 100, y: 100 });
    const zoom = this.zoom + this.zoomStep;
    const newZoom = zoom > this.maxZoom ? this.maxZoom : zoom;
    this.setZoom(newZoom, center || this.getCanvasCenter());
  }

  zoomOut(center?: IPoint) {
    const zoom = this.zoom - this.zoomStep;
    const newZoom = zoom < this.minZoom ? this.minZoom : zoom;
    this.setZoom(newZoom, center || this.getCanvasCenter());
  }

  resetZoom() {
    this.setZoom(1, this.getCanvasCenter());
  }

  getCanvasCenter() {
    const { width, height } = this._app.viewportManager.getViewportSize();
    return {
      x: width / 2,
      y: height / 2
    };
  }
}
