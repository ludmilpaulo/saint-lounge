declare module 'react-resizable-and-movable' {
    import * as React from 'react';
  
    export type Direction =
      | 'top'
      | 'topRight'
      | 'right'
      | 'bottomRight'
      | 'bottom'
      | 'bottomLeft'
      | 'left'
      | 'topLeft';
  
    export interface RndDragCallbackData {
      x: number;
      y: number;
    }
  
    export interface RndResizeCallbackData {
      x: number;
      y: number;
    }
  
    export interface ResizableAndMovableProps {
      x: number;
      y: number;
      width: number;
      height: number;
      z?: number;
      bounds?: 'parent' | string;
      onDragStop?: (
        e: React.MouseEvent | React.TouchEvent,
        data: RndDragCallbackData
      ) => void;
      onResizeStop?: (
        e: React.MouseEvent | React.TouchEvent,
        dir: Direction,
        ref: HTMLDivElement,
        delta: { width: number; height: number },
        position: RndResizeCallbackData
      ) => void;
      children?: React.ReactNode;
    }
  
    const RRM: React.FC<ResizableAndMovableProps>;
  
    export default RRM;
  }
  