import { ControllHandleManager } from './controlHandles/controllHandleManager';
import { CursorManager } from './CursorManager';
import { Scene } from './scene/Scene';
import { ViewportManager } from './scene/ViewportManager';
import { ZoomManager } from './scene/ZoomManager';
import { SelectedElementsManager } from './SelectedElementsManager';
import ToolManager from './tools';
import { IOptions } from './types';

export class Board {
  tool: ToolManager;
  scene: Scene;
  selectedElementsManager: SelectedElementsManager;
  controllHandleManager: ControllHandleManager;
  cursorManager: CursorManager;
  zoomManager: ZoomManager;
  viewportManager: ViewportManager;
  constructor(options: IOptions) {
    this.zoomManager = new ZoomManager(this);
    this.viewportManager = new ViewportManager(this, {
      width: options.width || window.innerWidth,
      height: options.height || window.innerHeight,
      scrollX: 0,
      scrollY: 0
    });
    this.scene = new Scene(this, options);
    this.cursorManager = new CursorManager(this);
    this.tool = new ToolManager(this);
    this.selectedElementsManager = new SelectedElementsManager(this);
    this.controllHandleManager = new ControllHandleManager(this);
  }
}
