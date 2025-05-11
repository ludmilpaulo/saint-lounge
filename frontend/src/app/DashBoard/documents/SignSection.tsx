'use client';
import React, { useState, useMemo, useCallback } from 'react';
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

import { v4 as uuidv4 } from 'uuid';
import PDFViewer from './PDFViewer';
import DraggableElement from './DraggableElement';
import SignaturePadModal from './SignaturePadModal';
import { baseAPI } from '@/utils/variables';
import { PDFDocument } from 'pdf-lib';

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
  const [viewerDims, setViewerDims] = useState<{ width: number; height: number }>({ width: 800, height: 1100 });

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
      const pdfBytes = await fetch(selectedDoc.file_url).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);

      for (const el of elements) {
        const page = pdfDoc.getPages()[el.page - 1];
        const pngImageBytes = await fetch(el.src).then((r) => r.arrayBuffer());
        const embedded = await pdfDoc.embedPng(pngImageBytes);

        const { width: pageW, height: pageH } = page.getSize();

        const x = (el.x / viewerDims.width) * pageW;
        const y = pageH - (el.y / viewerDims.height) * pageH;

        const sigWidth = (el.width / viewerDims.width) * pageW;
        const sigHeight = (el.height / viewerDims.height) * pageH;

        page.drawImage(embedded, {
          x,
          y: y - sigHeight,
          width: sigWidth,
          height: sigHeight,
        });
      }

      const signedBytes = await pdfDoc.save();
      const signedBlob = new Blob([signedBytes as BlobPart], { type: 'application/pdf' });

      const formData = new FormData();
      formData.append('file', signedBlob, 'signed.pdf');
      formData.append('document_id', selectedDoc.id.toString());
      formData.append('user_id', auth_user.user_id.toString());

      const res = await fetch(`${baseAPI}/doc/save-signed-pdf/`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload signed PDF');

      alert('Document signed and uploaded!');
      dispatch(clearElements());

      const updated = await fetch(`${baseAPI}/doc/documents/${selectedDoc.id}/`).then((r) => r.json());
      if (updated.signed_file) {
        window.open(updated.signed_file, '_blank');
      }
    } catch (error) {
      console.error(error);
      alert('Error signing document.');
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
