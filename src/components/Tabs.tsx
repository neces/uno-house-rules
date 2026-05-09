export type TabId = 'setup' | 'official' | 'nejas' | 'custom';

type TabSpec = {
  id: TabId;
  label: string;
  glyph: string; // short label inside the card oval
  bg: string;
  text: string;
  border: string;
};

const TABS: TabSpec[] = [
  {
    id: 'setup',
    label: 'Setup',
    glyph: '?',
    bg: 'bg-uno-black',
    text: 'text-paper',
    border: 'border-uno-black',
  },
  {
    id: 'official',
    label: 'Official',
    glyph: 'O',
    bg: 'bg-uno-red',
    text: 'text-paper',
    border: 'border-uno-red',
  },
  {
    id: 'nejas',
    label: "Neja's",
    glyph: 'N',
    bg: 'bg-uno-blue',
    text: 'text-paper',
    border: 'border-uno-blue',
  },
  {
    id: 'custom',
    label: 'Custom',
    glyph: '+',
    bg: 'bg-uno-green',
    text: 'text-paper',
    border: 'border-uno-green',
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
      className="no-print sticky top-0 z-20 bg-paper/90 backdrop-blur-sm border-b-2 border-ink/10"
    >
      <ul className="no-scrollbar flex gap-3 sm:gap-4 overflow-x-auto px-3 sm:px-6 pt-3 sm:pt-4 pb-8 sm:pb-9 snap-x snap-mandatory md:justify-center">
        {TABS.map(tab => {
          const isActive = tab.id === active;
          return (
            <li key={tab.id} className="snap-start shrink-0">
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'group relative grid place-items-center min-h-[56px] min-w-[80px] sm:min-w-[100px] px-3 py-2 rounded-xl border-[3px] transition-all',
                  tab.bg,
                  tab.border,
                  isActive
                    ? 'scale-[1.05] shadow-[4px_4px_0_rgba(0,0,0,0.25)] -rotate-[2deg]'
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
                    tab.text === 'text-uno-black' ? 'text-uno-black' : tab.bg.replace('bg-', 'text-'),
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
    </nav>
  );
}
