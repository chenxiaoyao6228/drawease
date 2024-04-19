import { RoughCanvas } from 'roughjs/bin/canvas';

export interface Point {
  x: number;
  y: number;
}

// ----- 配置相关 -------
export interface Options {
  container: HTMLElement;
  width?: number;
  height?: number;
}

// ----- element相关 -----------
export interface RenderConfig {
  rc: RoughCanvas;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export interface IBaseElement {
  getData: () => BaseElementData;
  setData: (data: BaseElementData) => void;
  render: (renderConfig: RenderConfig) => void;
}

export interface ISelectableElement {
  isSelected: boolean;
  select(): void;
  move(x: number, y: number): void;
  rotate(angle: number): void;
}

// ----- elementData相关 -------
export type FillStyle = 'hachure' | 'cross-hatch' | 'solid' | 'zigzag';
export type StrokeStyle = 'solid' | 'dashed' | 'dotted';
export interface BaseElementData {
  id: string;
  type: string;
  // 布局相关属性
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  // 样式
  strokeColor: string;
  backgroundColor: string;
  fillStyle: FillStyle;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  roughness: number;
  // roundness: null | { type: RoundnessType; value?: number }; // 暂不支持
  opacity: number;
  // 版本控制
  isDeleted: boolean;
  version: number;
  versionNonce: number;
  // seed
  seed: number; // 保证rough.js每次重新渲染的时候形状不变
}

export interface RectElementData extends BaseElementData {
  type: 'rectangle';
}

export interface EllipseElementData extends BaseElementData {
  type: 'ellipse';
}

export interface LineElementData extends BaseElementData {
  type: 'line';
  points: [number, number][];
  lastCommittedPoint: null | [number, number];
  startBinding: null | string;
  endBinding: null | string;
  startArrowhead: null | string;
  endArrowhead: null | string;
}

export interface DiamondElementData extends BaseElementData {
  type: 'diamond';
}

export interface ArrowElementData extends BaseElementData {
  type: 'arrow';
  points: [number, number][];
  lastCommittedPoint: null | [number, number];
  startBinding: null | string;
  endBinding: null | string;
  startArrowhead: null | string;
  endArrowhead: null | string;
}

// ----- Tool相关 -------
export interface Tool {
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

export interface Zoom {
  value: number;
}

export interface SceneData {
  width: number;
  height: number;
  zoom: Zoom;
  offsetLeft: number;
  offsetTop: number;
  scrollX: number;
  scrollY: number;
}
