import { images } from '../data'
import { SmartImage } from './ui/SmartImage'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Pozadí – velký obrázek jezera v horách + ztmavení */}
      <SmartImage
        src={images.hero}
        alt="Alpské jezero v horách"
        className="absolute inset-0 h-full w-full object-cover"
        fallback="bg-gradient-to-br from-slate-900 via-teal-900 to-slate-950"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/55 to-slate-950" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent md:block" />

      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-36">
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-200 backdrop-blur sm:text-sm">
          5 kluků <span className="text-slate-500">•</span> auta z Brna
          <span className="text-slate-500">•</span> červen / červenec
          <span className="text-slate-500">•</span> kolo = must-have
        </span>

        <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Korutany 2026:{' '}
          <span className="bg-gradient-to-r from-water via-nature to-sun bg-clip-text text-transparent">
            kola, jezera, pivo
          </span>{' '}
          a žádný stres
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-200 sm:text-xl">
          3–4 dny u rakouských jezer. Ráno švih, odpoledne koupačka, večer gril a
          pivo. Ideální boys trip z Brna.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href="#hlasovani"
            className="inline-flex items-center justify-center rounded-full bg-sun px-6 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-sun/20 transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Jsem pro Klopeiner See 🌊
          </a>
          <a
            href="#program"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-base font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            Ukaž program
          </a>
        </div>
      </div>
    </section>
  )
}
