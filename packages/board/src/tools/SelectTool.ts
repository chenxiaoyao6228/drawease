import { Board } from '../Board';
import { Tool, ToolType } from '../types';

export class SelectTool implements Tool {
  _app: Board;
  type: ToolType = ToolType.Select;
  constructor(app: Board) {
    this._app = app;
  }

  pointerDown(event: PointerEvent) {
    console.log('选择工具：鼠标按下事件');
    // 处理鼠标按下事件，在选择工具下执行的操作
  }

  pointerMove(event: PointerEvent) {
    console.log('选择工具：鼠标移动事件');
    // 处理鼠标移动事件，在选择工具下执行的操作
  }

  pointerUp(event: PointerEvent) {
    console.log('选择工具：鼠标松开事件');
    // 处理鼠标松开事件，在选择工具下执行的操作
  }
}
