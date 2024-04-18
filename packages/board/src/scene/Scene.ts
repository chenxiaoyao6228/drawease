import { RoughCanvas } from 'roughjs/bin/canvas';
import rough from 'roughjs/bin/rough';

import { Board } from '../Board';
import { IBaseElement } from '../elements/Base';
import { createElement } from '../elements/util';
import { BaseElementData, Options, SceneData } from '../types';
import { DataManager } from '../utils/DataManager';

export class Scene {
  innerCanvasesContainer!: HTMLElement;
  private _app: Board;
  private _elements: IBaseElement[] = [];
  private _interactiveCanvas!: HTMLCanvasElement;
  private _interactiveCtx!: CanvasRenderingContext2D;
  private _interactiveRC!: RoughCanvas;
  private _staticCanvas!: HTMLCanvasElement;
  private _staticCtx!: CanvasRenderingContext2D;
  private _staticRC!: RoughCanvas;
  private _animationFrameId: number | null = null;
  private _dataManager: DataManager<SceneData>;

  constructor(app: Board, options: Options) {
    this._app = app;
    this._dataManager = new DataManager({
      width: options.width || window.innerWidth,
      height: options.height || window.innerHeight,
      zoom: { value: 1 },
      offsetLeft: 0,
      offsetTop: 0,
      scrollX: 0,
      scrollY: 0
    });
    this.initCanvases(options.container);
  }

  private initCanvases(container: HTMLElement) {
    const width = this._dataManager.getValue('width');
    const height = this._dataManager.getValue('height');

    // Initialize canvas wrapper
    const innerCanvasesContainer = document.createElement('div');
    this.innerCanvasesContainer = innerCanvasesContainer;
    this.innerCanvasesContainer.style.cssText = `
      position: relative;
    `;
    container.appendChild(innerCanvasesContainer);

    // Initialize interactive canvas
    this._interactiveCanvas = document.createElement('canvas');
    this._interactiveCanvas.id = 'interative-canvas';
    this._interactiveCtx = this._interactiveCanvas.getContext('2d')!;
    this._interactiveCanvas.width = width;
    this._interactiveCanvas.height = height;

    this._interactiveCanvas.style.cssText = `
      position: absolute;
      width: ${width}px;
      height: ${height}px;
      left: 0; 
      top: 0;
      border: 1px solid red;
      z-index: 2;
    `;

    innerCanvasesContainer.appendChild(this._interactiveCanvas);
    this._interactiveRC = rough.canvas(this._interactiveCanvas);

    // Initialize static canvas
    this._staticCanvas = document.createElement('canvas');
    this._staticCanvas.id = 'static-canvas';
    this._staticCtx = this._staticCanvas.getContext('2d')!;
    this._staticCanvas.width = width;
    this._staticCanvas.height = height;

    this._staticCanvas.style.cssText = `
      position: absolute;
      width: ${width}px;
      height: ${height}px;
      left: 0; 
      top: 0;
      border: 1px solid blue;
      z-index: 1;
    `;

    innerCanvasesContainer.appendChild(this._staticCanvas);
    this._staticRC = rough.canvas(this._staticCanvas);
  }

  clearInteractiveCanvas() {
    const { width, height } = this._dataManager.getValues(['width', 'height']);
    this._interactiveCtx.clearRect(0, 0, width!, height!);
  }

  renderInteractiveElement(elements: IBaseElement) {
    this.clearInteractiveCanvas();
    const _elements = Array.isArray(elements) ? elements : [elements];
    _elements.forEach((element) => {
      element.render({
        rc: this._interactiveRC,
        canvas: this._interactiveCanvas,
        ctx: this._interactiveCtx
      });
    });
  }

  private renderStaticElements(ctx: CanvasRenderingContext2D, elements: IBaseElement[]) {
    console.log('[board]: renderStaticElements----->');
    elements.forEach((element) => {
      element.render({
        rc: this._staticRC,
        canvas: this._staticCanvas,
        ctx
      });
    });
  }

  renderAll() {
    cancelAnimationFrame(this._animationFrameId!);
    this._animationFrameId = requestAnimationFrame(() => {
      const { width, height } = this._dataManager.getValues(['width', 'height']);
      this._staticCtx.clearRect(0, 0, width!, height!);
      this.renderStaticElements(this._staticCtx, this._elements);
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