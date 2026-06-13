export function FinalCta() {
  return (
    <section className="px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-water/15 via-slate-900 to-sun/10 p-8 text-center shadow-2xl md:p-14">
        <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
          Tak co, dáme Korutany?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-200">
          Žádná složitá expedice. Naložíme kola, vezmeme plavky, najdeme apartmán u
          jezera a na 3–4 dny vypneme.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="#hlasovani"
            className="inline-flex items-center justify-center rounded-full bg-sun px-7 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-sun/20 transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Jdu do toho 🙌
          </a>
          <a
            href="#program"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            Pošli mi termíny
          </a>
        </div>
      </div>
    </section>
  )
}
