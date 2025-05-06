'use client';
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import FloatingToolbar from './FloatingToolbar';


interface Props {
  src: string;
  id: string;
  onDelete: (id: string) => void;
}

const DraggableElement: React.FC<Props> = ({ src, id, onDelete }) => {
  const [showToolbar, setShowToolbar] = useState(false);

  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 150,
        height: 50,
      }}
      bounds="parent"
      onClick={() => setShowToolbar(true)}
      onBlur={() => setShowToolbar(false)}
      enableResizing
    >
      <div className="relative w-full h-full border border-blue-400 rounded bg-white shadow-md">
        <img src={src} alt="Signature" className="w-full h-full object-contain" />
        {showToolbar && <FloatingToolbar onDelete={() => onDelete(id)} />}
      </div>
    </Rnd>
  );
};

export default DraggableElement;
