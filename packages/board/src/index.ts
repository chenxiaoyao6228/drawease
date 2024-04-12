import { IBaseElement } from './elements/Base';
import { createElement } from './elements/util';
import { BaseElementData } from './types';

interface Options {
  container: HTMLElement;
  width?: number;
  height?: number;
}

export class Board {
  private _container: HTMLElement;
  private _elements: IBaseElement[];
  private _canvas!: HTMLCanvasElement;
  private _ctx!: CanvasRenderingContext2D;
  private _animationFrameId: number | null;
  constructor(options: Options) {
    this._container = options.container;
    this._elements = [];
    this._animationFrameId = null;
    this.initCanvas(options);
  }
  private initCanvas(options: Options) {
    const { width, height, container } = options;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    container.appendChild(canvas);
    this._canvas = canvas;
    this._ctx = ctx;

    const dpr = window.devicePixelRatio;
    canvas.width = Math.round((width || window.innerWidth) * dpr);
    canvas.height = Math.round((height || window.innerHeight) * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    ctx.fillRect(0, 0, canvas.width * dpr, canvas.height * dpr);

    this.renderAll();
  }
  renderAll() {
    cancelAnimationFrame(this._animationFrameId!);
    this._animationFrameId = requestAnimationFrame(() => {
      this._renderAll();
    });
  }
  _renderAll() {
    this._elements.forEach((element) => element.render(this._ctx));
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
