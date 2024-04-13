// https://github.com/rough-stuff/rough/wiki
import { RoughCanvas } from 'roughjs/bin/canvas';

import { BaseElementData } from '../types';

export interface RenderConfig {
  rc: RoughCanvas;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export interface IBaseElement {
  getData: () => BaseElementData;
  setData: (data: BaseElementData) => void;
  render: (renderConfig: RenderConfig) => void;
}

export default abstract class BaseElement implements IBaseElement {
  protected _data;
  constructor(data: BaseElementData) {
    this._data = data;
  }
  getData() {
    return this._data;
  }
  setData(data: BaseElementData) {
    this._data = {
      ...this._data,
      ...data
    };
  }
  render(renderConfig: RenderConfig) {
    throw new Error('Each element should implement a render function!');
  }
}
