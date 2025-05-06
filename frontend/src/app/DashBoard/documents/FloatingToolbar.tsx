'use client';
import React from 'react';

interface Props {
  onDelete: () => void;
}

const FloatingToolbar: React.FC<Props> = ({ onDelete }) => {
  return (
    <div className="absolute -top-8 right-0 flex gap-2 bg-white border rounded shadow px-2 py-1 z-10">
      <button
        onClick={onDelete}
        className="text-sm text-red-500 hover:underline"
      >
        Delete
      </button>
    </div>
  );
};

export default FloatingToolbar;
