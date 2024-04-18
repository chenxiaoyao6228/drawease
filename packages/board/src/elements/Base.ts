import { RoughCanvas } from 'roughjs/bin/canvas';

import { BaseElementData } from '../types';
import { DataManager } from '../utils/DataManager';

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
  protected _dataManager: DataManager<BaseElementData>;

  constructor(data: BaseElementData) {
    this._dataManager = new DataManager(data);
  }

  getData() {
    return this._dataManager.getData();
  }

  setData(data: Partial<BaseElementData>) {
    this._dataManager.setData(data);
  }

  render(renderConfig: RenderConfig) {
    throw new Error('Each element should implement a render function!');
  }
}
