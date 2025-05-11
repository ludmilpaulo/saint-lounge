'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { baseAPI } from '@/utils/variables';
import PDFViewer from '../DashBoard/documents/PDFViewer';
import SignaturePadModal from '../DashBoard/documents/SignaturePadModal';
import DraggableElement from './DraggableElement';
import FloatingToolbar from '../DashBoard/documents/FloatingToolbar';
import { PDFDocument, degrees } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';

interface SignatureElement {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  rotation: number;
  isResizable: boolean;
}

export default function UserSignPage() {
  const token = useSearchParams().get('token');
  const [documentUrl, setDocumentUrl] = useState('');
  const [signatureElements, setSignatureElements] = useState<SignatureElement[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [showPad, setShowPad] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clickedPosition, setClickedPosition] = useState<{ x: number; y: number } | null>(null);
  const [viewerDims, setViewerDims] = useState({ width: 800, height: 1100 });

  useEffect(() => {
    axios.get(`${baseAPI}/doc/invite/${token}/`).then(({ data }) => {
      setDocumentUrl(data.document.file_url);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  const handlePdfClick = (x: number, y: number, width: number, height: number) => {
    setClickedPosition({ x, y });
    setViewerDims({ width, height });
    setShowPad(true);
  };

  const handleSaveSignature = (src: string) => {
    if (!clickedPosition) return;
    setSignatureElements((prev) => [
      ...prev,
      {
        id: uuidv4(),
        src,
        x: clickedPosition.x,
        y: clickedPosition.y,
        width: 180,
        height: 60,
        page: pageNumber,
        rotation: 0,
        isResizable: true,
      },
    ]);
    setShowPad(false);
    setClickedPosition(null);
  };

  const currentPageElements = useMemo(
    () => signatureElements.filter((el) => el.page === pageNumber),
    [signatureElements, pageNumber]
  );

  const handleFlattenUpload = async () => {
    const pdfDoc = await PDFDocument.load(await fetch(documentUrl).then((r) => r.arrayBuffer()));

    for (const sig of signatureElements) {
      const img = await pdfDoc.embedPng(await fetch(sig.src).then((r) => r.arrayBuffer()));
      const page = pdfDoc.getPage(sig.page - 1);
      const { width, height } = page.getSize();
      const scaleX = width / viewerDims.width;
      const scaleY = height / viewerDims.height;

      page.drawImage(img, {
        x: sig.x * scaleX,
        y: height - sig.y * scaleY - sig.height * scaleY,
        width: sig.width * scaleX,
        height: sig.height * scaleY,
        rotate: degrees(sig.rotation),
      });
    }

    const finalBytes = await pdfDoc.save();
    const signedBlob = new Blob([finalBytes as BlobPart], { type: 'application/pdf' });

    

    const formData = new FormData();
    formData.append('signed_pdf', signedBlob, 'signed-document.pdf');

    await axios.post(`${baseAPI}/doc/invite/${token}/sign/`, formData);
    alert('✅ Successfully signed!');
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading document...</div>;

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-4">
      <h1 className="text-3xl font-semibold text-gray-800 text-center">Sign Document</h1>

      <div className="relative border rounded-lg shadow overflow-hidden">
        <PDFViewer
          fileUrl={documentUrl}
          pageNumber={pageNumber}
          numPages={numPages}
          setPageNumber={setPageNumber}
          setNumPages={setNumPages}
          onPdfClick={handlePdfClick}
        />

        {currentPageElements.map((el) => (
          <div key={el.id} className="absolute top-0 left-0 z-10">
            <DraggableElement
              id={el.id}
              src={el.src}
              defaultX={el.x}
              defaultY={el.y}
              defaultWidth={el.width}
              defaultHeight={el.height}
              onDelete={(id) => setSignatureElements((s) => s.filter((e) => e.id !== id))}
              onPositionChange={(id, x, y) =>
                setSignatureElements((s) =>
                  s.map((e) => (e.id === id ? { ...e, x, y } : e))
                )
              }
              onResizeChange={(id, w, h, x, y) =>
                setSignatureElements((s) =>
                  s.map((e) => (e.id === id ? { ...e, width: w, height: h, x, y } : e))
                )
              }
            >
              <FloatingToolbar
                onDelete={() => setSignatureElements((s) => s.filter((e) => e.id !== el.id))}
                isResizable={el.isResizable}
                onToggleResize={() =>
                  setSignatureElements((s) =>
                    s.map((e) =>
                      e.id === el.id ? { ...e, isResizable: !e.isResizable } : e
                    )
                  )
                }
                onRotateLeft={() =>
                  setSignatureElements((s) =>
                    s.map((e) =>
                      e.id === el.id ? { ...e, rotation: e.rotation - 15 } : e
                    )
                  )
                }
                onRotateRight={() =>
                  setSignatureElements((s) =>
                    s.map((e) =>
                      e.id === el.id ? { ...e, rotation: e.rotation + 15 } : e
                    )
                  )
                }
              />
            </DraggableElement>
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setShowPad(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded shadow"
        >
          Add Signature Manually
        </button>

        <button
          onClick={handleFlattenUpload}
          className="px-4 py-2 bg-green-600 text-white rounded shadow"
        >
          Finalize & Upload
        </button>
      </div>

      {showPad && (
        <SignaturePadModal
          onClose={() => setShowPad(false)}
          onSave={handleSaveSignature}
          canvasWidth={400}
          canvasHeight={100}
        />
      )}
    </div>
  );
}
