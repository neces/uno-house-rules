import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export type DeleteRuleDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  /** Shown so people know which rule they’re about to bin. */
  previewText: string;
};

export function DeleteRuleDialog({
  open,
  onCancel,
  onConfirm,
  previewText,
}: DeleteRuleDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    cancelRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-0 bg-ink/45 backdrop-blur-[1px]"
        aria-label="Dismiss"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-rule-title"
        className="relative z-10 w-full max-w-md rounded-2xl border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_rgba(0,0,0,0.22)]"
      >
        <h2 id="delete-rule-title" className="font-marker text-lg text-ink">
          Toss this house rule?
        </h2>
        <p className="mt-1 text-xs font-marker uppercase tracking-wide text-ink-muted">
          There is no uno reverse card for this action.
        </p>
        <p className="mt-3 max-h-28 overflow-y-auto font-body text-base leading-snug text-ink break-words whitespace-pre-wrap">
          {previewText}
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="min-h-[44px] rounded-md border-2 border-ink bg-paper px-4 py-2 font-marker tracking-wide text-ink shadow-[3px_3px_0_rgba(0,0,0,0.15)] transition hover:-rotate-1"
          >
            Never mind
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[44px] rounded-md border-2 border-uno-red bg-uno-red px-4 py-2 font-marker tracking-wide text-paper shadow-[3px_3px_0_rgba(0,0,0,0.25)] transition hover:-rotate-1"
          >
            Yes, delete it
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
