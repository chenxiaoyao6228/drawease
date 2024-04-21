import { IBound } from './element';

export type ControlHandleDirection = 'n' | 's' | 'w' | 'e' | 'nw' | 'ne' | 'sw' | 'se';

export type ControlHandleType = ControlHandleDirection | 'rotation';

export type ControlHandle = IBound;

export type ControlHandleObj = {
  type: ControlHandleType;
  bound: ControlHandle;
};

export type ControlHandles = Partial<{
  [T in ControlHandleType]: ControlHandle;
}>;
