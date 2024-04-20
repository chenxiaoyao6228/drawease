import { IBaseElement, IBaseElementData, IBound, IRenderConfig } from '../types';
import { DataManager } from '../utils/DataManager';

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

  hitTest(e: PointerEvent): boolean {
    const { offsetX, offsetY } = e;
    const { x, y, width, height, angle = 0 } = this.getBounds();

    // Convert pointer event coordinates to local coordinates of the element
    const localX = Math.cos(-angle) * (offsetX - x) - Math.sin(-angle) * (offsetY - y);
    const localY = Math.sin(-angle) * (offsetX - x) + Math.cos(-angle) * (offsetY - y);

    // Check if the pointer event is inside the OBB
    return localX >= 0 && localX <= width && localY >= 0 && localY <= height;
  }

  abstract getBounds(): IBound;
  abstract render(renderConfig: IRenderConfig): void;
}
