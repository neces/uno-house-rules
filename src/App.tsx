import { useState } from 'react';
import { Tabs, type TabId } from './components/Tabs';
import { SetupPage } from './pages/SetupPage';
import { OfficialPage } from './pages/OfficialPage';
import { NejasPage } from './pages/NejasPage';
import { CustomPage } from './pages/CustomPage';

export default function App() {
  // Always start on Setup for a consistent first impression (per plan).
  const [tab, setTab] = useState<TabId>('setup');

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="no-print pt-6 sm:pt-10 pb-2 sm:pb-4 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-end justify-between gap-4">
          <div>
            <h1 className="zine-title text-[clamp(2.5rem,10vw,5rem)] leading-none">
              <span className="inline-block text-uno-red -rotate-[3deg]">U</span>
              <span className="inline-block text-uno-yellow-deep">N</span>
              <span className="inline-block text-uno-green rotate-[3deg]">O</span>
            </h1>
            <p className="font-marker text-ink-soft tracking-wide mt-1">
              house rules · your way
            </p>
          </div>
          <div
            aria-hidden
            className="hidden sm:grid place-items-center w-16 h-20 rounded-lg bg-uno-black -rotate-12 shadow-[4px_4px_0_rgba(0,0,0,0.25)]"
          >
            <span className="font-zine text-paper text-xl">+4</span>
          </div>
        </div>
      </header>

      <Tabs active={tab} onChange={setTab} />

      <main className="flex-1 px-4 sm:px-6 pt-6 sm:pt-10 pb-28">
        <div className="max-w-3xl mx-auto">
          {tab === 'setup' && <SetupPage />}
          {tab === 'official' && <OfficialPage />}
          {tab === 'nejas' && <NejasPage />}
          {tab === 'custom' && <CustomPage />}
        </div>
      </main>
    </div>
  );
}
