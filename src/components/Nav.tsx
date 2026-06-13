import { navItems } from '../data'

/** Sticky mini navigace. Na mobilu se odkazy dají posouvat do strany. */
export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-8">
        <a href="#top" className="shrink-0 text-base font-black tracking-tight">
          <span className="text-water">Korutany</span>
          <span className="text-sun">'26</span>
        </a>
        <div className="flex flex-1 items-center gap-1 overflow-x-auto text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="shrink-0 rounded-full px-3 py-1.5 font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="#hlasovani"
          className="hidden shrink-0 rounded-full bg-sun px-4 py-1.5 text-sm font-bold text-slate-950 transition hover:brightness-110 sm:inline-block"
        >
          Hlasuj
        </a>
      </nav>
    </header>
  )
}
