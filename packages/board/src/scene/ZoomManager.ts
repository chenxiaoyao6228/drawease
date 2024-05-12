import { EventEmitter } from '../utils';

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
  private maxZoom: number;
  private zoomStep: number;
  private minZoom: number;
  private zoom = 1;
  eventEmitter = new EventEmitter<ISelectedElementsManagerEvent>();

  constructor(options?: IZoomOptions) {
    this.zoom = options?.zoom || 1;
    this.maxZoom = options?.maxZoom || 10;
    this.minZoom = options?.minZoom || 0.1;
    this.zoomStep = options?.zoomStep || 0.1;
  }

  getZoom() {
    return this.zoom;
  }

  setZoom(newZoom: number) {
    const oldZoom = this.zoom;
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
    this.eventEmitter.emit('zoomChange', {
      oldZoom: oldZoom,
      newZoom: this.zoom
    });
  }

  zoomIn() {
    this.setZoom(this.zoom + this.zoomStep);
  }

  zoomOut() {
    this.setZoom(this.zoom + this.zoomStep);
  }
}
