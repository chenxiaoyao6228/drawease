import { IBaseElement, IBaseElementData, IRenderConfig } from '../types';
import { DataManager } from '../utils/DataManager';

export default abstract class BaseElement implements IBaseElement {
  protected _dataManager: DataManager<IBaseElementData>;

  constructor(data: IBaseElementData) {
    this._dataManager = new DataManager(data);
  }

  getData() {
    return this._dataManager.getData();
  }

  setData(data: Partial<IBaseElementData>) {
    this._dataManager.setData(data);
  }

  abstract render(renderConfig: IRenderConfig): void;
}
