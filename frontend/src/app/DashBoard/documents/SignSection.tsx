'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Document as Doc } from '@/services/documentService';
import { submitSignature } from '@/services/signatureService';
import { v4 as uuidv4 } from 'uuid';

import PDFViewer from './PDFViewer';
import DraggableElement from './DraggableElement';
import SignaturePadModal from './SignaturePadModal';

interface Element {
  id: string;
  src: string;
  x: number;
  y: number;
  page: number;
}

interface Props {
  documents: Doc[];
  onLoading: (state: boolean) => void;
}

const SignSection: React.FC<Props> = ({ documents, onLoading }) => {
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [showPad, setShowPad] = useState(false);
  const [elements, setElements] = useState<Element[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [clickedPosition, setClickedPosition] = useState<{ x: number; y: number } | null>(null);

  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handlePositionChange = (id: string, x: number, y: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  };

  const handlePdfClick = (x: number, y: number) => {
    setClickedPosition({ x, y });
    setShowPad(true);
  };

  const handleSaveSignature = (dataUrl: string) => {
    if (!clickedPosition) return;
    const newEl: Element = {
      id: uuidv4(),
      src: dataUrl,
      x: clickedPosition.x,
      y: clickedPosition.y,
      page: pageNumber,
    };
    setElements((prev) => [...prev, newEl]);
    setClickedPosition(null);
  };

  const handleSubmit = async () => {
    if (!selectedDoc || !auth_user || elements.length === 0) {
      alert('Please place a signature before submitting.');
      return;
    }

    onLoading(true);
    try {
      const sig = elements[0]; // support multiple later
      const res = await fetch(sig.src);
      const blob = await res.blob();

      await submitSignature({
        documentId: selectedDoc.id,
        signatureImage: blob,
        x: sig.x,
        y: sig.y,
        pageNumber: sig.page,
        userId: auth_user.user_id,
      });

      alert('Document signed!');
    } catch (error) {
      console.error(error);
      alert('Failed to sign document.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Sign Document</h2>

      <select
        className="p-2 border rounded w-full"
        value={selectedDoc?.id ?? ''}
        onChange={(e) => {
          const doc = documents.find((d) => d.id === Number(e.target.value));
          setSelectedDoc(doc || null);
          setElements([]);
          setPageNumber(1);
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
        <div className="relative border shadow-lg rounded p-4 bg-white overflow-hidden">
          <PDFViewer
            fileUrl={selectedDoc.file_url}
            pageNumber={pageNumber}
            numPages={numPages}
            setPageNumber={setPageNumber}
            setNumPages={setNumPages}
            onPdfClick={handlePdfClick}
          />

          <div className="absolute top-0 left-0 w-full h-full z-30 pointer-events-none">
            {elements
              .filter((el) => el.page === pageNumber)
              .map((el) => (
                <div className="pointer-events-auto" key={el.id}>
                  <DraggableElement
                    id={el.id}
                    src={el.src}
                    onDelete={handleDeleteElement}
                    onPositionChange={handlePositionChange}
                    defaultX={el.x}
                    defaultY={el.y}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {selectedDoc && (
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit Signed Document
          </button>
        </div>
      )}

      {showPad && (
        <SignaturePadModal
          onClose={() => {
            setShowPad(false);
            setClickedPosition(null);
          }}
          onSave={handleSaveSignature}
          canvasWidth={400}
          canvasHeight={100}
        />
      )}
    </div>
  );
};

export default SignSection;
