import { images } from '../data'
import { SmartImage } from './ui/SmartImage'

const shots = [
  { src: images.bike, label: 'Ranní švih', emoji: '🚴', fallback: 'bg-gradient-to-br from-emerald-900 to-slate-900' },
  { src: images.swim, label: 'Koupačka', emoji: '🌊', fallback: 'bg-gradient-to-br from-teal-800 to-slate-900' },
  { src: images.beer, label: 'Pivo po', emoji: '🍺', fallback: 'bg-gradient-to-br from-amber-800 to-slate-900' },
  { src: images.bbq, label: 'Večerní gril', emoji: '🔥', fallback: 'bg-gradient-to-br from-orange-900 to-slate-900' },
]

/** Vizuální pruh – čtyři fotky, co vystihujou celý trip. */
export function VibeStrip() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {shots.map((s) => (
          <div
            key={s.label}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 sm:aspect-[4/3]"
          >
            <SmartImage
              src={s.src}
              alt={s.label}
              fallback={s.fallback}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
            <span className="absolute bottom-3 left-3 flex items-center gap-1.5 text-sm font-bold drop-shadow">
              <span className="text-lg">{s.emoji}</span> {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
