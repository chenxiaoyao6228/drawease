import { IBaseElement, IBaseElementData, IBound, IRenderConfig } from '../types';
import { DataManager } from '../utils/DataManager';
import { Matrix } from '../utils/math/Matrix';
import { isPointInBound } from './util';

export default abstract class BaseElement implements IBaseElement {
  isSelected: boolean;
  protected _transform: Matrix;
  protected _dataManager: DataManager<IBaseElementData>;

  constructor(data: IBaseElementData) {
    this._dataManager = new DataManager(data);
    this._transform = new Matrix(...data.transform);
    this.isSelected = false;
  }

  setSelected(selected: boolean) {
    this.isSelected = selected;
  }

  getData() {
    return this._dataManager.getData();
  }

  setData(data: Partial<IBaseElementData>) {
    if (data.transform) {
      this._transform.set(...data.transform);
    }
    this._dataManager.setData(data);
  }

  getValues(data: (keyof IBaseElementData)[]) {
    return this._dataManager.getValues(data);
  }

  updateTransform(matrix: Matrix) {
    this.setData({
      transform: matrix.toArray()
    });
  }

  hitTest(e: PointerEvent): boolean {
    const point = {
      x: e.offsetX,
      y: e.offsetY
    };
    const { width, height, transform } = this.getData();
    return isPointInBound(point, {
      width,
      height,
      transform
    });
  }

  move(dx: number, dy: number) {
    const transform = this._transform.clone().translate(dx, dy);
    this.updateTransform(transform);
  }

  getRotation(): number {
    const { a, b } = this._transform;
    return Math.atan2(b, a);
  }

  getBounds(): IBound {
    const { width, height, transform } = this.getData() as IBaseElementData;
    return { width, height, transform };
  }

  abstract render(renderConfig: IRenderConfig): void;
  abstract renderSelectionBorder(ctx: CanvasRenderingContext2D): void;
}
