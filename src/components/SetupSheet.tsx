import type { SetupContent } from '../types/rules';

/** Cycle through the four Uno colours so consecutive bullets never match. */
const BULLET_BG_CYCLE = [
  'bg-uno-yellow',
  'bg-uno-red',
  'bg-uno-green',
  'bg-uno-blue',
] as const;

export function SetupSheet({ content }: { content: SetupContent }) {
  /** Running index: section heading dots and every list bullet share one sequence top-to-bottom. */
  let bulletOrdinal = 0;
  const nextBulletBg = () =>
    BULLET_BG_CYCLE[bulletOrdinal++ % BULLET_BG_CYCLE.length];

  return (
    <article className="rule-sheet space-y-10 sm:space-y-12">
      {content.sections.map(section => {
        const headingDot = nextBulletBg();
        return (
          <section key={section.id} aria-labelledby={`setup-${section.id}`}>
            <header className="mb-3">
              <h2
                id={`setup-${section.id}`}
                className="zine-title wobble-underline text-2xl sm:text-3xl text-ink"
              >
                <span
                  aria-hidden
                  className={`inline-block align-middle w-3 h-3 rounded-full mr-3 ${headingDot}`}
                />
                {section.heading}
              </h2>
            </header>
            <ul className="space-y-3 sm:space-y-4 text-ink font-hand text-base sm:text-lg leading-snug">
              {section.items.map((item, i) => {
                const itemDot = nextBulletBg();
                return (
                  <li key={i} className="flex items-start gap-3 sm:gap-4">
                    <span
                      aria-hidden
                      className={`shrink-0 w-2.5 h-2.5 rounded-full ${itemDot} translate-y-[0.55em]`}
                    />
                    <span className="flex-1">{item}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </article>
  );
}
