import { routes } from '../data'
import { Section } from './ui/Section'
import { SmartImage } from './ui/SmartImage'

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
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-nature/40 hover:shadow-xl hover:shadow-nature/5"
          >
            <div className="relative h-40 overflow-hidden">
              <SmartImage
                src={r.image}
                alt={r.title}
                fallback="bg-gradient-to-br from-emerald-900 via-slate-800 to-slate-900"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <span className="absolute top-3 left-4 text-3xl drop-shadow">
                {r.emoji}
              </span>
              <h3 className="absolute bottom-3 left-4 text-xl font-black drop-shadow">
                {r.title}
              </h3>
            </div>

            <div className="flex flex-1 flex-col p-6 pt-5">
              <div className="flex flex-wrap gap-2">
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
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
