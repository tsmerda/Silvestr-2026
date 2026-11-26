import { useState } from 'react'
import type { Place, TripEvent } from '../data/places'
import { eventsFor } from '../data/places'
import { appleMapsUrl, distanceInfo, duration, formatDate, googleMapsUrl, hostOf, km, routes, verifiedLabel } from '../lib/util'
import { Gallery, Img, Lightbox } from './Gallery'

const CAT_LABEL: Record<string, string> = { base: 'Základna', apres: 'Après-ski', party: 'Párty', ski: 'Lyžování' }
const CAT_CLS: Record<string, string> = {
  base: 'bg-slate-900 text-white',
  apres: 'bg-orange-100 text-orange-800',
  party: 'bg-fuchsia-100 text-fuchsia-800',
  ski: 'bg-sky-100 text-sky-800',
}

export function CatChips({ place }: { place: Place }) {
  return (
    <div className="flex flex-wrap gap-1">
      {place.category.map((c) => (
        <span key={c} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${CAT_CLS[c]}`}>
          {CAT_LABEL[c]}
        </span>
      ))}
    </div>
  )
}

export function DistanceBadge({ place, big }: { place: Place; big?: boolean }) {
  const d = distanceInfo(place)
  if (!d) return <span className={`font-semibold text-slate-900 ${big ? 'text-sm' : 'text-xs'}`}>📍 Tady bydlíme</span>
  const icon = d.mode === 'foot' ? '🚶' : d.mode === 'car' ? '🚗' : '📏'
  return (
    <span className={`font-semibold text-slate-900 ${big ? 'text-sm' : 'text-xs'}`}>
      {icon} {d.label}
    </span>
  )
}

/** Kompaktní karta – ukazuje se v zavřeném panelu a v seznamu. */
export function PlaceCompact({ place, onClick, active }: { place: Place; onClick?: () => void; active?: boolean }) {
  const body = (
    <>
      <div className="relative h-[84px] w-[112px] shrink-0 overflow-hidden rounded-xl">
        <Img photo={place.photos[0]} w={300} eager className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <h3 className="truncate text-[17px] font-bold leading-tight text-slate-900">{place.name}</h3>
        <p className="mt-0.5 truncate text-[13px] text-slate-600">{place.short}</p>
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
      className={`flex w-full items-center gap-3 rounded-2xl p-2 transition ${active ? 'bg-sky-50 ring-2 ring-sky-500' : 'hover:bg-slate-50'}`}
    >
      {body}
    </button>
  )
}

function StatusBadge({ status }: { status: TripEvent['status'] }) {
  if (status === 'confirmed')
    return <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">✓ Potvrzený program</span>
  if (status === 'tip') return <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-amber-950">Tip</span>
  return <span className="rounded-full bg-slate-300 px-2 py-0.5 text-[11px] font-bold text-slate-800">Zatím nepotvrzeno</span>
}

export function EventCard({ ev }: { ev: TripEvent }) {
  const [poster, setPoster] = useState(false)
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm" data-event={ev.id}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <StatusBadge status={ev.status} />
          <h4 className="mt-1.5 text-base font-bold leading-snug text-slate-900">{ev.title}</h4>
          <p className="text-[13px] font-semibold text-slate-700">
            {formatDate(ev.date)}
            {ev.start ? ` · od ${ev.start}` : ''}
          </p>
        </div>
        {ev.poster && (
          <button type="button" onClick={() => setPoster(true)} className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-slate-200" aria-label="Zobrazit plakát">
            <Img photo={ev.poster} w={240} className="absolute inset-0 h-full w-full object-cover" />
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-700">{ev.summary}</p>

      {ev.options && (
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          {ev.options.map((o) => (
            <div key={o.label} className="rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-bold text-slate-900">{o.label}</span>
                <span className="text-sm font-extrabold text-slate-900">{o.price}</span>
              </div>
              <p className="text-xs font-semibold text-slate-600">začátek {o.start}</p>
              {o.includes && <p className="mt-1 text-xs text-slate-600">{o.includes}</p>}
            </div>
          ))}
        </div>
      )}

      {ev.priceWaves && (
        <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center">
          {ev.priceWaves.map((w) => (
            <div key={w.label} className="rounded-xl bg-slate-50 px-1 py-2 ring-1 ring-slate-200">
              <div className="text-base font-extrabold text-slate-900">{w.price}</div>
              <div className="text-[11px] font-medium text-slate-600">{w.label}</div>
            </div>
          ))}
        </div>
      )}

      {(ev.tickets || ev.reservation) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {ev.tickets && (
            <a href={ev.tickets.url} target="_blank" rel="noreferrer" className="btn-primary">
              🎟️ {ev.tickets.label}
            </a>
          )}
          {ev.reservation && (
            <a href={`tel:${ev.reservation.tel}`} className="btn-primary">
              📞 {ev.reservation.label} {ev.reservation.tel.replace('+421', '0').replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
            </a>
          )}
        </div>
      )}
      {ev.note && <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-900">{ev.note}</p>}
      <p className="mt-2 text-[11px] text-slate-500">
        Zdroj:{' '}
        <a href={ev.source} target="_blank" rel="noreferrer" className="underline underline-offset-2">
          {hostOf(ev.source)}
        </a>{' '}
        · {verifiedLabel(ev.verified)}
      </p>
      {poster && ev.poster && <Lightbox photos={[ev.poster]} start={0} onClose={() => setPoster(false)} />}
    </article>
  )
}

export function NavButtons({ place }: { place: Place }) {
  if (place.category[0] === 'base') {
    return (
      <div className="grid grid-cols-2 gap-2">
        <a className="btn-nav" href={`https://maps.apple.com/?daddr=${place.pos[0]},${place.pos[1]}`} target="_blank" rel="noreferrer">
           Apple Maps
        </a>
        <a className="btn-nav" href={`https://www.google.com/maps/dir/?api=1&destination=${place.pos[0]},${place.pos[1]}`} target="_blank" rel="noreferrer">
          Google Maps
        </a>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      <a className="btn-nav" href={appleMapsUrl(place.navTo, place.navMode)} target="_blank" rel="noreferrer" data-nav="apple">
         Apple Maps z chaty
      </a>
      <a className="btn-nav" href={googleMapsUrl(place.navTo, place.navMode)} target="_blank" rel="noreferrer" data-nav="google">
        Google Maps z chaty
      </a>
    </div>
  )
}

export function AccessInfo({ place }: { place: Place }) {
  const r = place.access.routeId ? routes[place.access.routeId] : undefined
  return (
    <section className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-200">
      <h4 className="text-sm font-bold text-slate-900">{place.category[0] === 'base' ? 'Doprava' : 'Jak se tam dostaneme z chaty'}</h4>
      {r && (
        <div className="mt-2 flex items-center gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-xl text-lg ${r.mode === 'foot' ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
            {r.mode === 'foot' ? '🚶' : '🚗'}
          </div>
          <div>
            <div className="text-lg font-extrabold leading-none text-slate-900">
              {duration(r.min)} <span className="text-sm font-semibold text-slate-600">· {km(r.km)}</span>
            </div>
            <div className="text-xs text-slate-600">
              {r.mode === 'foot' ? 'pěšky' : 'autem'} po skutečné trase
              {r.via.length > 0 && r.mode === 'car' ? ` · silnice ${r.via.filter((v) => /^[A-Z]?\d+[a-z]?$/.test(v)).join(' → ')}` : ''}
            </div>
          </div>
        </div>
      )}
      {place.access.liftText && (
        <div className="mt-2 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600 text-lg text-white">🚡</div>
          <div className="text-sm font-semibold text-slate-800">{place.access.liftText}</div>
        </div>
      )}
      <p className="mt-2 text-sm text-slate-700">{place.access.text}</p>
    </section>
  )
}

export function PlaceDetail({ place }: { place: Place }) {
  const evs = eventsFor(place.id)
  return (
    <div className="space-y-4" data-detail={place.id}>
      <Gallery photos={place.photos} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CatChips place={place} />
        <DistanceBadge place={place} big />
      </div>
      <p className="text-[15px] leading-relaxed text-slate-700">{place.description}</p>
      <NavButtons place={place} />
      <a
        className="btn-ghost w-full justify-center"
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.googleQuery ?? `${place.pos[0]},${place.pos[1]}`)}`}
        target="_blank"
        rel="noreferrer"
        data-save="google"
      >
        ⭐ Uložit v Google Mapách (do seznamu Silvestr 2026)
      </a>
      <div className="flex flex-wrap gap-2">
        {place.instagram && (
          <a className="btn-ghost" href={place.instagram.url} target="_blank" rel="noreferrer">
            📸 Atmosféra na Instagramu <span className="text-slate-500">{place.instagram.handle}</span>
          </a>
        )}
        {place.website && (
          <a className="btn-ghost" href={place.website} target="_blank" rel="noreferrer">
            🌐 {hostOf(place.website)}
          </a>
        )}
      </div>
      <AccessInfo place={place} />
      {evs.length > 0 && (
        <section className="space-y-2.5">
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Program a akce</h4>
          {evs.map((e) => (
            <EventCard key={e.id} ev={e} />
          ))}
        </section>
      )}
    </div>
  )
}
