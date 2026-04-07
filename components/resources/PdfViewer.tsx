"use client";

import { useState, useRef} from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";

// @ts-ignore
import "react-pdf/dist/Page/TextLayer.css";
// @ts-ignore
import "react-pdf/dist/Page/AnnotationLayer.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

// ✅ Worker (stable)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

// ✅ Types (no more `any`)
type PdfViewerProps = {
  resource: {
    _id: string;
    fileUrl: string;
  };
  progress?: {
    lastPageRead?: number;
    progressPercentage?: number;
  };
  onProgressUpdate?: (data: unknown) => void;
};

export const PdfViewer = ({
  resource,
  progress,
  onProgressUpdate,
}: PdfViewerProps) => {
  const fileUrl = resource?.fileUrl;

  const [page, setPage] = useState(progress?.lastPageRead || 1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.2);
  const [mode, setMode] = useState<"page" | "scroll">("page");
  const [loading, setLoading] = useState(true);

  // ✅ FIX: useRef instead of variable mutation
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  // ✅ Clean debounce
  const updateProgress = (newPage: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.patch("/api/progress", {
          resourceId: resource._id,
          currentPage: newPage,
        });

        onProgressUpdate?.(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }, 500);
  };

  const changePage = (newPage: number) => {
    if (!numPages) return;
    if (newPage < 1 || newPage > numPages) return;

    setPage(newPage);
    updateProgress(newPage);
  };

  const progressPercent = numPages ? Math.round((page / numPages) * 100) : 0;

  // ✅ Guard AFTER hooks (important)
  if (!fileUrl) {
    return <p className="text-red-400">No PDF URL found</p>;
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-neutral-900 p-3 rounded flex flex-wrap gap-3 items-center justify-between">
        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button onClick={() => changePage(page - 1)} disabled={page <= 1}>
            <ArrowLeft/>
          </button>

          <span>
            {page} / {numPages || "..."}
          </span>

          <button
            onClick={() => changePage(page + 1)}
            disabled={numPages ? page >= numPages : true}
          >
            <ArrowRight/>
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-3">
          <button onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}>
            ➖
          </button>

          <span>{Math.round(scale * 100)}%</span>

          <button onClick={() => setScale((s) => s + 0.2)}>➕</button>

          <button
            onClick={() => setMode(mode === "page" ? "scroll" : "page")}
            className="px-2 py-1 bg-gray-700 rounded"
          >
            {mode === "page" ? "Scroll" : "Page"}
          </button>
        </div>

        {/* Open */}
        <a href={fileUrl} target="_blank" className="underline text-sm">
          Open ↗
        </a>
      </div>

      {/* Viewer */}
      <div className="flex-1 overflow-auto bg-black rounded p-3 flex justify-center">
        {loading && <p className="text-gray-400">Loading PDF...</p>}

        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<p className="text-gray-400">Loading PDF...</p>}
          error={<p className="text-red-400">Failed to load PDF</p>}
        >
          {mode === "page" ? (
            <Page pageNumber={page} scale={scale} />
          ) : (
            Array.from({ length: numPages || 0 }, (_, i) => (
              <Page key={i} pageNumber={i + 1} scale={scale} />
            ))
          )}
        </Document>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-700 h-2 rounded">
        <div
          className="bg-green-500 h-2 rounded transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
