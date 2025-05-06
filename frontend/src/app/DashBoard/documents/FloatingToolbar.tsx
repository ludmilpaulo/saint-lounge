'use client';
import React from 'react';
import { RotateCcw, RotateCw, Maximize2, Minimize2, Trash2 } from 'lucide-react';

interface Props {
  onDelete: () => void;
  isResizable: boolean;
  onToggleResize: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
}

const FloatingToolbar: React.FC<Props> = ({
  onDelete,
  isResizable,
  onToggleResize,
  onRotateLeft,
  onRotateRight,
}) => {
  return (
    <div className="absolute -top-10 right-0 flex items-center gap-2 bg-white border rounded shadow px-2 py-1 z-10">
      <button onClick={onRotateLeft} title="Rotate Left">
        <RotateCcw size={16} className="text-gray-700 hover:text-black" />
      </button>
      <button onClick={onRotateRight} title="Rotate Right">
        <RotateCw size={16} className="text-gray-700 hover:text-black" />
      </button>
      <button onClick={onToggleResize} title={isResizable ? 'Lock Resize' : 'Unlock Resize'}>
        {isResizable ? (
          <Minimize2 size={16} className="text-gray-700 hover:text-black" />
        ) : (
          <Maximize2 size={16} className="text-gray-700 hover:text-black" />
        )}
      </button>
      <button onClick={onDelete} title="Delete">
        <Trash2 size={16} className="text-red-500 hover:text-red-700" />
      </button>
    </div>
  );
};

export default FloatingToolbar;
