export type TabId = 'setup' | 'official' | 'nejas' | 'custom';

type TabSpec = {
  id: TabId;
  label: string;
  glyph: string; // short label inside the card oval
  bg: string;
  /** Omit for cards with no outline (e.g. soft yellow Setup tab). */
  border?: string;
  glyphClass: string; // glyph letter colour (must read on faux oval)
};

const TABS: TabSpec[] = [
  {
    id: 'setup',
    label: 'Setup',
    glyph: '?',
    bg: 'bg-uno-yellow',
    glyphClass: 'text-uno-black',
  },
  {
    id: 'official',
    label: 'Official',
    glyph: 'O',
    bg: 'bg-uno-red',
    border: 'border-uno-red',
    glyphClass: 'text-uno-red',
  },
  {
    id: 'nejas',
    label: "Neja's",
    glyph: 'N',
    bg: 'bg-uno-blue',
    border: 'border-uno-blue',
    glyphClass: 'text-uno-blue',
  },
  {
    id: 'custom',
    label: 'Custom',
    glyph: '+',
    bg: 'bg-uno-green',
    border: 'border-uno-green',
    glyphClass: 'text-uno-green',
  },
];

export function Tabs({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  return (
    <nav
      aria-label="Tabs"
      className="no-print bg-paper/90 backdrop-blur-sm border-b-2 border-ink/10"
    >
      <div className="max-w-3xl mx-auto overflow-visible">
        {/**
         * Scroll only on an inner div: `overflow-x: auto` on the same element as the flex row
         * forces `overflow-y` to compute to `auto` and clips scaled/rotated active tabs.
         * Vertical padding gives transforms + labels room. Horizontal inset (`ps`/`pe`) is on this
         * scrollport only — not the outer column — so the first/last tab is not clipped.
         */}
        <div
          className={[
            'no-scrollbar overflow-x-auto overflow-y-visible pt-3 sm:pt-4 pb-6 sm:pb-7 scroll-pb-2 snap-x snap-mandatory',
            'ps-3 pe-3 sm:ps-4 sm:pe-4',
          ].join(' ')}
        >
          <ul className="flex w-max min-w-full items-end justify-start gap-3 sm:gap-4 *:snap-start">
            {TABS.map(tab => {
              const isActive = tab.id === active;
              return (
                <li key={tab.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => onChange(tab.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      'group relative z-0 grid place-items-center min-h-[56px] min-w-[80px] sm:min-w-[100px] px-3 py-2 rounded-xl transition-all',
                      tab.border !== undefined
                        ? `border-[3px] ${tab.border}`
                        : 'border-0',
                      tab.bg,
                      isActive
                        ? 'z-20 scale-[1.05] shadow-[4px_4px_0_rgba(0,0,0,0.25)] -rotate-[2deg]'
                        : 'opacity-70 hover:opacity-100 hover:-rotate-[1deg] hover:shadow-[3px_3px_0_rgba(0,0,0,0.18)] scale-95',
                    ].join(' ')}
                  >
                  {/* Faux Uno card oval */}
                  <span
                    aria-hidden
                    className="absolute inset-1.5 rounded-md bg-paper/95 -rotate-[12deg]"
                  />
                  <span
                    className={[
                      'relative z-10 font-zine text-[1.25rem] sm:text-[1.4rem] leading-none',
                      tab.glyphClass,
                    ].join(' ')}
                  >
                    {tab.glyph}
                  </span>
                  <span className="absolute z-10 left-1/2 -translate-x-1/2 -bottom-5 font-marker text-xs sm:text-sm text-ink whitespace-nowrap">
                    {tab.label}
                  </span>
                </button>
              </li>
            );
          })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
