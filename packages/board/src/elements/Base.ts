import { BaseElementData } from '../types';

export interface IBaseElement {
  getData: () => BaseElementData;
  setData: (data: BaseElementData) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
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
  render() {
    throw new Error('Each element should implement a render function!');
  }
}
