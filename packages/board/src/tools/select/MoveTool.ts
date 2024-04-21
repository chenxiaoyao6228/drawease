import { IBaseElement, IPoint, ITool, ToolType } from '@drawease/board/types';

import { Board } from '../..';

export class MoveTool implements ITool {
  type: ToolType = ToolType.Move;
  _app: Board;
  private _initialPointerPosition: IPoint | null = null;
  constructor(app: Board) {
    this._app = app;
  }
  active() {}
  deactive() {}
  pointerDown(event: PointerEvent) {
    this._initialPointerPosition = {
      x: event.offsetX,
      y: event.offsetY
    };
  }
  pointerMove(event: PointerEvent) {
    if (this._app.selectedElementsManager.getSelectedElements().length > 0) {
      const dx = event.offsetX - this._initialPointerPosition!.x;
      const dy = event.offsetY - this._initialPointerPosition!.y;
      this.moveSelectedElements(this._app.selectedElementsManager.getSelectedElements(), dx, dy);
      this._initialPointerPosition = { x: event.offsetX, y: event.offsetY };
    }
  }
  pointerUp(event: PointerEvent) {}

  moveSelectedElements(elements: IBaseElement[], dx: number, dy: number) {
    elements.forEach((element) => {
      element.move(dx, dy);
    });
    this._app.scene.renderAll();
  }
}
