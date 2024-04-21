import { getMultipleElementsBounds, isPointInBound } from '@drawease/board/elements/util';

import { IBaseElement, IPoint, ITool, ToolType } from '../../types';
import { Board } from './../../Board';
import { MoveTool } from './MoveTool';
import { ResizeTool } from './ResizeTool';
import { RotateTool } from './RotateTool';
import { SelectAreaTool } from './SelectAreaTool';

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

  // 策略模式拆分
  private _strategies: Map<ToolType, ITool> = new Map();
  private _currentStrategy: ITool | null = null;

  constructor(app: Board) {
    this._app = app;
    this._strategies.set(ToolType.Move, new MoveTool(this._app));
    this._strategies.set(ToolType.Resize, new ResizeTool(this._app));
    this._strategies.set(ToolType.Rotate, new RotateTool(this._app));
    this._strategies.set(ToolType.SelectArea, new SelectAreaTool(this._app));
  }
  active() {
    if (this._currentStrategy) {
      this._currentStrategy.active();
    }
  }
  deactive() {
    if (this._currentStrategy) {
      this._currentStrategy.deactive();
      this._currentStrategy = null;
    }
    this._app.selectedElementsManager.clear();
    this._app.scene.clearInteractiveCanvas();
    this._app.scene.renderAll();
  }

  pointerDown(event: PointerEvent) {
    console.log('选择工具：鼠标按下事件');
    const point = {
      x: event.offsetX,
      y: event.offsetY
    };

    const controlHandle = this._app.controllHandleManager.getControlHandleFromPoint(point);

    // 用户选中了控制点
    if (controlHandle) {
      if (controlHandle.type === 'rotation') {
        this._currentStrategy = this._strategies.get(ToolType.Rotate)!;
      } else {
        this._currentStrategy = this._strategies.get(ToolType.Resize)!;
      }
    } else {
      const isShiftPressed = event.shiftKey;

      const elementHit = this.detectElementHit(event);
      if (elementHit) {
        // 判断是否在多个矩形的选择区域内
        const selectedElements = this._app.selectedElementsManager.getAll();
        if (selectedElements.length) {
          if (selectedElements.length > 1) {
            // 当前选中了多个元素， 用户可能选中的中间的区域
            if (isShiftPressed) {
              this._app.selectedElementsManager.add(elementHit);
            }
            this._currentStrategy = this._strategies.get(ToolType.Move)!;
          } else {
            const onlySelectedElement = selectedElements[0];
            if (onlySelectedElement.getData().id === elementHit.getData().id) {
              // do nothing
            } else {
              if (isShiftPressed) {
                this._app.selectedElementsManager.add(elementHit);
              } else {
                this._app.selectedElementsManager.deselectAllElements();
                this._app.selectedElementsManager.selectSingleElement(elementHit);
              }
            }
          }
        } else {
          if (isShiftPressed) {
            this._app.selectedElementsManager.toggleElementSelection(elementHit);
          } else {
            this._app.selectedElementsManager.selectSingleElement(elementHit);
          }
        }
      } else {
        // 判断是否在多个矩形的选择区域内
        const selectedElements = this._app.selectedElementsManager.getAll();
        if (selectedElements.length) {
          const multipleBounds = getMultipleElementsBounds(selectedElements);
          if (isPointInBound(point, multipleBounds)) {
            // 继续执行move的逻辑
            this._currentStrategy = this._strategies.get(ToolType.Move)!;
          } else {
            // 不在框选区域内，取消所有元素的选中
            this._app.selectedElementsManager.deselectAllElements();
            // 开启框选逻辑
            this._currentStrategy = this._strategies.get(ToolType.SelectArea)!;
          }
        } else {
          // 开启框选逻辑
          this._currentStrategy = this._strategies.get(ToolType.SelectArea)!;
        }
      }
    }

    if (this._currentStrategy) {
      this._currentStrategy.pointerDown(event);
    }

    this._app.scene.renderAll();
  }

  pointerMove(event: PointerEvent) {
    console.log('选择工具：鼠标移动事件');

    if (this._currentStrategy) {
      this._currentStrategy.pointerMove(event);
      return;
    }
  }

  pointerUp(event: PointerEvent) {
    console.log('选择工具：鼠标松开事件');
    if (this._currentStrategy) {
      this._currentStrategy.pointerUp(event);
    }
    this._currentStrategy = null; // 重置
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
