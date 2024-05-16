import { RoughCanvas } from 'roughjs/bin/canvas';
import rough from 'roughjs/bin/rough';

import { Board } from '../Board';
import { SELECTION_BORDER_OFFSET } from '../elements/constant';
import { createElement, getMultipleElementsBounds } from '../elements/util';
import { IBaseElement, IBaseElementData, IOptions, ISceneData } from '../types';
import { rafThrottle } from '../utils';
import { DataManager } from '../utils/DataManager';

export class Scene {
  innerCanvasesContainer!: HTMLElement;
  dataManager: DataManager<ISceneData>;
  private _app: Board;
  private _elements: IBaseElement[] = [];
  private _interactiveCanvas!: HTMLCanvasElement;
  private _interactiveCtx!: CanvasRenderingContext2D;
  private _interactiveRC!: RoughCanvas;
  private _staticCanvas!: HTMLCanvasElement;
  private _staticCtx!: CanvasRenderingContext2D;
  private _staticRC!: RoughCanvas;

  constructor(app: Board, options: IOptions) {
    this._app = app;
    this.dataManager = new DataManager({
      width: options.width || window.innerWidth,
      height: options.height || window.innerHeight
    });
    this.initCanvases(options.container);
    this.bindEvents();
  }

  private bindEvents() {
    this._app.zoomManager.eventEmitter.on('zoomChange', () => {
      this.renderAll();
    });
    this._app.viewportManager.eventEmitter.on('viewportScrollChange', () => {
      this.renderAll();
    });
  }

  private initCanvases(container: HTMLElement) {
    const width = this.dataManager.getValue('width');
    const height = this.dataManager.getValue('height');

    // Initialize canvas wrapper
    const innerCanvasesContainer = document.createElement('div');
    this.innerCanvasesContainer = innerCanvasesContainer;
    this.innerCanvasesContainer.style.cssText = `
      position: relative;
    `;
    container.appendChild(innerCanvasesContainer);

    // Initialize interactive canvas
    this._interactiveCanvas = document.createElement('canvas');
    this._interactiveCanvas.id = 'interactive-canvas';
    this._interactiveCtx = this._interactiveCanvas.getContext('2d')!;

    this._interactiveCanvas.width = width * window.devicePixelRatio;
    this._interactiveCanvas.height = height * window.devicePixelRatio;
    this._interactiveCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

    this._interactiveCanvas.style.cssText = `
      position: absolute;
      width: ${width}px;
      height: ${height}px;
      left: 0; 
      top: 0;
      z-index: 2;
    `;

    innerCanvasesContainer.appendChild(this._interactiveCanvas);
    this._interactiveRC = rough.canvas(this._interactiveCanvas);

    // Initialize static canvas
    this._staticCanvas = document.createElement('canvas');
    this._staticCanvas.id = 'static-canvas';
    this._staticCtx = this._staticCanvas.getContext('2d')!;

    this._staticCanvas.width = width * window.devicePixelRatio;
    this._staticCanvas.height = height * window.devicePixelRatio;
    this._staticCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

    this._staticCanvas.style.cssText = `
      position: absolute;
      width: ${width}px;
      height: ${height}px;
      left: 0; 
      top: 0;
      z-index: 1;
    `;

    innerCanvasesContainer.appendChild(this._staticCanvas);
    this._staticRC = rough.canvas(this._staticCanvas);

    const rect = this._interactiveCanvas.getBoundingClientRect();
    this._app.viewportManager.updateViewportOffset({
      offsetLeft: rect.left,
      offsetTop: rect.top
    });
  }

  clearInteractiveCanvas() {
    this.clearCanvas(this._interactiveCtx);
  }

  clearCanvas(ctx: CanvasRenderingContext2D) {
    const { width, height } = this.dataManager.getValues(['width', 'height']);
    ctx.clearRect(0, 0, width * window.devicePixelRatio, height * window.devicePixelRatio);
  }

  renderInteractiveElement(elements: IBaseElement) {
    console.log('[board]: renderInteractiveElement----->');
    this.clearCanvas(this._interactiveCtx);
    const _elements = Array.isArray(elements) ? elements : [elements];
    _elements.forEach((element) => {
      element.render({
        rc: this._interactiveRC,
        canvas: this._interactiveCanvas,
        ctx: this._interactiveCtx
      });
    });
  }

  renderAll = rafThrottle(() => {
    const { scrollX, scrollY } = this._app.viewportManager.getViewportScroll();
    const zoom = this._app.zoomManager.getZoom();

    // reset transform
    this._interactiveCtx.reset();
    this._staticCtx.reset();

    this.clearCanvas(this._interactiveCtx);
    this.clearCanvas(this._staticCtx);

    // Apply zoom
    const dpi = window.devicePixelRatio;
    this._interactiveCtx.scale(zoom * dpi, zoom * dpi); // 注意重置矩阵后要重新*dpi系数
    this._staticCtx.scale(zoom * dpi, zoom * dpi);

    this._interactiveCtx.translate(scrollX, scrollY);
    this._staticCtx.translate(scrollX, scrollY);

    console.log(`[drawease:] this._staticCtx.getTransform(): ${this._staticCtx.getTransform()}`);

    this.renderStaticElements(this._staticCtx, this._elements);

    this.renderSelectionBorder();

    this.renderTransformHandles();
  });

  private renderStaticElements(ctx: CanvasRenderingContext2D, elements: IBaseElement[]) {
    elements.forEach((element) => {
      element.render({
        rc: this._staticRC,
        canvas: this._staticCanvas,
        ctx
      });
    });
  }

  renderSelectionBorder() {
    const elements = this._app.selectedElementsManager.getAll();
    if (elements.length > 1) {
      const bound = getMultipleElementsBounds(elements);
      const { width, height, x, y } = bound;
      const ctx = this._interactiveCtx;
      ctx.save();
      ctx.setLineDash([2]);
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - SELECTION_BORDER_OFFSET, y - SELECTION_BORDER_OFFSET, width + SELECTION_BORDER_OFFSET * 2, height + SELECTION_BORDER_OFFSET * 2);

      ctx.restore();
    }
    elements.forEach((element) => {
      element.renderSelectionBorder(this._interactiveCtx);
    });
  }

  renderTransformHandles() {
    // 根据选中的元素添加
    this._app.controlHandleManager.render({
      rc: this._staticRC,
      canvas: this._staticCanvas,
      ctx: this._staticCtx
    });
  }

  // 数据处理
  addElements(elements: IBaseElement | IBaseElement[]) {
    const _elements = Array.isArray(elements) ? elements : [elements];
    this._elements = this._elements.concat(_elements);
    this.renderAll();
  }

  loadDatas(datas: IBaseElementData[]) {
    const elements = datas.map((data) => createElement(data));
    this.addElements(elements);
  }

  getElementDatas() {
    return this._elements.map((element) => element.getData());
  }

  getElements() {
    return this._elements;
  }
}
