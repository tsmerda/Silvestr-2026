import { routes } from '../data'
import { Section } from './ui/Section'

export function Routes() {
  return (
    <Section
      id="trasy"
      eyebrow="Pro kola i pro nohy"
      title="Trasy podle nálady"
      subtitle="Tři varianty. Vyber si ráno podle toho, jak se cítíš a co máš pod zadkem."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {routes.map((r) => (
          <article
            key={r.title}
            className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-nature/40 hover:shadow-xl hover:shadow-nature/5"
          >
            <div className="text-4xl">{r.emoji}</div>
            <h3 className="mt-3 text-xl font-black">{r.title}</h3>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-water/15 px-3 py-1 text-sm font-semibold text-water">
                {r.distance}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-slate-200">
                {r.difficulty}
              </span>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="font-semibold text-nature">Pro koho</dt>
                <dd className="text-slate-300">{r.forWho}</dd>
              </div>
              <div>
                <dt className="font-semibold text-sun">Co si vzít</dt>
                <dd className="text-slate-300">{r.bring}</dd>
              </div>
            </dl>

            <button
              type="button"
              disabled
              title="GPX trasy doplníme před odjezdem"
              className="mt-5 cursor-not-allowed rounded-full border border-dashed border-white/20 px-4 py-2 text-sm font-semibold text-slate-400"
            >
              📍 GPX doplníme
            </button>
          </article>
        ))}
      </div>
    </Section>
  )
}
