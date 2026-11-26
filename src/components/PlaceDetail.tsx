import { useState } from 'react'
import type { Place, TripEvent } from '../data/places'
import { eventsFor } from '../data/places'
import { appleMapsUrl, distanceInfo, duration, formatDate, googleMapsUrl, hostOf, km, routes, verifiedLabel } from '../lib/util'
import { Gallery, Img, Lightbox } from './Gallery'
import { IconCar, IconCheck, IconGlobe, IconHome, IconInstagram, IconLift, IconNav, IconPhone, IconStar, IconTicket, IconWalk } from './Icons'

const CAT_LABEL: Record<string, string> = { base: 'Základna', apres: 'Après-ski', party: 'Párty', ski: 'Lyžování' }
const CAT_CLS: Record<string, string> = {
  base: 'bg-slate-900 text-amber-300',
  apres: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  party: 'bg-fuchsia-50 text-fuchsia-700 ring-1 ring-fuchsia-200',
  ski: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
}

export function CatChips({ place }: { place: Place }) {
  return (
    <div className="flex flex-wrap gap-1">
      {place.category.map((c) => (
        <span key={c} className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${CAT_CLS[c]}`}>
          {CAT_LABEL[c]}
        </span>
      ))}
    </div>
  )
}

export function DistanceBadge({ place }: { place: Place }) {
  const d = distanceInfo(place)
  if (!d)
    return (
      <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-slate-900">
        <IconHome size={15} className="text-amber-500" /> Tady bydlíme
      </span>
    )
  const Icon = d.mode === 'foot' ? IconWalk : IconCar
  return (
    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-slate-900">
      <Icon size={15} className={d.mode === 'foot' ? 'text-emerald-600' : 'text-blue-600'} />
      {d.label}
    </span>
  )
}

/** Kompaktní karta – zavřený panel a seznam. */
export function PlaceCompact({ place, onClick, active }: { place: Place; onClick?: () => void; active?: boolean }) {
  const body = (
    <>
      <div className="relative h-[78px] w-[104px] shrink-0 overflow-hidden rounded-2xl bg-slate-200 shadow-sm">
        <Img photo={place.photos[0]} w={320} eager className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <h3 className="truncate text-[17px] font-extrabold leading-tight tracking-[-0.01em] text-slate-900">{place.name}</h3>
        <p className="mt-0.5 truncate text-[13px] text-slate-500">{place.short}</p>
        <div className="mt-1.5">
          <DistanceBadge place={place} />
        </div>
      </div>
    </>
  )
  if (!onClick) return <div className="flex items-center gap-3">{body}</div>
  return (
    <button
      type="button"
      onClick={onClick}
      data-place={place.id}
      className={`flex w-full items-center gap-3 rounded-[20px] p-2 transition ${active ? 'bg-white shadow-[0_6px_20px_-8px_rgba(15,23,42,0.35)] ring-1 ring-amber-300' : 'hover:bg-white/70 active:bg-white'}`}
    >
      {body}
    </button>
  )
}

function StatusBadge({ status }: { status: TripEvent['status'] }) {
  if (status === 'confirmed')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">
        <IconCheck size={12} strokeWidth={3} /> Potvrzený program
      </span>
    )
  if (status === 'tip') return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 ring-1 ring-amber-300">Tip</span>
  return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200">Zatím nepotvrzeno</span>
}

export function EventCard({ ev }: { ev: TripEvent }) {
  const [poster, setPoster] = useState(false)
  return (
    <article className="card p-4" data-event={ev.id}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <StatusBadge status={ev.status} />
          <h4 className="mt-2 text-[17px] font-extrabold leading-snug tracking-[-0.01em] text-slate-900">{ev.title}</h4>
          <p className="mt-0.5 text-[13px] font-semibold text-slate-500">
            {formatDate(ev.date)}
            {ev.start ? ` · od ${ev.start}` : ''}
          </p>
        </div>
        {ev.poster && (
          <button
            type="button"
            onClick={() => setPoster(true)}
            className="relative h-[92px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-slate-200 shadow-md ring-1 ring-black/5"
            aria-label="Zobrazit plakát akce"
          >
            <Img photo={ev.poster} w={240} className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 text-center text-[9px] font-bold uppercase tracking-wide text-white">Plakát</span>
          </button>
        )}
      </div>
      <p className="mt-2.5 text-[14px] leading-relaxed text-slate-600">{ev.summary}</p>

      {ev.options && (
        <div className="mt-3 grid gap-2">
          {ev.options.map((o) => (
            <div key={o.label} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/80">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[15px] font-bold text-slate-900">{o.label}</span>
                <span className="text-[17px] font-extrabold tracking-tight text-slate-900">{o.price}</span>
              </div>
              <p className="text-[12px] font-semibold text-slate-500">začátek {o.start}</p>
              {o.includes && <p className="mt-1 text-[12px] leading-snug text-slate-500">{o.includes}</p>}
            </div>
          ))}
        </div>
      )}

      {ev.priceWaves && (
        <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
          {ev.priceWaves.map((w, i) => (
            <div key={w.label} className={`rounded-2xl px-1 py-2.5 ring-1 ${i === 0 ? 'bg-amber-50 ring-amber-300' : 'bg-slate-50 ring-slate-200/80'}`}>
              <div className="text-[18px] font-extrabold tracking-tight text-slate-900">{w.price}</div>
              <div className="text-[11px] font-medium text-slate-500">{w.label}</div>
            </div>
          ))}
        </div>
      )}

      {(ev.tickets || ev.reservation) && (
        <div className="mt-3 grid gap-2">
          {ev.tickets && (
            <a href={ev.tickets.url} target="_blank" rel="noreferrer" className="btn-gold">
              <IconTicket size={17} /> {ev.tickets.label}
            </a>
          )}
          {ev.reservation && (
            <a href={`tel:${ev.reservation.tel}`} className="btn-dark">
              <IconPhone size={16} /> {ev.reservation.label} {ev.reservation.tel.replace('+421', '0').replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
            </a>
          )}
        </div>
      )}
      {ev.note && <p className="mt-3 rounded-xl bg-amber-50 p-2.5 text-[12px] leading-snug text-amber-900 ring-1 ring-amber-200">{ev.note}</p>}
      <p className="mt-2.5 text-[11px] text-slate-400">
        Zdroj:{' '}
        <a href={ev.source} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-2">
          {hostOf(ev.source)}
        </a>{' '}
        · {verifiedLabel(ev.verified)}
      </p>
      {poster && ev.poster && <Lightbox photos={[ev.poster]} start={0} onClose={() => setPoster(false)} />}
    </article>
  )
}

export function NavButtons({ place }: { place: Place }) {
  const isBase = place.category[0] === 'base'
  const apple = isBase ? `https://maps.apple.com/?daddr=${place.pos[0]},${place.pos[1]}` : appleMapsUrl(place.navTo, place.navMode)
  const google = isBase
    ? `https://www.google.com/maps/dir/?api=1&destination=${place.pos[0]},${place.pos[1]}`
    : googleMapsUrl(place.navTo, place.navMode)
  return (
    <div className="grid grid-cols-2 gap-2">
      <a className="btn-dark" href={apple} target="_blank" rel="noreferrer" data-nav="apple">
        <IconNav size={16} /> Apple Maps
      </a>
      <a className="btn-light" href={google} target="_blank" rel="noreferrer" data-nav="google">
        <IconNav size={16} /> Google Maps
      </a>
    </div>
  )
}

export function AccessInfo({ place }: { place: Place }) {
  const r = place.access.routeId ? routes[place.access.routeId] : undefined
  const roads = r?.via.filter((v) => /^[A-Z]?\d+[a-z]?$/.test(v)) ?? []
  return (
    <section className="card p-4">
      <h4 className="eyebrow">{place.category[0] === 'base' ? 'Doprava' : 'Cesta z chaty'}</h4>
      {r && (
        <div className="mt-2.5 flex items-center gap-3">
          <div className={`grid h-11 w-11 place-items-center rounded-2xl text-white ${r.mode === 'foot' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
            {r.mode === 'foot' ? <IconWalk size={22} /> : <IconCar size={22} />}
          </div>
          <div>
            <div className="text-[22px] font-extrabold leading-none tracking-tight text-slate-900">
              {duration(r.min)} <span className="text-[14px] font-semibold text-slate-400">· {km(r.km)}</span>
            </div>
            <div className="mt-0.5 text-[12px] text-slate-500">
              {r.mode === 'foot' ? 'pěšky' : 'autem'} po skutečné trase
              {r.mode === 'car' && roads.length > 0 ? ` · silnice ${roads.join(' → ')}` : ''}
            </div>
          </div>
        </div>
      )}
      {place.access.liftText && (
        <div className="mt-2.5 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-600 text-white">
            <IconLift size={22} />
          </div>
          <div className="text-[14px] font-semibold text-slate-800">{place.access.liftText}</div>
        </div>
      )}
      <p className="mt-3 text-[14px] leading-relaxed text-slate-600">{place.access.text}</p>
    </section>
  )
}

export function PlaceDetail({ place }: { place: Place }) {
  const evs = eventsFor(place.id)
  const gq = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.googleQuery ?? `${place.pos[0]},${place.pos[1]}`)}`
  return (
    <div className="space-y-4 pb-4" data-detail={place.id}>
      <Gallery photos={place.photos} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CatChips place={place} />
        <DistanceBadge place={place} />
      </div>
      <p className="text-[15px] leading-relaxed text-slate-700">{place.description}</p>
      <NavButtons place={place} />
      <div className="grid gap-2">
        {place.instagram && (
          <a className="btn-insta" href={place.instagram.url} target="_blank" rel="noreferrer">
            <IconInstagram size={17} /> Atmosféra na Instagramu
            <span className="ml-auto text-[12px] font-medium opacity-80">{place.instagram.handle}</span>
          </a>
        )}
        <div className="grid grid-cols-2 gap-2">
          <a className="btn-soft" href={gq} target="_blank" rel="noreferrer" data-save="google">
            <IconStar size={16} className="text-amber-500" /> Uložit do Map
          </a>
          {place.website && (
            <a className="btn-soft" href={place.website} target="_blank" rel="noreferrer">
              <IconGlobe size={16} /> <span className="truncate">{hostOf(place.website)}</span>
            </a>
          )}
        </div>
      </div>
      <AccessInfo place={place} />
      {evs.length > 0 && (
        <section className="space-y-2.5">
          <h4 className="eyebrow px-1">Program a akce</h4>
          {evs.map((e) => (
            <EventCard key={e.id} ev={e} />
          ))}
        </section>
      )}
    </div>
  )
}
