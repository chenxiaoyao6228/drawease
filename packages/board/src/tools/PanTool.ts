import { Board } from '../Board';
import { IPoint, ITool, ToolType } from '../types';
import { getCursorPos } from '../utils';

export class PanTool implements ITool {
  _app: Board;
  type: ToolType;
  private _initialPointerPosition: IPoint | null = null;

  constructor(app: Board) {
    this._app = app;
    this.type = ToolType.Pan;
  }
  active() {
    // update cursor
  }
  deactive() {}
  pointerDown(event: PointerEvent) {
    this._initialPointerPosition = getCursorPos(event);
  }
  pointerMove(event: PointerEvent) {
    const { scrollX, scrollY, zoom } = this._app.scene.dataManager.getData();
    const { x: cursorX, y: cursorY } = getCursorPos(event);
    const dx = cursorX / zoom - this._initialPointerPosition!.x / zoom;
    const dy = cursorY / zoom - this._initialPointerPosition!.y / zoom;

    this._app.scene.dataManager.setData({
      scrollX: scrollX - dx,
      scrollY: scrollY - dy
    });
    this._app.scene.renderAll();
    this._initialPointerPosition = getCursorPos(event);
  }
  pointerUp(event: PointerEvent) {
    this._initialPointerPosition = null;
  }
}
