// Vygeneruje public/silvestr-2026.kml z dat v src/data/places.ts.
// KML jde naimportovat do Google My Maps (Vytvořit mapu → Importovat) a sdílet partě.
// Spuštění: npm run kml
import { readFileSync, writeFileSync } from 'node:fs'
import { events, places, type Place } from '../src/data/places.ts'

const routes = JSON.parse(readFileSync(new URL('../src/data/routes.json', import.meta.url), 'utf8')) as Record<
  string,
  { mode: string; km: number; min: number; coords: [number, number][] }
>

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const APP = 'https://tsmerda.github.io/Silvestr-2026/'

const NAMES: Record<string, string> = {
  chata: '🏠 Chata Lenka – naše základna',
  myto: '🍺 Mýto Ski & Bike – après-ski bar pod svahem',
  tale: '⛷️ Ski Tále – lyžování',
  krupova: '🍺 Chopok Juh – Après-ski bar Krupová',
  priehyba: '🍸 Priehyba – Funibar (après-ski na lyžích)',
  skybar: '🦖 Sky Bar Brezno – Jurassic Night 31. 12.',
  happyend: '🎆 Happy End Jasná – Silvestr s KALI 31. 12.',
}

const SUB_PREFIX: Record<string, string> = { lift: '🚡', parking: '🅿️', bar: '🍺', club: '🎵' }

function desc(p: Place) {
  const parts = [p.short, p.description]
  for (const e of events.filter((x) => x.placeId === p.id)) {
    const st = e.status === 'confirmed' ? '✅ POTVRZENO' : e.status === 'tip' ? '💡 TIP' : '❔ ZATÍM NEPOTVRZENO'
    let t = `${st}: ${e.title} – ${e.date.split('-').reverse().join('. ').replace(/^0/, '')}${e.start ? ' od ' + e.start : ''}.`
    if (e.options) t += ' ' + e.options.map((o) => `${o.label} od ${o.start} za ${o.price}`).join(', ') + '.'
    if (e.priceWaves) t += ' Vstupné: ' + e.priceWaves.map((w) => `${w.label} ${w.price}`).join(', ') + '.'
    if (e.tickets) t += ` Lístky: ${e.tickets.url}`
    if (e.reservation) t += ` Rezervace: ${e.reservation.tel}`
    parts.push(t)
  }
  parts.push(`Doprava z chaty: ${p.access.text}`)
  if (p.instagram) parts.push(`Instagram: ${p.instagram.url}`)
  parts.push(`Průvodce: ${APP}`)
  return parts.join('\n\n')
}

const pt = (name: string, d: string, pos: [number, number], style: string) => `
      <Placemark>
        <name>${esc(name)}</name>
        <description>${esc(d)}</description>
        <styleUrl>#${style}</styleUrl>
        <Point><coordinates>${pos[1]},${pos[0]},0</coordinates></Point>
      </Placemark>`

const line = (name: string, d: string, coords: [number, number][], style: string) => `
      <Placemark>
        <name>${esc(name)}</name>
        <description>${esc(d)}</description>
        <styleUrl>#${style}</styleUrl>
        <LineString><tessellate>1</tessellate><coordinates>${coords.map((c) => `${c[1]},${c[0]},0`).join(' ')}</coordinates></LineString>
      </Placemark>`

const folder = (name: string, body: string) => `
    <Folder>
      <name>${esc(name)}</name>${body}
    </Folder>`

const by = (ids: string[]) => ids.map((id) => places.find((p) => p.id === id)!)
const styleOf = (p: Place) => (p.category[0] === 'base' ? 'base' : p.category[0])

const placesKml = (ids: string[]) => by(ids).map((p) => pt(NAMES[p.id] ?? p.name, desc(p), p.pos, styleOf(p))).join('')

const subKml = places
  .flatMap((p) =>
    (p.points ?? []).map((s) =>
      pt(`${SUB_PREFIX[s.kind]} ${p.name.split(' – ')[0]} – ${s.label}`, `${s.label} u místa ${p.name}.`, s.pos, 'sub'),
    ),
  )
  .join('')

const r = (id: string) => routes[id]
const routeKml = [
  line(`🚶 Pěšky z chaty do Mýta (${r('myto-foot').km} km, ${r('myto-foot').min} min)`, 'Pěší trasa po cestě z chaty k après-ski baru.', r('myto-foot').coords, 'foot'),
  line(`🚗 Chata → Brezno, Sky Bar (${r('brezno-car').km} km, ${r('brezno-car').min} min)`, 'Silnice 72 do Brezna.', r('brezno-car').coords, 'car'),
  line(
    `🚗 Chata → Happy End Jasná přes Čertovicu (${r('jasna-car').km} km, ${r('jasna-car').min} min)`,
    'Klub je na severní straně Chopku – silnice přes hřeben nevede, jede se přes průsmyk Čertovica a Liptov.',
    r('jasna-car').coords,
    'car',
  ),
  line(`🚗 Chata → Krupová (${r('krupova-car').km} km, ${r('krupova-car').min} min)`, 'Parkoviště u dolní stanice lanovky Chopok Juh.', r('krupova-car').coords, 'car'),
].join('')

const style = (id: string, color: string, scale = 1.1) => `
    <Style id="${id}"><IconStyle><color>${color}</color><scale>${scale}</scale><Icon><href>https://maps.google.com/mapfiles/kml/paddle/wht-blank.png</href></Icon></IconStyle></Style>`
const lstyle = (id: string, color: string) => `
    <Style id="${id}"><LineStyle><color>${color}</color><width>5</width></LineStyle></Style>`

const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Silvestr 2026</name>
    <description>Chata Lenka, Mýto pod Ďumbierom · 30. 12. 2026 – 2. 1. 2027 · ${APP}</description>${style('base', 'ff2a1b0f', 1.4)}${style('apres', 'ff1673f9')}${style('party', 'ffaf1ca2')}${style('ski', 'ffc78402')}${style('sub', 'ffb8a394', 0.8)}${lstyle('car', 'ffeb6325')}${lstyle('foot', 'ff4aa316')}
    ${folder('Chata a après-ski', placesKml(['chata', 'myto', 'krupova', 'priehyba']))}
    ${folder('Silvestr 31. 12.', placesKml(['skybar', 'happyend']))}
    ${folder('Lyžování', placesKml(['tale']))}
    ${folder('Parkoviště a lanovky', subKml)}
    ${folder('Trasy z chaty', routeKml)}
  </Document>
</kml>
`

writeFileSync(new URL('../public/silvestr-2026.kml', import.meta.url), kml)
console.log('public/silvestr-2026.kml', kml.length, 'B')

// Odkazy pro uložení do seznamu v appce Google Maps (dotaz podle názvu, ať se uloží skutečný podnik)
const links = places.map((p) => {
  const q = p.googleQuery ?? `${p.pos[0]},${p.pos[1]}`
  return `- ${NAMES[p.id] ?? p.name}: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
})
writeFileSync(new URL('../public/silvestr-2026-odkazy.txt', import.meta.url), links.join('\n') + '\n')
console.log(links.join('\n'))
