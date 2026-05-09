import { useRef } from 'react';
import { Checklist } from '../components/Checklist';
import { ExportBar } from '../components/ExportBar';
import library from '../data/ruleLibrary.json';
import presets from '../data/presets.json';
import type { PresetsFile, RuleLibrary } from '../types/rules';

export function NejasPage() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const lib = library as RuleLibrary;
  const preset = (presets as PresetsFile).nejas;

  return (
    <>
      <div ref={sheetRef} className="rule-sheet print-keep-colour">
        <header className="mb-8 sm:mb-10">
          <h1 className="zine-title text-[clamp(2rem,8vw,3.5rem)] text-uno-blue leading-none">
            {preset.name}
          </h1>
          <p className="mt-2 font-marker text-ink-soft tracking-wide">
            The chill, strategic house variant.
          </p>
        </header>
        <Checklist library={lib} selectedIds={preset.selectedIds} />
      </div>
      <ExportBar targetRef={sheetRef} filenameSlug="nejas" />
    </>
  );
}
