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
