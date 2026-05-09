import { useState } from 'react';
import { toPng } from 'html-to-image';

export type ExportBarProps = {
  /** Live DOM node that should be exported. */
  targetRef: React.RefObject<HTMLElement | null>;
  /** Used to construct the download filename. */
  filenameSlug: string;
};

const VIRTUAL_WIDTH = 880; // px — fixed width for poster-quality output

export function ExportBar({ targetRef, filenameSlug }: ExportBarProps) {
  const [busy, setBusy] = useState(false);

  const handleDownload = async () => {
    const source = targetRef.current;
    if (!source) return;
    setBusy(true);

    // Clone the node into a hidden, fixed-width host so phone exports look as
    // good as desktop ones.
    const host = document.createElement('div');
    host.style.position = 'fixed';
    host.style.top = '0';
    host.style.left = '-100000px'; // far off-screen
    host.style.width = `${VIRTUAL_WIDTH}px`;
    host.style.padding = '40px';
    host.style.background = '#fdf6e3';
    host.style.color = '#1a1410';
    host.style.boxSizing = 'border-box';
    host.className = 'export-clone';

    const clone = source.cloneNode(true) as HTMLElement;
    host.appendChild(clone);
    document.body.appendChild(host);

    try {
      const dataUrl = await toPng(host, {
        pixelRatio: 2,
        backgroundColor: '#fdf6e3',
        cacheBust: true,
      });
      const link = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      link.download = `uno-rules-${filenameSlug}-${date}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG export failed:', err);
      alert('Sorry, the PNG export failed. Try again or use Print as a fallback.');
    } finally {
      document.body.removeChild(host);
      setBusy(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className={[
        'no-print',
        // Sticky on mobile, inline on md+
        'sticky bottom-0 left-0 right-0 z-30 md:static md:mt-12',
        'pb-safe',
      ].join(' ')}
    >
      <div className="md:max-w-3xl md:mx-auto px-4 sm:px-6 py-3 md:py-4 flex items-center justify-end gap-3 bg-paper/95 backdrop-blur-sm md:bg-transparent border-t-2 border-ink/10 md:border-0">
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-md bg-uno-yellow text-uno-black border-2 border-uno-black font-marker tracking-wide shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:-rotate-1 hover:shadow-[5px_5px_0_rgba(0,0,0,0.3)] transition-all disabled:opacity-50 disabled:cursor-wait"
          aria-label="Download as PNG"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
            <path
              d="M12 4 V16 M6 12 L12 18 L18 12 M5 21 H19"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{busy ? 'Drawing...' : 'PNG'}</span>
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-md bg-uno-red text-paper border-2 border-uno-black font-marker tracking-wide shadow-[3px_3px_0_rgba(0,0,0,0.3)] hover:-rotate-1 hover:shadow-[5px_5px_0_rgba(0,0,0,0.3)] transition-all"
          aria-label="Print or save as PDF"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
            <path
              d="M7 9 V4 H17 V9 M5 9 H19 a2 2 0 0 1 2 2 V17 H17 V21 H7 V17 H3 V11 a2 2 0 0 1 2 -2 Z M7 14 H17 V21 H7 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          <span>Print</span>
        </button>
      </div>
    </div>
  );
}
