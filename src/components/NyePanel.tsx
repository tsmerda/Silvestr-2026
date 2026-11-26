import type { NyeVariant } from '../data/places'
import { events, placeById } from '../data/places'
import { duration, km, routes } from '../lib/util'
import { EventCard } from './PlaceDetail'
import { Countdown } from './Festive'
import { IconCar, IconMountain, IconPin } from './Icons'

export function VariantToggle({ variants, value, onChange }: { variants: NyeVariant[]; value: string; onChange: (id: NyeVariant['id']) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1" role="tablist" aria-label="Varianta silvestrovského večera">
      {variants.map((v) => (
        <button
          key={v.id}
          type="button"
          role="tab"
          data-stop
          aria-selected={v.id === value}
          onClick={() => onChange(v.id)}
          className={`rounded-xl px-2 py-2 text-left transition ${v.id === value ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'text-slate-600'}`}
        >
          <span className="block text-sm font-bold leading-tight text-slate-900">{v.label}</span>
          <span className="block text-[12px] font-medium text-slate-500">{v.sub}</span>
        </button>
      ))}
    </div>
  )
}

export function NyeSummary({ variant }: { variant: NyeVariant }) {
  const r = routes[variant.routeThere]
  const main = variant.id === 'blizko' ? 'Jurassic Night · Sky Bar Brezno · 18:00 / 20:00' : 'KALI & Peter Pann · Happy End · od 21:00'
  return (
    <div className="mt-2 flex items-center justify-between gap-2 text-[13px]">
      <span className="truncate font-semibold text-slate-800">{main}</span>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 font-bold text-white">
        <IconCar size={13} /> {duration(r.min)}
      </span>
    </div>
  )
}

export function NyePanel({ variant, onFocus }: { variant: NyeVariant; onFocus: (placeId: string) => void }) {
  const there = routes[variant.routeThere]
  const back = routes[variant.routeBack]
  const mainEvent = events.find((e) => e.placeId === (variant.id === 'blizko' ? 'skybar' : 'happyend') && e.status === 'confirmed')
  return (
    <div className="space-y-4" data-nye={variant.id}>
      <Countdown />
      <section className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-blue-600 p-3 text-white">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-white/80">Tam z chaty</div>
          <div className="text-2xl font-extrabold leading-tight">{duration(there.min)}</div>
          <div className="text-xs text-white/85">{km(there.km)} autem</div>
        </div>
        <div className="rounded-2xl bg-slate-800 p-3 text-white">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-white/70">Zpět na chatu</div>
          <div className="text-2xl font-extrabold leading-tight">{duration(back.min)}</div>
          <div className="text-xs text-white/80">{km(back.km)} autem</div>
        </div>
      </section>
      {variant.id === 'klub' && (
        <p className="rounded-xl bg-violet-50 p-2.5 text-[13px] text-violet-900 ring-1 ring-violet-200">
          <IconMountain size={16} className="mr-1 inline -translate-y-px" />Klub je na severní straně Chopku. Silnice přes hřeben nevede, jede se přes průsmyk <b>Čertovica</b> a Liptov.
        </p>
      )}
      <ul className="space-y-1.5 text-sm text-slate-700">
        {variant.transport.map((t) => (
          <li key={t} className="flex gap-2">
            <span aria-hidden="true">•</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <section>
        <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Plán 31. 12.</h4>
        <ol className="relative space-y-2 border-l-2 border-slate-200 pl-4">
          {variant.steps.map((s) => (
            <li key={s.title} className="relative">
              <span
                className={`absolute -left-[23px] top-3 h-3 w-3 rounded-full ring-4 ring-white ${s.status === 'confirmed' ? 'bg-emerald-600' : 'bg-amber-400'}`}
                aria-hidden="true"
              />
              <button
                type="button"
                disabled={!s.placeId}
                onClick={() => s.placeId && onFocus(s.placeId)}
                className={`w-full rounded-xl p-2.5 text-left ring-1 ${s.status === 'confirmed' ? 'bg-emerald-50 ring-emerald-200' : 'bg-amber-50 ring-amber-200'} ${s.placeId ? 'active:scale-[0.99]' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-extrabold tabular-nums text-slate-900">{s.time}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.status === 'confirmed' ? 'bg-emerald-600 text-white' : 'bg-amber-400 text-amber-950'}`}
                  >
                    {s.status === 'confirmed' ? 'POTVRZENO' : 'TIP'}
                  </span>
                </div>
                <div className="mt-0.5 text-sm font-bold text-slate-900">{s.title}</div>
                <div className="text-[13px] text-slate-700">{s.text}</div>
                {s.placeId && <div className="mt-1 text-[12px] font-semibold text-sky-700 inline-flex items-center gap-1"><IconPin size={13} /> {placeById(s.placeId).name} – ukázat na mapě</div>}
              </button>
            </li>
          ))}
        </ol>
      </section>

      {mainEvent && (
        <section className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Večerní akce</h4>
          <EventCard ev={mainEvent} />
        </section>
      )}
      {variant.id === 'blizko' && (
        <section className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Mýto na Silvestra</h4>
          {events
            .filter((e) => e.placeId === 'myto')
            .map((e) => (
              <EventCard key={e.id} ev={e} />
            ))}
        </section>
      )}
    </div>
  )
}
