import { useRef } from 'react';
import { Checklist } from '../components/Checklist';
import { ExportBar } from '../components/ExportBar';
import library from '../data/ruleLibrary.json';
import presets from '../data/presets.json';
import type { PresetsFile, RuleLibrary } from '../types/rules';

export function OfficialPage() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const lib = library as RuleLibrary;
  const preset = (presets as PresetsFile).official;

  return (
    <>
      <div ref={sheetRef} className="rule-sheet print-keep-colour">
        <header className="mb-8 sm:mb-10">
          <h1 className="zine-title text-[clamp(2rem,8vw,3.5rem)] text-uno-red">
            {preset.name}
          </h1>
          <p className="no-print mt-2 font-marker text-ink-soft tracking-wide">
            Official rule set, as Mattel intended.
          </p>
        </header>
        <Checklist library={lib} selectedIds={preset.selectedIds} />
      </div>
      <ExportBar targetRef={sheetRef} filenameSlug="official" />
    </>
  );
}
