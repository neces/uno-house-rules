import { useRef } from 'react';
import { SetupSheet } from '../components/SetupSheet';
import { ExportBar } from '../components/ExportBar';
import setupContent from '../data/setup.json';
import type { SetupContent } from '../types/rules';

export function SetupPage() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const content = setupContent as SetupContent;

  return (
    <>
      <div ref={sheetRef} className="rule-sheet print-keep-colour">
        <header className="mb-8 sm:mb-10">
          <h1 className="zine-title text-[clamp(2rem,8vw,3.5rem)] text-uno-red leading-none">
            {content.title}
          </h1>
          <p className="mt-2 font-marker text-ink-soft tracking-wide">
            The basics — everything that doesn't change between rule sets.
          </p>
        </header>
        <SetupSheet content={content} />
      </div>
      <ExportBar targetRef={sheetRef} filenameSlug="setup" />
    </>
  );
}
