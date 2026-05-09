import { useRef } from 'react';
import { Checklist } from '../components/Checklist';
import { ExportBar } from '../components/ExportBar';
import { useSessionState } from '../hooks/useSessionState';
import library from '../data/ruleLibrary.json';
import presets from '../data/presets.json';
import type {
  CustomState,
  PresetsFile,
  RuleLibrary,
  RuleOption,
} from '../types/rules';

const STORAGE_KEY = 'uno:custom';
const lib = library as RuleLibrary;
const allPresets = presets as PresetsFile;

const initialCustom: CustomState = {
  title: '',
  selectedIds: allPresets.official.selectedIds,
  customOptions: {},
};

function makeUserOptionId(categoryId: string) {
  // Stable enough: monotonic ms + a small random suffix
  return `${categoryId}.user_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

export function CustomPage() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useSessionState<CustomState>(STORAGE_KEY, initialCustom);

  const handleChange = (next: string[]) => {
    setState(prev => ({ ...prev, selectedIds: next }));
  };

  const handleAdd = (categoryId: string, text: string) => {
    setState(prev => {
      const existing = prev.customOptions[categoryId] ?? [];
      const newOption: RuleOption = {
        id: makeUserOptionId(categoryId),
        text,
        isUserAdded: true,
      };
      return {
        ...prev,
        customOptions: {
          ...prev.customOptions,
          [categoryId]: [...existing, newOption],
        },
      };
    });
  };

  const handleEdit = (categoryId: string, optionId: string, text: string) => {
    setState(prev => {
      const existing = prev.customOptions[categoryId] ?? [];
      return {
        ...prev,
        customOptions: {
          ...prev.customOptions,
          [categoryId]: existing.map(o =>
            o.id === optionId ? { ...o, text } : o,
          ),
        },
      };
    });
  };

  const handleDelete = (categoryId: string, optionId: string) => {
    setState(prev => {
      const existing = prev.customOptions[categoryId] ?? [];
      return {
        ...prev,
        selectedIds: prev.selectedIds.filter(id => id !== optionId),
        customOptions: {
          ...prev.customOptions,
          [categoryId]: existing.filter(o => o.id !== optionId),
        },
      };
    });
  };

  const handleReset = (which: 'official' | 'nejas') => {
    const target = allPresets[which];
    setState(prev => ({
      ...prev,
      selectedIds: target.selectedIds,
    }));
  };

  return (
    <>
      <div ref={sheetRef} className="rule-sheet print-keep-colour">
        <header className="mb-8 sm:mb-10">
          <h1 className="zine-title text-[clamp(2rem,8vw,3.5rem)] text-uno-green">
            <input
              type="text"
              value={state.title}
              onChange={e =>
                setState(prev => ({ ...prev, title: e.target.value }))
              }
              placeholder="Custom Rules"
              aria-label="Sheet title"
              className="block w-full min-w-0 bg-transparent font-inherit text-inherit tracking-inherit leading-[0.95] m-0 border-0 p-0 shadow-none outline-none appearance-none rounded-none caret-uno-green placeholder:text-uno-green/40 focus-visible:bg-paper/60 focus-visible:rounded-md [field-sizing:content]"
            />
          </h1>
          <p className="mt-2 font-marker text-ink-soft tracking-wide">
            Make your own rules, pick a good name. Auto-saves for the session.
          </p>

          {/* Reset controls — hidden from print/export */}
          <div className="no-print mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleReset('official')}
              className="min-h-[40px] px-3 py-2 rounded-md border-2 border-uno-red text-uno-red bg-paper/70 font-marker tracking-wide hover:bg-uno-red hover:text-paper transition-colors"
            >
              Reset to Official
            </button>
            <button
              type="button"
              onClick={() => handleReset('nejas')}
              className="min-h-[40px] px-3 py-2 rounded-md border-2 border-uno-blue text-uno-blue bg-paper/70 font-marker tracking-wide hover:bg-uno-blue hover:text-paper transition-colors"
            >
              Reset to Neja's
            </button>
          </div>
        </header>

        <Checklist
          library={lib}
          selectedIds={state.selectedIds}
          customOptions={state.customOptions}
          onChange={handleChange}
          onAddOption={handleAdd}
          onEditOption={handleEdit}
          onDeleteOption={handleDelete}
        />
      </div>
      <ExportBar
        targetRef={sheetRef}
        filenameSlug={
          state.title.trim()
            ? state.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'custom'
            : 'custom'
        }
      />
    </>
  );
}
