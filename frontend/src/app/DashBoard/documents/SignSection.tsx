'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Document as Doc } from '@/services/documentService';

import { v4 as uuidv4 } from 'uuid';
import DraggableElement from './DraggableElement';
import PDFViewer from './PDFViewer';
import SignaturePadModal from './SignaturePadModal';

interface Props {
  documents: Doc[];
  onLoading: (state: boolean) => void;
}

const SignSection: React.FC<Props> = ({ documents, onLoading }) => {
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [showPad, setShowPad] = useState(false);
  const [elements, setElements] = useState<{ id: string; src: string }[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);

  const handleSaveSignature = (dataUrl: string) => {
    const newElement = { id: uuidv4(), src: dataUrl };
    setElements((prev) => [...prev, newElement]);
  };

  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Sign Document</h2>

      <select
        className="p-2 border rounded w-full"
        value={selectedDoc?.id ?? ''}
        onChange={(e) => {
          const doc = documents.find((d) => d.id === Number(e.target.value));
          setSelectedDoc(doc || null);
          setElements([]);
        }}
      >
        <option value="">Select a document</option>
        {documents.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.title}
          </option>
        ))}
      </select>

      {selectedDoc && (
        <div className="relative border shadow-lg rounded p-4 bg-white">
          <PDFViewer
            fileUrl={selectedDoc.file_url}
            pageNumber={pageNumber}
            numPages={numPages}
            setPageNumber={setPageNumber}
          />

          <div className="absolute top-0 left-0 w-full h-full z-30">
            {elements.map((el) => (
              <DraggableElement
                key={el.id}
                id={el.id}
                src={el.src}
                onDelete={handleDeleteElement}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setShowPad(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Signature
        </button>
        {/* Extend for initials/date if needed */}
      </div>

      {showPad && (
        <SignaturePadModal
          onClose={() => setShowPad(false)}
          onSave={handleSaveSignature}
        />
      )}
    </div>
  );
};

export default SignSection;
