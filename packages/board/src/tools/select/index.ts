import { createElement, getMultipleElementsBounds, isPointInBound } from '@drawease/board/elements/util';

import { Board } from '../../Board';
import { IBaseElement, IPoint, ITool, ToolType } from '../../types';
import { MoveManager } from './moveManager';
/*
当处于选中工具态，用户在上用鼠标点击时，我们可能需要考虑以下情况：
    1. 直接选中一个元素： 单击鼠标选择 canvas 上的一个元素。
    2. 点击空白区域： 单击鼠标时未选中任何元素，即点击了 canvas 上的空白区域。
    3. 拖拽选中区域： 鼠标按下并拖动，创建一个选中区域，用于选择多个元素。
    4. 选中缩放或旋转控制点： 单击并选中一个元素的缩放或旋转控制点，用于改变元素的大小或旋转角度。
    5. 选中选中框内部： 单击并选中包含一个或多个元素的选中框的内部区域。
    6. 按住 Shift 键连选： 按住 Shift 键的同时单击多个元素，以进行多选。
    7. 拖拽元素： 长按并移动鼠标，拖动已选中的元素。
    8. 双击编辑元素： 双击选中一个元素，以进行编辑或执行其他操作。
    9. 悬停提示： 当鼠标悬停在元素上时，显示提示信息或特效。
    10. 按键组合操作： 在按住特定键的同时单击，执行不同的操作，如按住 Ctrl 键并单击以复制选定的元素。
*/

export class SelectTool implements ITool {
  type: ToolType = ToolType.Select;
  private _app: Board;
  private _moveManager: MoveManager;
  private _initialPointerPosition: IPoint | null = null;
  // 框选
  private areaSelectionStartPoint: IPoint | null = null;
  private areaSelectionEndPoint: IPoint | null = null;

  constructor(app: Board) {
    this._app = app;
    this._moveManager = new MoveManager(app);
  }

  pointerDown(event: PointerEvent) {
    console.log('选择工具：鼠标按下事件');
    const point = {
      x: event.offsetX,
      y: event.offsetY
    };

    // 记录初始pointerDownState
    this._initialPointerPosition = point;

    const isShiftPressed = event.shiftKey;

    const elementHit = this.detectElementHit(event);
    if (elementHit) {
      // 判断是否在多个矩形的选择区域内
      const selectedElements = this._app.selectedElementsManager.getAll();
      if (selectedElements.length) {
        if (selectedElements.length > 1) {
          // 当前选中了多个元素， 用户可能选中的中间的区域
          const multipleBounds = getMultipleElementsBounds(selectedElements);
          if (isPointInBound(point, multipleBounds)) {
            // 执行move的逻辑
          } else {
            // 执行move的逻辑
          }
        } else {
          const onlySelectedElement = selectedElements[0];
          if (onlySelectedElement.getData().id === elementHit.getData().id) {
            // do nothing
          } else {
            this._app.selectedElementsManager.deselectAllElements();
            this._app.selectedElementsManager.selectSingleElement(elementHit);
          }
        }
      } else {
        if (isShiftPressed) {
          this._app.selectedElementsManager.toggleElementSelection(elementHit);
        } else {
          this._app.selectedElementsManager.selectSingleElement(elementHit);
        }
      }
      this._app.scene.renderAll();
    } else {
      // 判断是否在多个矩形的选择区域内
      const selectedElements = this._app.selectedElementsManager.getAll();
      if (selectedElements.length) {
        const multipleBounds = getMultipleElementsBounds(selectedElements);
        if (isPointInBound(point, multipleBounds)) {
          // 继续执行move的逻辑
        } else {
          // 不在框选区域内，取消所有元素的选中
          this._app.selectedElementsManager.deselectAllElements();
          // 开启框选逻辑
          this.areaSelectionStartPoint = { x: event.offsetX, y: event.offsetY };
        }
      } else {
        // 开启框选逻辑
        this.areaSelectionStartPoint = { x: event.offsetX, y: event.offsetY };
      }
    }
    this._app.scene.renderAll();
  }

  pointerMove(event: PointerEvent) {
    console.log('选择工具：鼠标移动事件');

    if (this.areaSelectionStartPoint) {
      // 更新框选结束点
      this.areaSelectionEndPoint = { x: event.offsetX, y: event.offsetY };
      // 绘制框选区域
      this.drawSelectionArea();
    } else if (this._app.selectedElementsManager.getSelectedElements().length > 0) {
      const dx = event.offsetX - this._initialPointerPosition!.x;
      const dy = event.offsetY - this._initialPointerPosition!.y;
      this._moveManager.moveSelectedElements(this._app.selectedElementsManager.getSelectedElements(), dx, dy);
      this._initialPointerPosition = { x: event.offsetX, y: event.offsetY };
    }
  }

  pointerUp(event: PointerEvent) {
    console.log('选择工具：鼠标松开事件');

    // 框选逻辑
    if (this.areaSelectionStartPoint && this.areaSelectionEndPoint) {
      this.selectElementsInSelectionArea();
      // 清除框选状态
      this.clearSelectionArea();
      this.areaSelectionEndPoint = null;
      this.areaSelectionEndPoint = null;
    }
    // 选择逻辑
    this._initialPointerPosition = null;
  }

  private detectElementHit(event: PointerEvent): IBaseElement | null {
    const res = [];
    for (const element of this._app.scene.getElements()) {
      if (element.hitTest(event)) {
        res.unshift(element);
      }
    }
    return res.length > 0 ? res[0] : null;
  }

  // ----------框选--------------

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
