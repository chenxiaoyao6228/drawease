import { Board } from '../Board';
import { Tool, ToolType } from '../types';
import { EventEmitter } from '../utils/EventEmitter';
import { LineTool } from './PathTool';
import { SelectTool } from './SelectTool';
import { DiamondTool, EllipseTool, RectTool } from './ShapeTool';
import { isTargetCanvasElement } from './utils';

export default class ToolManager {
  private _app: Board;
  private _activeTool!: Tool;
  private _tools: Map<ToolType, Tool | ((app: Board) => Tool)> = new Map();
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

    this._app.scene.canvas.addEventListener('pointermove', pointerMoveHandler);
    this._app.scene.canvas.addEventListener('pointerup', pointerUpHandler);
    this._app.scene.canvas.addEventListener('pointerout', pointerOutHandler);

    this._eventHandlersToDestroy.push(() => {
      window.removeEventListener('pointerdown', pointerDownHandler);
      this._app.scene.canvas.removeEventListener('pointermove', pointerMoveHandler);
      this._app.scene.canvas.removeEventListener('pointerup', pointerUpHandler);
      this._app.scene.canvas.removeEventListener('pointerout', pointerOutHandler);
    });
  }

  private _registerTools() {
    const DEFAULT_TOOL = ToolType.Select;

    // Register directly constructible tools
    const directConstructibleTools: Tool[] = [new SelectTool(this._app), new LineTool(this._app)];
    directConstructibleTools.forEach((tool) => this._tools.set(tool.type, tool));

    // Register factory functions for other tools
    const toolFactories = [RectTool, DiamondTool, EllipseTool];
    toolFactories.forEach((factory) => {
      const toolInstance = factory(this._app);
      this._tools.set(toolInstance.type, toolInstance);
    });

    this._activeTool = this._tools.get(DEFAULT_TOOL) as Tool;
  }

  invokeToolByType(toolType: ToolType) {
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
    this.eventEmitter.emit('toolChange', {
      currentToolType: this._activeTool.type
    });
  }

  destroy() {
    this._eventHandlersToDestroy.forEach((fn) => fn());
  }
}
