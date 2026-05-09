import { useState } from 'react';
import type {
  RuleCategory,
  RuleLibrary,
  RuleOption,
} from '../types/rules';
import { RuleOptionCard } from './RuleOptionCard';

const ACCENT_HEADER: Record<
  RuleCategory['accentColor'],
  { dot: string; stamp: string }
> = {
  red: { dot: 'bg-uno-red', stamp: 'text-uno-red border-uno-red' },
  yellow: { dot: 'bg-uno-yellow', stamp: 'text-uno-yellow-deep border-uno-yellow-deep' },
  green: { dot: 'bg-uno-green', stamp: 'text-uno-green border-uno-green' },
  blue: { dot: 'bg-uno-blue', stamp: 'text-uno-blue border-uno-blue' },
};

/** Card border class — matches `RuleOptionCard` unselected styling per category. */
const ACCENT_CARD_BORDER: Record<RuleCategory['accentColor'], string> = {
  red: 'border-uno-red',
  yellow: 'border-uno-yellow',
  green: 'border-uno-green',
  blue: 'border-uno-blue',
};

export type ChecklistProps = {
  library: RuleLibrary;
  selectedIds: string[];
  /** Omit to render in read-only mode. */
  onChange?: (next: string[]) => void;
  /** Per-category user-added options appended to the library options. */
  customOptions?: Record<string, RuleOption[]>;
  onAddOption?: (categoryId: string, text: string) => void;
  onEditOption?: (categoryId: string, optionId: string, text: string) => void;
  onDeleteOption?: (categoryId: string, optionId: string) => void;
};

export function Checklist({
  library,
  selectedIds,
  onChange,
  customOptions,
  onAddOption,
  onEditOption,
  onDeleteOption,
}: ChecklistProps) {
  const editable = typeof onChange === 'function';
  const selectedSet = new Set(selectedIds);

  const handleToggle = (category: RuleCategory, optionId: string) => {
    if (!onChange) return;
    const isSelected = selectedSet.has(optionId);
    if (category.exclusive && isSelected) {
      return;
    }
    let next: string[];
    if (category.exclusive) {
      const allOptionIdsInCategory = new Set([
        ...category.options.map(o => o.id),
        ...(customOptions?.[category.id]?.map(o => o.id) ?? []),
      ]);
      const filtered = selectedIds.filter(id => !allOptionIdsInCategory.has(id));
      next = [...filtered, optionId];
    } else {
      // Multi-select: toggle independently
      next = isSelected
        ? selectedIds.filter(id => id !== optionId)
        : [...selectedIds, optionId];
    }
    onChange(next);
  };

  return (
    <div className="space-y-10 sm:space-y-14">
      {library.categories.map(category => {
        const userAdded = customOptions?.[category.id] ?? [];
        const allOptions: RuleOption[] = [
          ...category.options,
          ...userAdded.map(o => ({ ...o, isUserAdded: true })),
        ];
        const headerAccent = ACCENT_HEADER[category.accentColor];

        return (
          <section
            key={category.id}
            data-category={category.id}
            aria-labelledby={`cat-${category.id}`}
            className="rule-category"
          >
            <header className="mb-4 sm:mb-5 flex items-start gap-x-3 gap-y-2 flex-wrap">
              <h2
                id={`cat-${category.id}`}
                className="zine-title wobble-underline text-2xl sm:text-3xl text-ink min-w-0"
              >
                <span
                  aria-hidden
                  className={`inline-block align-middle w-3 h-3 rounded-full mr-3 ${headerAccent.dot}`}
                />
                {category.heading}
              </h2>
              <span
                className={`stamp ${headerAccent.stamp} self-center`}
                aria-label={category.exclusive ? 'Pick one' : 'Pick any'}
              >
                {category.exclusive ? 'Pick one' : 'Pick any'}
              </span>
            </header>

            <ul className="grid grid-cols-1 gap-3">
              {allOptions.map(option => (
                <li
                  key={option.id}
                  data-rule-selected={selectedSet.has(option.id) ? 'true' : 'false'}
                >
                  <RuleOptionCard
                    option={option}
                    selected={selectedSet.has(option.id)}
                    accent={category.accentColor}
                    lockSelected={
                      category.exclusive && selectedSet.has(option.id)
                    }
                    onToggle={
                      editable ? () => handleToggle(category, option.id) : undefined
                    }
                    onEdit={
                      onEditOption && option.isUserAdded
                        ? text => onEditOption(category.id, option.id, text)
                        : undefined
                    }
                    onDelete={
                      onDeleteOption && option.isUserAdded
                        ? () => onDeleteOption(category.id, option.id)
                        : undefined
                    }
                  />
                </li>
              ))}
            </ul>

            {editable && onAddOption && (
              <AddOptionRow
                accentBorder={ACCENT_CARD_BORDER[category.accentColor]}
                onAdd={text => onAddOption(category.id, text)}
                placeholder={
                  category.exclusive
                    ? 'Add your own variant...'
                    : 'Add your own house rule...'
                }
              />
            )}
          </section>
        );
      })}
    </div>
  );
}

function AddOptionRow({
  accentBorder,
  onAdd,
  placeholder,
}: {
  accentBorder: string;
  onAdd: (text: string) => void;
  placeholder: string;
}) {
  const [text, setText] = useState('');
  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };
  return (
    <div
      className={[
        'no-print mt-4 w-full rounded-2xl border-2 bg-paper/80 px-4 py-3 sm:px-5 sm:py-4',
        'min-h-[56px] flex items-start gap-3',
        accentBorder,
      ].join(' ')}
    >
      <div
        className="shrink-0 mt-[2px] w-7 h-7 rounded-md border-2 border-dashed border-ink-muted/40 bg-paper/40"
        aria-hidden
      />
      <div className="flex-1 flex flex-col gap-3 min-w-0 sm:flex-row sm:items-center sm:gap-3">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className="flex-1 min-h-[44px] w-full px-3 py-2 rounded-md border-2 border-dashed border-ink-muted/45 bg-paper/60 placeholder:text-ink-muted/70 focus:outline-none focus:border-ink/55 focus:bg-paper text-ink text-base sm:text-lg font-body"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim()}
          className="min-h-[44px] w-full sm:w-auto shrink-0 px-4 py-2 rounded-md bg-ink text-paper font-marker tracking-wide disabled:opacity-40 disabled:cursor-not-allowed transition-transform hover:-rotate-1"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
