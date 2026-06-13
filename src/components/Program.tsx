import { program } from '../data'
import { Section } from './ui/Section'

export function Program() {
  return (
    <Section
      id="program"
      eyebrow="Jak to bude vypadat"
      title="Program na 4 dny"
      subtitle="Rámcový plán, žádný buzerplán. Kdo chce jezdit, jezdí. Kdo chce chill, chilluje."
    >
      <ol className="relative space-y-4 border-l border-white/10 pl-6 md:pl-8">
        {program.map((d) => (
          <li key={d.day} className="relative">
            {/* puntík na ose */}
            <span className="absolute -left-[1.65rem] top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-water to-nature text-sm md:-left-[2.15rem]">
              {d.emoji}
            </span>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-water/40 md:p-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="rounded-full bg-sun/15 px-2.5 py-0.5 text-xs font-bold tracking-wide text-sun uppercase">
                  {d.day}
                </span>
                <h3 className="text-xl font-bold">{d.title}</h3>
              </div>
              <ul className="mt-3 space-y-1.5">
                {d.points.map((p) => (
                  <li key={p} className="flex gap-2 text-slate-300">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-water" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
