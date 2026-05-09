import { useEffect, useRef, useState } from 'react';
import type { AccentColor, RuleOption } from '../types/rules';
import { DeleteRuleDialog } from './DeleteRuleDialog';

const ACCENT: Record<
  AccentColor,
  { bg: string; border: string; text: string; ring: string; soft: string }
> = {
  red: {
    bg: 'bg-uno-red',
    border: 'border-uno-red',
    text: 'text-uno-red',
    ring: 'ring-uno-red/40',
    soft: 'bg-uno-red/10',
  },
  yellow: {
    bg: 'bg-uno-yellow',
    border: 'border-uno-yellow',
    text: 'text-uno-yellow-deep',
    ring: 'ring-uno-yellow/40',
    soft: 'bg-uno-yellow/10',
  },
  green: {
    bg: 'bg-uno-green',
    border: 'border-uno-green',
    text: 'text-uno-green',
    ring: 'ring-uno-green/40',
    soft: 'bg-uno-green/10',
  },
  blue: {
    bg: 'bg-uno-blue',
    border: 'border-uno-blue',
    text: 'text-uno-blue',
    ring: 'ring-uno-blue/40',
    soft: 'bg-uno-blue/10',
  },
};

export type RuleOptionCardProps = {
  option: RuleOption;
  selected: boolean;
  accent: AccentColor;
  /** Exclusive categories: current pick cannot be cleared by re-clicking. */
  lockSelected?: boolean;
  /** When omitted the card is rendered as read-only (visible state, no interactivity). */
  onToggle?: () => void;
  /** Only used when option.isUserAdded === true and the card is in editable mode. */
  onEdit?: (next: string) => void;
  onDelete?: () => void;
};

export function RuleOptionCard({
  option,
  selected,
  accent,
  lockSelected = false,
  onToggle,
  onEdit,
  onDelete,
}: RuleOptionCardProps) {
  const accentClasses = ACCENT[accent];
  const interactive = typeof onToggle === 'function';
  const userAdded = option.isUserAdded === true;
  const canEdit = interactive && userAdded && typeof onEdit === 'function';
  const canDelete = interactive && userAdded && typeof onDelete === 'function';

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(option.text);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed.length === 0) {
      setDraft(option.text);
    } else if (trimmed !== option.text && onEdit) {
      onEdit(trimmed);
    }
    setEditing(false);
  };

  // Card background / border / text colour
  const baseClass = [
    'group relative w-full rounded-2xl border-2 px-4 py-3 sm:px-5 sm:py-4 text-left transition-all duration-150',
    'min-h-[56px] flex items-start gap-3',
    selected
      ? `${accentClasses.bg} ${accentClasses.border} text-paper shadow-[4px_4px_0_rgba(0,0,0,0.18)] -rotate-[1deg]`
      : `bg-paper/80 ${accentClasses.border} text-ink-soft`,
    interactive
      ? selected && lockSelected
        ? 'cursor-default'
        : selected
          ? 'cursor-pointer hover:shadow-[6px_6px_0_rgba(0,0,0,0.22)]'
          : 'cursor-pointer hover:bg-paper hover:-rotate-[1.5deg] hover:shadow-[3px_3px_0_rgba(0,0,0,0.12)]'
      : 'cursor-default',
  ].join(' ');

  const checkboxLocked = lockSelected && selected;

  return (
    <div className={baseClass}>
      {/* Checkbox glyph */}
      <button
        type="button"
        onClick={interactive && !editing && !checkboxLocked ? onToggle : undefined}
        disabled={!interactive || editing}
        aria-pressed={selected}
        aria-disabled={checkboxLocked ? true : undefined}
        aria-label={
          checkboxLocked
            ? 'Selected rule'
            : selected
              ? 'Untick'
              : 'Tick'
        }
        className={[
          'no-print shrink-0 mt-[2px] grid place-items-center w-7 h-7 rounded-md border-2 transition-colors',
          selected
            ? 'bg-paper text-ink border-paper'
            : `text-ink-muted bg-paper/40 ${accentClasses.border}`,
          interactive && !editing && !checkboxLocked
            ? 'cursor-pointer'
            : 'cursor-default',
        ].join(' ')}
      >
        {selected ? (
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
            <path
              d="M4 12 L10 18 L20 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </button>

      {/* Text body — clickable region equals checkbox */}
      <div
        className="flex-1 min-w-0"
        onClick={
          interactive && !editing && !checkboxLocked ? onToggle : undefined
        }
      >
        {editing ? (
          <textarea
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                commitEdit();
              } else if (e.key === 'Escape') {
                setDraft(option.text);
                setEditing(false);
              }
            }}
            rows={Math.max(2, Math.ceil(draft.length / 60))}
            className="w-full resize-none rounded-md bg-paper text-ink px-2 py-1 outline-none ring-2 ring-ink/40 focus:ring-ink"
          />
        ) : (
          <p
            className={[
              'font-body text-base sm:text-lg leading-snug whitespace-pre-wrap',
              selected ? 'text-paper' : 'text-ink',
            ].join(' ')}
          >
            {option.text}
            {userAdded && !selected && (
              <span className="ml-2 align-middle stamp text-ink-muted border-ink-muted">
                yours
              </span>
            )}
            {userAdded && selected && (
              <span className="ml-2 align-middle stamp text-paper border-paper/80">
                yours
              </span>
            )}
          </p>
        )}
      </div>

      {/* Edit / delete affordances (user-added + interactive only) */}
      {(canEdit || canDelete) && !editing && (
        <div className="shrink-0 flex flex-col sm:flex-row gap-1 ml-1">
          {canEdit && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setDraft(option.text);
                setEditing(true);
              }}
              aria-label="Edit"
              className={[
                'w-9 h-9 grid place-items-center rounded-md border-2 transition',
                selected
                  ? 'border-paper/60 text-paper hover:bg-paper/20'
                  : 'border-ink-muted/40 text-ink-muted hover:bg-ink/5 hover:text-ink',
              ].join(' ')}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
                <path
                  d="M4 20 L4 16 L16 4 L20 8 L8 20 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setConfirmDelete(true);
              }}
              aria-label="Delete"
              className={[
                'w-9 h-9 grid place-items-center rounded-md border-2 transition',
                selected
                  ? 'border-paper/60 text-paper hover:bg-paper/20'
                  : 'border-ink-muted/40 text-ink-muted hover:bg-uno-red/10 hover:text-uno-red hover:border-uno-red/60',
              ].join(' ')}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
                <path
                  d="M5 7 H19 M9 7 V5 a1 1 0 0 1 1 -1 h4 a1 1 0 0 1 1 1 V7 M7 7 L8 20 a2 2 0 0 0 2 2 h4 a2 2 0 0 0 2 -2 L17 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      {canDelete && (
        <DeleteRuleDialog
          open={confirmDelete}
          previewText={option.text}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            onDelete?.();
            setConfirmDelete(false);
          }}
        />
      )}
    </div>
  );
}
