import { IBaseElement, IBaseElementData, IBound, IRenderConfig } from '../types';
import { DataManager } from '../utils/DataManager';
import { Matrix } from '../utils/math/Matrix';
import { isPointInBound } from './util';

export default abstract class BaseElement implements IBaseElement {
  isSelected: boolean;
  protected _dataManager: DataManager<IBaseElementData>;

  constructor(data: IBaseElementData) {
    this._dataManager = new DataManager(data);
    this.isSelected = false;
  }

  setSelected(selected: boolean) {
    this.isSelected = selected;
  }

  getData() {
    return this._dataManager.getData();
  }

  setData(data: Partial<IBaseElementData>) {
    this._dataManager.setData(data);
  }

  getValues(data: (keyof IBaseElementData)[]) {
    return this._dataManager.getValues(data);
  }

  move(dx: number, dy: number) {
    const { x, y } = this.getData();
    this.setData({
      x: x + dx,
      y: y + dy
    });
  }

  updateTransform(matrix: Matrix) {
    this.setData({
      transform: matrix.getTransform()
    });
  }

  hitTest(e: PointerEvent): boolean {
    const point = {
      x: e.offsetX,
      y: e.offsetY
    };
    const { x, y, width, height, transform } = this.getData();
    return isPointInBound(point, {
      x,
      y,
      width,
      height,
      transform
    });
  }

  abstract getBounds(): IBound;
  abstract render(renderConfig: IRenderConfig): void;
  abstract renderSelectionBorder(ctx: CanvasRenderingContext2D): void;
}
