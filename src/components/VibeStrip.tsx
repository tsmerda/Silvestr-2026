import { gallery } from '../data'
import { SmartImage } from './ui/SmartImage'

/** Vizuální galerie – fotky, co vystihujou celý trip. */
export function VibeStrip() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {gallery.map((s) => (
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
