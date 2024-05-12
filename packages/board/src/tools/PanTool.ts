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
    this._app.cursorManager.applyRegisteredCursor('default');
  }
  deactive() {
    this._app.cursorManager.applyRegisteredCursor('default');
  }
  pointerDown(event: PointerEvent) {
    this._initialPointerPosition = getCursorPos(event);
    this._app.cursorManager.applyRegisteredCursor('grabbing');
  }
  pointerMove(event: PointerEvent) {
    const { scrollX, scrollY } = this._app.scene.dataManager.getData();
    const zoom = this._app.zoomManager.getZoom();
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
    this._app.cursorManager.applyRegisteredCursor('grab');
  }
}
