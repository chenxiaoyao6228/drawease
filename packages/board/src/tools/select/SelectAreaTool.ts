import { createElement } from '@drawease/board/elements/util';
import { IBaseElement, IPoint, ITool, ToolType } from '@drawease/board/types';

import { Board } from '../..';

export class SelectAreaTool implements ITool {
  type: ToolType = ToolType.SelectArea;
  _app: Board;
  private areaSelectionStartPoint: IPoint | null = null;
  private areaSelectionEndPoint: IPoint | null = null;
  constructor(app: Board) {
    this._app = app;
  }
  pointerDown(event: PointerEvent) {
    this.areaSelectionStartPoint = {
      x: event.offsetX,
      y: event.offsetY
    };
  }
  pointerMove(event: PointerEvent) {
    // 框选逻辑
    if (this.areaSelectionStartPoint) {
      // 更新框选结束点
      this.areaSelectionEndPoint = { x: event.offsetX, y: event.offsetY };
      // 绘制框选区域
      this.drawSelectionArea();
    }
  }
  pointerUp(event: PointerEvent) {
    // 框选逻辑
    if (this.areaSelectionStartPoint && this.areaSelectionEndPoint) {
      this.selectElementsInSelectionArea();
      // 清除框选状态
      this.clearSelectionArea();
      this.areaSelectionEndPoint = null;
      this.areaSelectionEndPoint = null;
    }
  }

  private drawSelectionArea() {
    console.log('[board]: drawSelectionArea--------->');
    if (!this.areaSelectionStartPoint || !this.areaSelectionEndPoint) return;
    const selectionAreaRect = createElement({
      type: 'rectangle',
      strokeColor: 'green',
      x: this.areaSelectionStartPoint.x,
      y: this.areaSelectionStartPoint.y,
      width: this.areaSelectionEndPoint.x - this.areaSelectionStartPoint.x,
      height: this.areaSelectionEndPoint.y - this.areaSelectionStartPoint.y
    });

    this._app.scene.renderInteractiveElement(selectionAreaRect);
  }

  private clearSelectionArea() {
    // 清除框选区域
    this.areaSelectionStartPoint = null;
    this.areaSelectionEndPoint = null;

    this._app.scene.clearInteractiveCanvas();
  }

  private selectElementsInSelectionArea() {
    if (!this.areaSelectionStartPoint || !this.areaSelectionEndPoint) return;

    const selectedElements: IBaseElement[] = [];

    // 计算框选区域的边界
    const minX = Math.min(this.areaSelectionStartPoint.x, this.areaSelectionEndPoint.x);
    const minY = Math.min(this.areaSelectionStartPoint.y, this.areaSelectionEndPoint.y);
    const maxX = Math.max(this.areaSelectionStartPoint.x, this.areaSelectionEndPoint.x);
    const maxY = Math.max(this.areaSelectionStartPoint.y, this.areaSelectionEndPoint.y);

    // 遍历画布上的元素，判断是否在框选区域内
    for (const element of this._app.scene.getElements()) {
      // 假设元素的位置信息分别存储在 x、y、width 和 height 属性中
      const { x, y, width, height } = element.getBounds();

      // 判断元素是否在框选区域内
      if (x + width >= minX && x <= maxX && y + height >= minY && y <= maxY) {
        selectedElements.push(element);
      }
    }

    console.log('[board]: selectedElements,', selectedElements);

    // 选中框选区域内的元素
    this._app.selectedElementsManager.addMultipleElements(selectedElements);
    this._app.scene.renderAll();
  }
}
