'use client';
import React, { useRef, useState, useEffect } from 'react';
import Moveable from 'react-moveable';
import NextImage from 'next/image';

interface Props {
  id: string;
  src: string;
  defaultX: number;
  defaultY: number;
  defaultWidth: number;
  defaultHeight: number;
  onDelete: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  onResizeChange: (id: string, width: number, height: number, x: number, y: number) => void;
  children?: React.ReactNode;
}

const DraggableElement: React.FC<Props> = ({
  id,
  src,
  defaultX,
  defaultY,
  defaultWidth,
  defaultHeight,
  onDelete,
  onPositionChange,
  onResizeChange,
  children,
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({
    translate: [defaultX, defaultY] as [number, number],
    width: defaultWidth,
    height: defaultHeight,
    rotate: 0,
  });

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setFrame({
      translate: [defaultX, defaultY],
      width: defaultWidth,
      height: defaultHeight,
      rotate: 0,
    });
  }, [defaultX, defaultY, defaultWidth, defaultHeight]);

  return (
    <div
      className="absolute top-0 left-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        ref={targetRef}
        style={{
          width: `${frame.width}px`,
          height: `${frame.height}px`,
          transform: `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${frame.rotate}deg)`,
          position: 'absolute',
          border: hovered ? '1px dashed #4f46e5' : '1px solid transparent',
        }}
        className="rounded overflow-hidden"
      >
        <NextImage
          src={src}
          alt="Signature"
          fill
          className="object-contain pointer-events-none"
        />

        {hovered && children}
      </div>

      {hovered && (
        <Moveable
          target={targetRef}
          draggable
          resizable
          rotatable
          renderDirections={['nw', 'ne', 'sw', 'se']}
          snapCenter
          snappable
          snapThreshold={5}
          snapGridWidth={10}
          snapGridHeight={10}
          origin={false}
          edge={false}
          onDrag={({ beforeTranslate }) => {
            setFrame((prev) => ({ ...prev, translate: beforeTranslate as [number, number] }));
          }}
          onDragEnd={({ lastEvent }) => {
            if (lastEvent) {
              const [x, y] = lastEvent.beforeTranslate as [number, number];
              onPositionChange(id, x, y);
            }
          }}
          onResize={({ width, height, drag }) => {
            const [x, y] = drag.beforeTranslate as [number, number];
            setFrame((prev) => ({
              ...prev,
              width,
              height,
              translate: [x, y],
            }));
          }}
          onResizeEnd={({ lastEvent }) => {
            if (lastEvent) {
              const { width, height } = lastEvent;
              const [x, y] = lastEvent.drag.beforeTranslate as [number, number];
              onResizeChange(id, width, height, x, y);
            }
          }}
          onRotate={({ beforeRotate }) => {
            setFrame((prev) => ({ ...prev, rotate: beforeRotate }));
          }}
        />
      )}
    </div>
  );
};

export default DraggableElement;
