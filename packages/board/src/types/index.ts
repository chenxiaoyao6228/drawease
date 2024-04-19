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
  pointerDown(event: PointerEvent): void;
  pointerMove(event: PointerEvent): void;
  pointerUp(event: PointerEvent): void;
}

export enum ToolType {
  Select = 'select',
  Rect = 'Rect',
  Diamond = 'Diamond',
  Ellipse = 'Ellipse',
  Line = 'Line'
}

// ------ Scene ---------

export interface IZoom {
  value: number;
}

export interface ISceneData {
  width: number;
  height: number;
  zoom: IZoom;
  offsetLeft: number;
  offsetTop: number;
  scrollX: number;
  scrollY: number;
}

export interface IPoint {
  x: number;
  y: number;
}
