import { reasons } from '../data'
import { Section } from './ui/Section'

export function Why() {
  return (
    <Section
      id="proc"
      eyebrow="Proč právě sem"
      title="Proč Korutany"
      subtitle="Nejedeme závodit. Jedeme si dát hezké silnice, vodu, pivo a pohodu."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r) => (
          <div
            key={r.title}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-water/40 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-water/5"
          >
            <div className="text-4xl">{r.emoji}</div>
            <h3 className="mt-4 text-lg font-bold">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{r.text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
