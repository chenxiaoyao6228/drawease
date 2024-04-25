import { IBound, IPoint, ITool, ToolType } from '@drawease/board/types';
import { ControlHandleObj } from '@drawease/board/types/controlHandle';
import { Matrix } from '@drawease/board/utils/math/Matrix';

import { Board } from '../..';

export class ResizeTool implements ITool {
  type: ToolType = ToolType.Resize;
  _app: Board;
  private _initialPointerPosition: IPoint | null = null;
  private _isResizingSingleElement: boolean = false;
  private _currentControlHandle: ControlHandleObj | null = null;
  private _originalBound: IBound | null = null;

  constructor(app: Board) {
    this._app = app;
  }

  active() {
    console.log('ResizeTool：active');
    const selectedElements = this._app.selectedElementsManager.getAll();
    this._isResizingSingleElement = selectedElements.length === 1;
  }

  deactive() {
    console.log('ResizeTool：deactive');
  }

  pointerDown(event: PointerEvent) {
    console.log('ResizeTool：鼠标按下事件');
    // 记录起点
    this._initialPointerPosition = {
      x: event.offsetX,
      y: event.offsetY
    };
    // 记录当前类型
    this._currentControlHandle = this._app.controllHandleManager.getControlHandleFromPoint(this._initialPointerPosition);
    // 初始化矩阵
    this._originalBound = this._app.selectedElementsManager.getSelectedElements()[0].getBounds();
  }

  pointerMove(event: PointerEvent) {
    console.log('ResizeTool：鼠标移动事件');
    if (!this._initialPointerPosition || !this._currentControlHandle) return;

    const currentPointerPosition: IPoint = {
      x: event.offsetX,
      y: event.offsetY
    };

    const deltaX = currentPointerPosition.x - this._initialPointerPosition.x;
    const deltaY = currentPointerPosition.y - this._initialPointerPosition.y;

    console.log('deltaX, deltaY', deltaX, deltaY); // deltaY是负数！！！！

    if (this._isResizingSingleElement) {
      this.resizeSingleElement(deltaX, deltaY);
    } else {
      this.resizeMultipleElements(deltaX, deltaY);
    }

    this._app.scene.renderAll();
  }

  pointerUp(event: PointerEvent) {
    console.log('ResizeTool：鼠标松开事件');
    this._initialPointerPosition = null;
    this._currentControlHandle = null;
    this._originalBound = null;
  }

  private resizeSingleElement(deltaX: number, deltaY: number) {
    console.log('deltaX, deltaY', deltaX, deltaY);
    const element = this._app.selectedElementsManager.getAll()[0];
    if (!element) return;

    // Calculate the scaling factors
    const { x, y, width, height, transform } = this._originalBound!;

    const scaleX = Math.abs((width + deltaX) / width);
    const scaleY = Math.abs((height + deltaY) / height);

    // Apply scaling transformation to the element
    const oldMatrix = new Matrix(...transform!);
    const resizeMatrix = new Matrix();
    resizeMatrix.scale(scaleX, scaleY);
    resizeMatrix.translate(x * (1 - scaleX), y * (1 - scaleY));
    oldMatrix.append(resizeMatrix);
    element.updateTransform(oldMatrix);
  }

  private resizeMultipleElements(deltaX: number, deltaY: number) {
    const selectedElements = this._app.selectedElementsManager.getAll();

    for (const element of selectedElements) {
      const data = element.getData();
      const bounds = element.getBounds();
      const { x, y, width, height } = bounds;

      switch (this._currentControlHandle!.type) {
        case 'ne':
          data.width += deltaX;
          data.height -= deltaY;
          data.y += deltaY;
          break;
        // 其他控制器的处理逻辑
      }

      element.setData(data);
    }
  }
}
