// ---------------------------------------------------------------------------
// Veškerý obsah stránky je tady. Chceš upravit lokality / program / trasy /
// rozpočet / hlasování? Stačí měnit pole níže, UI se přizpůsobí samo.
// ---------------------------------------------------------------------------

/** Obrázky – veřejné hotlinkovatelné fotky z Unsplash. Když nějaká nenačte,
 *  komponenta SmartImage ji elegantně nahradí barevným gradientem.
 *  Chceš jinou fotku? Stačí vyměnit ID v `img('<ID>')`. */
const img = (id: string, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const images = {
  hero: img('1506905925346-21bda4d32df4', 1920),
} as const

/** Fotogalerie – vibe celého tripu (voda, kolo, pivo, gril, slunce, bar…). */
export type Shot = { src: string; label: string; emoji: string; fallback: string }

export const gallery: Shot[] = [
  { src: img('1541625602330-2277a4c46182', 800), label: 'Ranní švih', emoji: '🚴', fallback: 'bg-gradient-to-br from-emerald-900 to-slate-900' },
  { src: img('1530549387789-4c1017266635', 800), label: 'Koupačka', emoji: '🏊', fallback: 'bg-gradient-to-br from-teal-800 to-slate-900' },
  { src: img('1517176118179-65244903d13c', 800), label: 'Paddleboard', emoji: '🏄', fallback: 'bg-gradient-to-br from-cyan-800 to-slate-900' },
  { src: img('1472213984618-c79aaec7fef0', 800), label: 'Slunce u vody', emoji: '☀️', fallback: 'bg-gradient-to-br from-amber-700 to-slate-900' },
  { src: img('1436076863939-06870fe779c2', 800), label: 'Pivo po švihu', emoji: '🍺', fallback: 'bg-gradient-to-br from-amber-800 to-slate-900' },
  { src: img('1514933651103-005eec06c04b', 800), label: 'Večer v baru', emoji: '🍹', fallback: 'bg-gradient-to-br from-fuchsia-900 to-slate-900' },
  { src: img('1555939594-58d7cb561ad1', 800), label: 'Gril', emoji: '🔥', fallback: 'bg-gradient-to-br from-orange-900 to-slate-900' },
  { src: img('1527786356703-4b100091cd2c', 800), label: 'Roadtrip z Brna', emoji: '🚗', fallback: 'bg-gradient-to-br from-slate-700 to-slate-900' },
]

// ---- Sticky navigace ------------------------------------------------------
export const navItems = [
  { id: 'proc', label: 'Proč' },
  { id: 'lokality', label: 'Lokality' },
  { id: 'program', label: 'Program' },
  { id: 'trasy', label: 'Trasy' },
  { id: 'rozpocet', label: 'Rozpočet' },
  { id: 'hlasovani', label: 'Hlasování' },
] as const

// ---- Sekce „Proč právě Korutany" -----------------------------------------
export type Reason = { emoji: string; title: string; text: string }

export const reasons: Reason[] = [
  {
    emoji: '🌊',
    title: 'Teplá jezera',
    text: 'Klopeiner See se v létě umí ohřát až kolem 28 °C. Voda jak vana.',
  },
  {
    emoji: '🚴',
    title: 'Kolo pro všechny',
    text: 'Silnička, horák, cyklostezky i pohodové okruhy. Nikdo netrpí.',
  },
  {
    emoji: '🚗',
    title: 'Rozumná cesta z Brna',
    text: 'Cca 5–6 hodin autem podle lokality. Ráno vyjedeme, k obědu jsme tam.',
  },
  {
    emoji: '🔥',
    title: 'Večerní chill',
    text: 'Apartmán, gril, pivo, jezero a kousek města na dohled.',
  },
]

// ---- Sekce „Kam přesně" ---------------------------------------------------
export type Location = {
  id: string
  name: string
  vibe: string
  forWho: string
  image: string
  scores: { koupani: number; kolo: number; vecer: number; cena: number }
}

export const locations: Location[] = [
  {
    id: 'klopein',
    name: 'Klopeiner See',
    vibe: 'Nejteplejší voda v okolí, klid a koupací pohoda.',
    forWho: 'Pro ty, co chtějí hlavně vodu, slunce a vypnout.',
    image: img('1483728642387-6c3bdd6c93e5', 800),
    scores: { koupani: 5, kolo: 3, vecer: 3, cena: 4 },
  },
  {
    id: 'worther',
    name: 'Wörthersee / Velden',
    vibe: 'Víc života, bary, promenáda, večerní program.',
    forWho: 'Pro ty, co chtějí kromě vody i nějaký ten večer venku.',
    image: img('1467269204594-9661b134dd2b', 800),
    scores: { koupani: 4, kolo: 4, vecer: 5, cena: 2 },
  },
  {
    id: 'faaker',
    name: 'Faaker See',
    vibe: 'Krásná tyrkysová voda, víc přírodní vibe.',
    forWho: 'Pro milovníky parádních fotek a klidnějšího kempu.',
    image: img('1454496522488-7a8e488e8606', 800),
    scores: { koupani: 5, kolo: 4, vecer: 3, cena: 3 },
  },
  {
    id: 'ossiacher',
    name: 'Ossiacher See',
    vibe: 'Rozumný kompromis mezi kolem, vodou a dostupností.',
    forWho: 'Pro partu, co chce od všeho trochu a neřešit.',
    image: img('1470770841072-f978cf4d019e', 800),
    scores: { koupani: 4, kolo: 5, vecer: 3, cena: 4 },
  },
]

/** Popisky skóre – pořadí drží UI (progress bary). */
export const scoreLabels: { key: keyof Location['scores']; label: string; emoji: string }[] = [
  { key: 'koupani', label: 'Koupání', emoji: '🏊' },
  { key: 'kolo', label: 'Kolo', emoji: '🚴' },
  { key: 'vecer', label: 'Večer', emoji: '🍺' },
  { key: 'cena', label: 'Cena', emoji: '💶' },
]

// ---- Sekce „Program" ------------------------------------------------------
export type Day = { day: string; title: string; emoji: string; points: string[] }

export const program: Day[] = [
  {
    day: 'Den 1',
    title: 'Roadtrip & první koupání',
    emoji: '🚗',
    points: [
      'Odjezd z Brna, kafe na cestě',
      'Příjezd na apartmán, vybalení',
      'Nákup, koupání a první pivo u jezera',
    ],
  },
  {
    day: 'Den 2',
    title: 'Kolo + jezero',
    emoji: '🚴',
    points: [
      'Dopoledne silnička / MTB / chill trasa podle nálady',
      'Odpoledne koupačka, paddleboard nebo beach bar',
      'Večer gril na apartmáně',
    ],
  },
  {
    day: 'Den 3',
    title: 'Výlet / druhé jezero / delší švih',
    emoji: '🏔️',
    points: [
      'Pro cyklisty delší okruh do kopců',
      'Pro necyklisty koupání nebo výlet',
      'Večer Klagenfurt / Velden / hospoda',
    ],
  },
  {
    day: 'Den 4',
    title: 'Ranní káva, krátké kolo, návrat',
    emoji: '☕',
    points: ['Lehký program, poslední koupel', 'Oběd na cestu', 'Návrat do Brna'],
  },
]

// ---- Sekce „Trasy" --------------------------------------------------------
export type Route = {
  emoji: string
  title: string
  distance: string
  difficulty: string
  forWho: string
  bring: string
  image: string
}

export const routes: Route[] = [
  {
    emoji: '🌿',
    title: 'Chill route',
    distance: '25–40 km',
    difficulty: 'Lehká',
    forWho: 'Kolem jezera, vhodné pro úplně všechny.',
    bring: 'Cokoliv s koly, plavky a dobrou náladu.',
    image: img('1559521783-1d1599583485', 700),
  },
  {
    emoji: '🚴',
    title: 'Road route',
    distance: '60–90 km',
    difficulty: 'Střední – těžší',
    forWho: 'Zvlněné silnice, dobré pro silničku.',
    bring: 'Bidony, gel, tretry a chuť šlapat.',
    image: img('1571068316344-75bc76f77890', 700),
  },
  {
    emoji: '⛰️',
    title: 'MTB / gravel route',
    distance: '30–50 km',
    difficulty: 'Střední',
    forWho: 'Pro horáka nebo gravel, trochu terénu.',
    bring: 'Hustilku, duši, nářadí a helmu.',
    image: img('1576858574144-9ae1ebcf5ae5', 700),
  },
]

// ---- Sekce „Co si vzít" ---------------------------------------------------
export type PackList = { emoji: string; title: string; items: string[] }

export const packing: PackList[] = [
  {
    emoji: '🚴',
    title: 'Kolo',
    items: [
      'Helma',
      'Tretry / boty',
      'Nářadí',
      'Náhradní duše',
      'Světla',
      'Bidony',
      'Garmin / navigace v mobilu',
    ],
  },
  {
    emoji: '🌊',
    title: 'Voda & chill',
    items: ['Plavky', 'Ručník', 'Opalovák', 'Žabky', 'Reprák', 'Sluneční brýle'],
  },
  {
    emoji: '🍺',
    title: 'Večer',
    items: ['Mikina', 'Něco na gril', 'Karty / poker', 'Hotovost', 'Dobrá nálada'],
  },
]

// ---- Sekce „Rozpočet" -----------------------------------------------------
export type BudgetItem = { emoji: string; label: string; value: string }

export const budget: BudgetItem[] = [
  { emoji: '🏠', label: 'Ubytko (3 noci)', value: '110–220 €' },
  { emoji: '⛽', label: 'Cesta autem', value: '1 500–3 500 Kč' },
  { emoji: '🍽️', label: 'Jídlo a pivo', value: '40–70 € / den' },
  { emoji: '🧮', label: 'Celkem orientačně', value: '8–15 tis. Kč' },
]

// ---- Sekce „Hlasování" ----------------------------------------------------
export const vote = {
  locality: {
    title: 'Lokalita',
    emoji: '📍',
    options: [
      'Klopeiner See',
      'Wörthersee',
      'Faaker See',
      'Je mi to jedno, hlavně voda a pivo',
    ],
  },
  term: {
    title: 'Termín',
    emoji: '📅',
    options: ['Konec června', 'První víkend v červenci', 'Polovina července', 'Podle ubytka'],
  },
  style: {
    title: 'Styl tripu',
    emoji: '🎚️',
    options: ['Víc kolo', 'Půl na půl', 'Víc chill', 'Hlavně ať je sranda'],
  },
} as const
