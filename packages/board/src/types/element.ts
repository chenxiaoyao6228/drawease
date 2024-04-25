import { RoughCanvas } from 'roughjs/bin/canvas';

import { Matrix } from '../utils/math/Matrix';

// ----- elementData相关 -------

export type IMatrixArr = [number, number, number, number, number, number];

export type FillStyle = 'hachure' | 'cross-hatch' | 'solid' | 'zigzag';
export type StrokeStyle = 'solid' | 'dashed' | 'dotted';
export interface IBaseElementData {
  id: string;
  type: string;
  // 布局相关属性
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  transform: IMatrixArr;
  // 样式
  strokeColor: string;
  backgroundColor: string;
  fillStyle: FillStyle;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  roughness: number;
  opacity: number;
  // 版本控制
  isDeleted: boolean;
  version: number;
  versionNonce: number;
  // seed
  seed: number; // 保证rough.js每次重新渲染的时候形状不变
}

export interface IRectElementData extends IBaseElementData {
  type: 'rectangle';
}

export interface IEllipseElementData extends IBaseElementData {
  type: 'ellipse';
}

export interface ILineElementData extends IBaseElementData {
  type: 'line';
  points: [number, number][];
  lastCommittedPoint: null | [number, number];
  startBinding: null | string;
  endBinding: null | string;
  startArrowhead: null | string;
  endArrowhead: null | string;
}

export interface IDiamondElementData extends IBaseElementData {
  type: 'diamond';
}

export interface IArrowElementData extends IBaseElementData {
  type: 'arrow';
  points: [number, number][];
  lastCommittedPoint: null | [number, number];
  startBinding: null | string;
  endBinding: null | string;
  startArrowhead: null | string;
  endArrowhead: null | string;
}

// ----- element相关 -----------

export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IBound {
  x: number;
  y: number;
  width: number;
  height: number;
  angle?: number;
  transform?: IMatrixArr;
}

export interface IRenderConfig {
  rc: RoughCanvas;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export interface IBaseElement {
  setSelected: (selected: boolean) => void;
  getData: () => IBaseElementData;
  setData: (data: IBaseElementData) => void;
  render: (renderConfig: IRenderConfig) => void;
  renderSelectionBorder: (ctx: CanvasRenderingContext2D) => void;
  hitTest: (e: PointerEvent) => boolean;
  move(x: number, y: number): void;
  updateTransform(matrix: Matrix): void;
  getBounds(): IBound;
}
