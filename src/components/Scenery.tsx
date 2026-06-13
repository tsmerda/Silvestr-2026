import { scenery } from '../data'
import { Section } from './ui/Section'
import { SmartImage } from './ui/SmartImage'

/** Minimalistické album z okolí – čisté fotky, krátké popisky. */
export function Scenery() {
  return (
    <Section
      id="galerie"
      eyebrow="Mrkni na to"
      title="Jak to tam vypadá"
      subtitle="Pár fotek z okolí, ať si to umíš představit. Jezera, hory, voda a večer ve městě."
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {scenery.map((s) => (
          <figure
            key={s.caption}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
          >
            <SmartImage
              src={s.src}
              alt={s.caption}
              fallback="bg-gradient-to-br from-teal-900 to-slate-900"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <figcaption className="absolute bottom-2.5 left-3 text-sm font-medium text-slate-100 drop-shadow">
              {s.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}
