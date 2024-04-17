import { Board } from '../Board';
import { Tool, ToolType } from '../types';
import { RectTool } from './RectTool';
import { SelectTool } from './SelectTool';

export { RectTool } from './RectTool';
export { SelectTool } from './SelectTool';

export default class ToolManager {
  private _app: Board;
  private _acitveTool!: Tool;
  private _tools: Map<ToolType, Tool> = new Map();
  private _eventHandlersToDestory: any[] = [];
  constructor(app: Board) {
    this._app = app;
    this._registerTools();
    this._bindEvents();
  }
  private _bindEvents() {
    let isPointerDown = false;

    const pointerDownHandler = (event: PointerEvent) => {
      isPointerDown = true;
      this._acitveTool!.pointerDown(event);
    };

    const pointerMoveHandler = (event: PointerEvent) => {
      if (!isPointerDown) {
        return;
      }
      this._acitveTool!.pointerMove(event);
    };

    const pointerUpHandler = (event: PointerEvent) => {
      isPointerDown = false;
      this._acitveTool!.pointerUp(event);
    };

    const pointerOutHandler = (event: PointerEvent) => {
      isPointerDown = false;
      this._acitveTool!.pointerUp(event);
    };

    window.addEventListener('pointerdown', pointerDownHandler);

    this._app.scene.canvas.addEventListener('pointermove', pointerMoveHandler);
    this._app.scene.canvas.addEventListener('pointerup', pointerUpHandler);
    this._app.scene.canvas.addEventListener('pointerout', pointerOutHandler);

    this._eventHandlersToDestory.push(() => {
      window.removeEventListener('pointerdown', pointerDownHandler);
      this._app.scene.canvas.removeEventListener('pointermove', pointerMoveHandler);
      this._app.scene.canvas.removeEventListener('pointerup', pointerUpHandler);
      this._app.scene.canvas.removeEventListener('pointerout', pointerOutHandler);
    });
  }
  _registerTools() {
    const DEFAULT_TOOL = ToolType.Rect;
    [SelectTool, RectTool].forEach((_Tool) => {
      const toolInstance = new _Tool(this._app);
      this._tools.set(toolInstance.type, toolInstance);
    });
    this._acitveTool = this._tools.get(DEFAULT_TOOL)!;
  }
  invokeToolByType(toolType: ToolType) {
    const activeTool = this._tools.get(toolType);
    if (!activeTool) {
      throw new Error(`${toolType} is not registered, please check`);
    }
    this._acitveTool = activeTool;
  }
  destroy() {
    this._eventHandlersToDestory.forEach((fn) => fn());
  }
}
