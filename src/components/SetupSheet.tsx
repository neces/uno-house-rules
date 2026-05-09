import type { SetupContent } from '../types/rules';

const ACCENTS = ['bg-uno-red', 'bg-uno-yellow', 'bg-uno-green', 'bg-uno-blue'] as const;

export function SetupSheet({ content }: { content: SetupContent }) {
  return (
    <article className="rule-sheet space-y-10 sm:space-y-12">
      {content.sections.map((section, idx) => {
        const dot = ACCENTS[idx % ACCENTS.length];
        return (
          <section key={section.id} aria-labelledby={`setup-${section.id}`}>
            <header className="mb-3 flex items-baseline gap-3 flex-wrap">
              <span aria-hidden className={`inline-block w-3 h-3 rounded-full ${dot} -mb-1`} />
              <h2
                id={`setup-${section.id}`}
                className="zine-title wobble-underline text-2xl sm:text-3xl text-ink"
              >
                {section.heading}
              </h2>
            </header>
            <ul className="space-y-3 sm:space-y-4 text-ink font-hand text-base sm:text-lg leading-snug">
              {section.items.map((item, i) => {
                const dotColour = ACCENTS[i % ACCENTS.length];
                return (
                  <li key={i} className="flex gap-3 sm:gap-4">
                    <span
                      aria-hidden
                      className={`mt-2 shrink-0 w-2.5 h-2.5 rounded-full ${dotColour}`}
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
