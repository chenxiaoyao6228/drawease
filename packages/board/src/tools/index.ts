import { Board } from '../Board';
import { ITool, ToolType } from '../types';
import { EventEmitter } from '../utils/EventEmitter';
import { LineTool } from './PathTool';
import { SelectTool } from './select';
import { DiamondTool, EllipseTool, RectTool } from './ShapeTool';
import { isTargetCanvasElement } from './utils';

export default class ToolManager {
  private _app: Board;
  private _activeTool!: ITool;
  private _tools: Map<ToolType, ITool | ((app: Board) => ITool)> = new Map();
  private _eventHandlersToDestroy: (() => void)[] = [];
  eventEmitter: EventEmitter;

  constructor(app: Board) {
    this._app = app;
    this.eventEmitter = new EventEmitter();
    this._registerTools();
    this._bindEvents();
  }

  private _bindEvents() {
    let isPointerDown = false;

    const pointerDownHandler = (event: PointerEvent) => {
      if (isTargetCanvasElement(event)) {
        isPointerDown = true;
        this._activeTool.pointerDown(event);
      }
    };

    const pointerMoveHandler = (event: PointerEvent) => {
      if (!isPointerDown) {
        return;
      }
      this._activeTool.pointerMove(event);
    };

    const pointerUpHandler = (event: PointerEvent) => {
      if (isPointerDown) {
        isPointerDown = false;
        this._activeTool.pointerUp(event);
      }
    };

    const pointerOutHandler = (event: PointerEvent) => {
      if (isPointerDown) {
        isPointerDown = false;
        this._activeTool.pointerUp(event);
      }
    };

    window.addEventListener('pointerdown', pointerDownHandler);

    this._app.scene.innerCanvasesContainer.addEventListener('pointermove', pointerMoveHandler);
    this._app.scene.innerCanvasesContainer.addEventListener('pointerup', pointerUpHandler);
    this._app.scene.innerCanvasesContainer.addEventListener('pointerout', pointerOutHandler);

    this._eventHandlersToDestroy.push(() => {
      window.removeEventListener('pointerdown', pointerDownHandler);
      this._app.scene.innerCanvasesContainer.removeEventListener('pointermove', pointerMoveHandler);
      this._app.scene.innerCanvasesContainer.removeEventListener('pointerup', pointerUpHandler);
      this._app.scene.innerCanvasesContainer.removeEventListener('pointerout', pointerOutHandler);
    });
  }

  private _registerTools() {
    const DEFAULT_TOOL = ToolType.Select;

    // 注册类
    const directConstructibleTools: ITool[] = [new SelectTool(this._app), new LineTool(this._app)];
    directConstructibleTools.forEach((tool) => this._tools.set(tool.type, tool));

    // 注册工厂
    const toolFactories = [RectTool, DiamondTool, EllipseTool];
    toolFactories.forEach((factory) => {
      const toolInstance = factory(this._app);
      this._tools.set(toolInstance.type, toolInstance);
    });

    this._activeTool = this._tools.get(DEFAULT_TOOL) as ITool;
  }

  invokeToolByType(toolType: ToolType) {
    if (this._activeTool) {
      this._activeTool.deactive();
    }

    const activeToolOrFactory = this._tools.get(toolType);
    if (!activeToolOrFactory) {
      throw new Error(`${toolType} is not registered, please check`);
    }

    if (typeof activeToolOrFactory === 'function') {
      this._activeTool = activeToolOrFactory(this._app);
    } else {
      this._activeTool = activeToolOrFactory;
    }
    console.log('[board]: 当前激活tool', this._activeTool.type);

    this._activeTool.active();

    this.eventEmitter.emit('toolChange', {
      currentToolType: this._activeTool.type
    });
  }

  destroy() {
    this._eventHandlersToDestroy.forEach((fn) => fn());
  }
}
