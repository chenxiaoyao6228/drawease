export * from './element';

// ----- 配置相关 -------
export interface IOptions {
  container: HTMLElement;
  width?: number;
  height?: number;
}

// ----- Tool相关 -------
export interface ITool {
  type: ToolType; //工具类型
  active: () => void;
  deactive: () => void;
  pointerDown(event: PointerEvent): void;
  pointerMove(event: PointerEvent): void;
  pointerUp(event: PointerEvent): void;
}

export enum ToolType {
  Pan = 'pan',
  Select = 'select',
  Move = 'select_move',
  Rotate = 'select_rotate',
  Resize = 'select_resize',
  SelectArea = 'select_area',
  Rect = 'Rect',
  Diamond = 'Diamond',
  Ellipse = 'Ellipse',
  Line = 'Line'
}

// ------ Scene ---------

export interface ISceneData {
  width: number;
  height: number;
}

export interface IPoint {
  x: number;
  y: number;
}
