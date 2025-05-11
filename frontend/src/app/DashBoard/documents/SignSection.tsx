'use client';
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  addElement,
  updateElementPosition,
  updateElementSize,
  deleteElement,
  clearElements,
} from '@/redux/slices/signatureSlice';
import { Document as Doc } from '@/services/documentService';
import { submitSignature } from '@/services/signatureService';
import { v4 as uuidv4 } from 'uuid';
import PDFViewer from './PDFViewer';
import DraggableElement from './DraggableElement';
import SignaturePadModal from './SignaturePadModal';
import { baseAPI } from '@/utils/variables';

interface Props {
  documents: Doc[];
  onLoading: (state: boolean) => void;
}

const SignSection: React.FC<Props> = ({ documents, onLoading }) => {
  const dispatch = useDispatch();
  const elements = useSelector((state: RootState) => state.signature.elements);
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [showPad, setShowPad] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [clickedPosition, setClickedPosition] = useState<{ x: number; y: number } | null>(null);
  const [viewerDims, setViewerDims] = useState({ width: 800, height: 1100 });

  const currentPageElements = useMemo(() => {
    return elements.filter((el) => el.page === pageNumber);
  }, [elements, pageNumber]);

  const handleSaveSignature = useCallback(
    (dataUrl: string) => {
      if (!clickedPosition) return;
      dispatch(
        addElement({
          id: uuidv4(),
          src: dataUrl,
          x: clickedPosition.x,
          y: clickedPosition.y,
          width: 200,
          height: 80,
          page: pageNumber,
        })
      );
      setClickedPosition(null);
    },
    [dispatch, clickedPosition, pageNumber]
  );

  const handlePositionChange = useCallback(
    (id: string, x: number, y: number) => {
      dispatch(updateElementPosition({ id, x, y }));
    },
    [dispatch]
  );

  const handleResizeChange = useCallback(
    (id: string, width: number, height: number, x: number, y: number) => {
      dispatch(updateElementSize({ id, width, height, x, y }));
    },
    [dispatch]
  );

  const handleDeleteElement = useCallback(
    (id: string) => {
      dispatch(deleteElement(id));
    },
    [dispatch]
  );

  const handleSubmit = async () => {
    if (!selectedDoc || !auth_user || elements.length === 0) {
      alert('Please place at least one signature.');
      return;
    }

    onLoading(true);

    try {
      for (const el of elements) {
        const res = await fetch(el.src);
        const blob = await res.blob();

        await submitSignature({
          documentId: selectedDoc.id,
          signatureImage: blob,
          x: el.x,
          y: el.y,
          pageNumber: el.page,
          userId: auth_user.user_id,
          renderWidth: viewerDims.width,
          renderHeight: viewerDims.height,
        });
      }

      alert('Document signed!');
      dispatch(clearElements());

      const updated = await fetch(`${baseAPI}/doc/documents/${selectedDoc.id}/`).then((res) =>
        res.json()
      );

      if (updated.signed_file) {
        window.open(updated.signed_file, '_blank');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to sign the document.');
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
          setPageNumber(1);
          dispatch(clearElements());
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
        <div className="relative border shadow-lg rounded p-4 bg-white overflow-visible">
          <PDFViewer
            fileUrl={selectedDoc.file_url}
            pageNumber={pageNumber}
            numPages={numPages}
            setPageNumber={setPageNumber}
            setNumPages={setNumPages}
            onPdfClick={(x, y, width, height) => {
              setClickedPosition({ x, y });
              setViewerDims({ width, height });
              setShowPad(true);
            }}
          />

          <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
            {currentPageElements.map((el) => (
              <div key={el.id} className="pointer-events-auto">
                <DraggableElement
                  id={el.id}
                  src={el.src}
                  defaultX={el.x}
                  defaultY={el.y}
                  defaultWidth={el.width}
                  defaultHeight={el.height}
                  onDelete={handleDeleteElement}
                  onPositionChange={handlePositionChange}
                  onResizeChange={handleResizeChange}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedDoc && (
        <div className="flex gap-4">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
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
