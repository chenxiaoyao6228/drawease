import { RoughCanvas } from 'roughjs/bin/canvas';
import rough from 'roughjs/bin/rough';

import { Board } from './Board';
import { IBaseElement } from './elements/Base';
import { createElement } from './elements/util';
import { BaseElementData, Options } from './types';

export class Scene {
  private _app: Board;
  private _options: Options;
  private _container: HTMLElement;
  private _elements: IBaseElement[] = [];
  private _ctx!: CanvasRenderingContext2D;
  private _animationFrameId: number | null = null;
  private _width!: number;
  private _height!: number;
  private _rc!: RoughCanvas;
  canvas!: HTMLCanvasElement;
  constructor(app: Board, options: Options) {
    this._app = app;
    this._options = options;
    this._container = options.container;
    this.initCanvas(options);
  }
  private initCanvas(options: Options) {
    const { width = window.innerWidth, height = window.innerHeight, container } = options;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not supported');
    }
    const dpr = window.devicePixelRatio || 1;
    const scaledWidth = Math.round(width * dpr);
    const scaledHeight = Math.round(height * dpr);

    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    container.appendChild(canvas);

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, scaledWidth, scaledHeight);

    this.canvas = canvas;
    this._rc = rough.canvas(canvas);
    this._ctx = ctx;
    this._width = width;
    this._height = height;
  }

  private _renderAll() {
    this._elements.forEach((element) =>
      element.render({
        rc: this._rc,
        canvas: this.canvas,
        ctx: this._ctx
      })
    );
  }
  private _clearCanvas() {
    this._ctx.clearRect(0, 0, this._width, this._height);
  }
  renderAll() {
    cancelAnimationFrame(this._animationFrameId!);
    this._animationFrameId = requestAnimationFrame(() => {
      this._clearCanvas();
      this._renderAll();
    });
  }
  addElements(elements: IBaseElement | IBaseElement[]) {
    const _elements = Array.isArray(elements) ? elements : [elements];
    this._elements = this._elements.concat(_elements);
    this.renderAll();
  }
  loadDatas(datas: BaseElementData[]) {
    const elements = datas.map((data) => createElement(data));
    this.addElements(elements);
  }
}
