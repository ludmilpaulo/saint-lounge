'use client';
import React, { useState } from 'react';
import { Rnd, RndResizeCallback, RndDragCallback } from 'react-rnd';
import NextImage from 'next/image';

interface Props {
  id: string;
  src: string;
  onDelete: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  defaultX?: number;
  defaultY?: number;
}

const DraggableElement: React.FC<Props> = ({
  id,
  src,
  onDelete,
  onPositionChange,
  defaultX = 100,
  defaultY = 100,
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [isResizable, setIsResizable] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: defaultX, y: defaultY });
  const [size, setSize] = useState({ width: 150, height: 50 });

  const handleDragStop: RndDragCallback = (_, d) => {
    setPosition({ x: d.x, y: d.y });
    onPositionChange(id, d.x, d.y);
  };

  const handleResizeStop: RndResizeCallback = (_, __, ref, ___, pos) => {
    setSize({
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height),
    });
    setPosition(pos);
    onPositionChange(id, pos.x, pos.y);
  };

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={position}
      bounds="parent"
      enableResizing={isResizable}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
    >
      <div
        className="relative w-full h-full"
        onMouseDown={() => setShowToolbar(true)}
        onMouseLeave={() => setShowToolbar(false)}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <NextImage
          src={src}
          alt="Signature"
          fill
          className="object-contain rounded"
        />

        {showToolbar && (
          <div className="absolute -top-8 right-0 flex gap-2 bg-white border rounded shadow px-2 py-1 z-50">
            <button onClick={() => setRotation((r) => r - 15)} className="text-xs text-gray-600">
              ⟲
            </button>
            <button onClick={() => setRotation((r) => r + 15)} className="text-xs text-gray-600">
              ⟳
            </button>
            <button onClick={() => setIsResizable((r) => !r)} className="text-xs text-gray-600">
              {isResizable ? '🔓' : '🔒'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="text-xs text-red-500"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </Rnd>
  );
};

export default DraggableElement;
