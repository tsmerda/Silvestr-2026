import { useState } from 'react'
import { vote } from '../data'
import { Section } from './ui/Section'

type Picks = {
  locality: string | null
  term: string | null
  style: string | null
}

const groups = [vote.locality, vote.term, vote.style] as const
const keys = ['locality', 'term', 'style'] as const

export function Voting() {
  const [picks, setPicks] = useState<Picks>({
    locality: null,
    term: null,
    style: null,
  })

  const chosenCount = Object.values(picks).filter(Boolean).length

  return (
    <Section
      id="hlasovani"
      eyebrow="Rozhodneme to spolu"
      title="Hlasování"
      subtitle="Klikni, co ti sedí. Nikam se to neposílá – jen ať vidíme, kam to táhneme."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {groups.map((group, gi) => {
          const key = keys[gi]
          return (
            <div
              key={key}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <span className="text-2xl">{group.emoji}</span> {group.title}
              </h3>
              <div className="mt-4 space-y-2">
                {group.options.map((opt) => {
                  const active = picks[key] === opt
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPicks((p) => ({ ...p, [key]: opt }))}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                        active
                          ? 'border-water bg-water/15 text-white shadow-lg shadow-water/10'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:bg-white/10'
                      }`}
                    >
                      <span>{opt}</span>
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-xs ${
                          active
                            ? 'border-water bg-water text-slate-950'
                            : 'border-white/25'
                        }`}
                      >
                        {active ? '✓' : ''}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Shrnutí výběru */}
      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center">
        <div className="text-slate-300">
          {chosenCount === 0 ? (
            <span>Zatím nic nevybráno. Klikej výš 👆</span>
          ) : (
            <span className="flex flex-wrap gap-2">
              {picks.locality && <Tag>{picks.locality}</Tag>}
              {picks.term && <Tag>{picks.term}</Tag>}
              {picks.style && <Tag>{picks.style}</Tag>}
            </span>
          )}
        </div>
        {chosenCount === 3 && (
          <span className="rounded-full bg-nature/15 px-4 py-2 text-sm font-bold text-nature">
            🎉 Máme jasno! Teď to už jen domluvit.
          </span>
        )}
      </div>
    </Section>
  )
}

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-water/15 px-3 py-1 text-sm font-semibold text-water">
      {children}
    </span>
  )
}
