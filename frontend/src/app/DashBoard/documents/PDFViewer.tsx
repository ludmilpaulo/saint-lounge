'use client';
import React, { useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  fileUrl: string;
  pageNumber: number;
  numPages: number;
  setPageNumber: (page: number) => void;
  setNumPages: (num: number) => void;
  onPdfClick?: (x: number, y: number, renderWidth: number, renderHeight: number) => void;
}

const PDFViewer: React.FC<Props> = ({
  fileUrl,
  pageNumber,
  numPages,
  setPageNumber,
  setNumPages,
  onPdfClick,
}) => {
  const pageRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!pageRef.current || !onPdfClick) return;

    const rect = pageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    onPdfClick(x, y, width, height);
  };

  return (
    <div className="flex flex-col items-center">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<p className="text-center text-gray-500">Loading PDF...</p>}
      >
        <div ref={pageRef} onClick={handleClick} className="cursor-crosshair">
          <Page pageNumber={pageNumber} width={800} />
        </div>
      </Document>

      <div className="mt-4 flex items-center justify-between w-full max-w-xl">
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-sm text-gray-600">
          Page {pageNumber} of {numPages}
        </p>
        <button
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber(pageNumber + 1)}
          className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;
