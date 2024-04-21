import { IPoint, ITool, ToolType } from '@drawease/board/types';
import { ControlHandleObj } from '@drawease/board/types/controlHandle';

import { Board } from '../..';

export class ResizeTool implements ITool {
  type: ToolType = ToolType.Resize;
  _app: Board;
  private _initialPointerPosition: IPoint | null = null;
  private _isResizingSingleElement: boolean = false;
  private _currentControlHandle: ControlHandleObj | null = null;

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

    if (this._isResizingSingleElement) {
      this.resizeSingleElement(deltaX, deltaY);
    } else {
      this.resizeMultipleElements(deltaX, deltaY);
    }

    this._initialPointerPosition = currentPointerPosition;
    this._app.scene.renderAll();
  }

  pointerUp(event: PointerEvent) {
    console.log('ResizeTool：鼠标松开事件');
    this._initialPointerPosition = null;
    this._currentControlHandle = null;
  }

  private resizeSingleElement(deltaX: number, deltaY: number) {
    if (!this._currentControlHandle) return;

    const element = this._app.selectedElementsManager.getAll()[0];
    if (!element) return;
    const data = element.getData();

    switch (this._currentControlHandle.type) {
      case 'ne':
        data.width += deltaX;
        data.height -= deltaY;
        data.y += deltaY;
        break;
      // 其他控制器的处理逻辑
    }

    element.setData(data); // 更新元素数据
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
