import { ITool, ToolType } from '@drawease/board/types';

import { Board } from '../..';

export class ResizeTool implements ITool {
  type: ToolType = ToolType.Resize;
  _app: Board;
  constructor(app: Board) {
    this._app = app;
  }
  active() {}
  deactive() {}
  pointerDown(event: PointerEvent) {
    console.log('ResizeTool：鼠标按下事件');
  }
  pointerMove(event: PointerEvent) {}
  pointerUp(event: PointerEvent) {}
}
