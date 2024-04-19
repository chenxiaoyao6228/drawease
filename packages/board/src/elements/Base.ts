import { BaseElementData, IBaseElement, RenderConfig } from '../types';
import { DataManager } from '../utils/DataManager';

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

  abstract render(renderConfig: RenderConfig): void;
}
