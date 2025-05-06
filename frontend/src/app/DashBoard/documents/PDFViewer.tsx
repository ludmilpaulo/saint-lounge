'use client';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import React from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  fileUrl: string;
  pageNumber: number;
  numPages: number;
  setPageNumber: (page: number) => void;
}

const PDFViewer: React.FC<Props> = ({ fileUrl, pageNumber, numPages, setPageNumber }) => {
  return (
    <div className="relative">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setPageNumber(Math.min(pageNumber, numPages))}
        loading={<p className="text-center text-gray-500">Loading PDF...</p>}
      >
        <Page pageNumber={pageNumber} width={800} />
      </Document>
      <div className="mt-4 flex justify-between">
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-sm text-gray-600">Page {pageNumber} of {numPages}</p>
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
