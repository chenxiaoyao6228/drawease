import RectElement from '@drawease/board/elements/Rect';

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
  private _initialPointerPosition: IPoint = { x: 0, y: 0 };

  constructor(app: Board) {
    this._app = app;
    this._moveManager = new MoveManager(app);
  }

  pointerDown(event: PointerEvent) {
    console.log('选择工具：鼠标按下事件');
    // 记录初始pointerDownState
    this._initialPointerPosition = {
      x: event.clientX,
      y: event.clientY
    };

    // Check if Shift key is pressed
    const isShiftPressed = event.shiftKey;

    // Check if a rectangle element is clicked
    const elementHit = this.detectElementHit(event);
    if (elementHit instanceof RectElement) {
      if (isShiftPressed) {
        // Toggle selection status of the clicked element
        this._app.selectedElementsManager.toggleElementSelection(elementHit);
      } else {
        // Deselect all other elements and select the clicked element
        this._app.selectedElementsManager.selectSingleElement(elementHit);
      }
    } else {
      // Clicked on the blank area of the canvas
      if (!isShiftPressed) {
        // Deselect all elements if Shift is not pressed
        this._app.selectedElementsManager.deselectAllElements();
      }
    }

    this._app.scene.renderAll();
  }

  pointerMove(event: PointerEvent) {
    console.log('选择工具：鼠标移动事件');

    if (this._app.selectedElementsManager.getSelectedElements().length > 0) {
      const dx = event.clientX - this._initialPointerPosition.x;
      const dy = event.clientY - this._initialPointerPosition.y;
      this._moveManager.moveSelectedElements(this._app.selectedElementsManager.getSelectedElements(), dx, dy);
      this._initialPointerPosition = { x: event.clientX, y: event.clientY };
    }
  }

  pointerUp(event: PointerEvent) {
    console.log('选择工具：鼠标松开事件');
    console.log('this._app.selectedElementsManager.getSelectedElements()', this._app.selectedElementsManager.getSelectedElements());
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
}
