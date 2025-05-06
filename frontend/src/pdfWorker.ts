// src/pdfWorker.ts
import { pdfjs } from "react-pdf";

// Match worker to exact version of pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
