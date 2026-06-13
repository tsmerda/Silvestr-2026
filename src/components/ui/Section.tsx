import type { ReactNode } from 'react'

type Props = {
  id: string
  eyebrow?: string
  title: string
  subtitle?: string
  children: ReactNode
}

/** Jednotný obal sekce: id pro kotvy, eyebrow, velký nadpis a obsah. */
export function Section({ id, eyebrow, title, subtitle, children }: Props) {
  return (
    <section id={id} className="px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-2xl md:mb-14">
          {eyebrow && (
            <span className="mb-3 inline-block rounded-full border border-water/30 bg-water/10 px-3 py-1 text-xs font-semibold tracking-wide text-water uppercase">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {subtitle && <p className="mt-4 text-lg text-slate-300">{subtitle}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}
