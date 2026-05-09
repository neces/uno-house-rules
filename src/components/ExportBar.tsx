import { useState } from 'react';
import type { RefObject } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export type ExportBarProps = {
  targetRef: RefObject<HTMLElement | null>;
  filenameSlug: string;
};

const VIRTUAL_WIDTH = 880;
const COLUMN_MAX = `${48 * 16}px`;

function stylePdfHost(host: HTMLElement) {
  Object.assign(host.style, {
    position: 'fixed',
    left: '-12000px',
    top: '0',
    width: `${VIRTUAL_WIDTH}px`,
    maxWidth: '100vw',
    padding: '40px',
    boxSizing: 'border-box',
    background: '#fdf6e3',
    color: '#1a1410',
    zIndex: '2147483646',
    pointerEvents: 'none',
    display: 'block',
  });
  host.setAttribute('aria-hidden', 'true');
  host.className = 'export-pdf-clone';
}

function pinExportColumnWidth(sheet: HTMLElement) {
  Object.assign(sheet.style, {
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: COLUMN_MAX,
    marginLeft: 'auto',
    marginRight: 'auto',
  });
}

/** Match `@media print` pruning in `index.css` as closely as we can for html2canvas. */
function pruneCloneForExport(clone: HTMLElement) {
  clone.querySelectorAll('[data-rule-selected="false"]').forEach(el => el.remove());
  clone.querySelectorAll('.no-print').forEach(el => el.remove());
  clone.querySelectorAll('section header .stamp').forEach(el => el.remove());
  clone.querySelectorAll('section[data-category="extras"]').forEach(section => {
    if (!section.querySelector('li')) {
      section.remove();
    }
  });
}

/** html2canvas can't render `<input>` text inline; swap to a span carrying the same value. */
function replaceTitleInputs(clone: HTMLElement) {
  clone.querySelectorAll('h1 input').forEach(input => {
    const el = input as HTMLInputElement;
    const value = el.value || el.placeholder || '';
    const span = document.createElement('span');
    span.textContent = value;
    span.style.display = 'inline-block';
    span.style.width = '100%';
    el.replaceWith(span);
  });
}

/** html2canvas paints SVG `background-image` poorly; substitute an inline SVG that paints reliably. */
function replaceWobbleUnderlinesForExport(root: HTMLElement) {
  root.querySelectorAll('.wobble-underline').forEach(el => {
    const h = el as HTMLElement;
    h.classList.remove('wobble-underline');
    h.style.backgroundImage = 'none';
    h.style.position = 'relative';
    h.style.overflow = 'visible';
    h.style.paddingBottom = '0.3em';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 12');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    Object.assign(svg.style, {
      position: 'absolute',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100%',
      height: '0.5em',
      display: 'block',
      pointerEvents: 'none',
    });
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M2 7 Q 25 1, 50 6 T 100 7 T 150 6 T 198 8');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#1a1410');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
    h.appendChild(svg);
  });
}

/**
 * Rasterises the rule sheet and saves a one-page PDF sized to the content (A4 width, height by aspect ratio).
 */
export function ExportBar({ targetRef, filenameSlug }: ExportBarProps) {
  const [busy, setBusy] = useState(false);

  const handleDownloadPdf = async () => {
    const source = targetRef.current;
    if (!source) return;
    setBusy(true);

    const host = document.createElement('div');
    stylePdfHost(host);

    const clone = source.cloneNode(true) as HTMLElement;
    host.appendChild(clone);
    document.body.appendChild(host);

    pruneCloneForExport(clone);
    replaceTitleInputs(clone);
    replaceWobbleUnderlinesForExport(clone);
    pinExportColumnWidth(clone);

    try {
      void host.offsetHeight;
      await document.fonts.ready.catch(() => {});
      await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));

      const canvas = await html2canvas(host, {
        scale: 2,
        backgroundColor: '#fdf6e3',
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/png');

      /** One tall page: full A4 width in mm, height follows image aspect (scrollable in viewers). */
      const pageWidthMm = 210;
      const aspect = canvas.height / canvas.width;
      const pageHeightMm = pageWidthMm * aspect;

      const pdf = new jsPDF({
        orientation: pageHeightMm > pageWidthMm ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [pageWidthMm, pageHeightMm],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidthMm, pageHeightMm, undefined, 'SLOW');

      const date = new Date().toISOString().slice(0, 10);
      const safe = filenameSlug.trim() || 'custom';
      pdf.save(`uno-rules-${safe}-${date}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Sorry, PDF export failed. Try again in a moment.');
    } finally {
      document.body.removeChild(host);
      setBusy(false);
    }
  };

  return (
    <div
      className={[
        'no-print fixed z-30 pb-safe',
        'bottom-0 left-0 right-0 w-full',
        'lg:left-auto lg:right-6 lg:bottom-6 lg:w-max lg:max-w-[min(100vw-1.5rem,100%)]',
      ].join(' ')}
    >
      <div
        className={[
          'flex items-center justify-end gap-3',
          'w-full lg:w-auto px-4 sm:px-6 py-3 md:py-4 lg:py-3',
        ].join(' ')}
      >
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={busy}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-md bg-uno-yellow text-uno-black border-2 border-uno-black font-marker tracking-wide shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:-rotate-1 hover:shadow-[5px_5px_0_rgba(0,0,0,0.3)] transition-all disabled:opacity-50 disabled:cursor-wait"
          aria-label="Download as PDF"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden>
            <path
              d="M14 2 H6 a2 2 0 0 0 -2 2 V20 a2 2 0 0 0 2 2 H18 a2 2 0 0 0 2 -2 V8 Z M14 2 V8 H20 M12 18 V12 M9 15 L12 18 L15 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{busy ? 'Saving…' : 'PDF'}</span>
        </button>
      </div>
    </div>
  );
}
