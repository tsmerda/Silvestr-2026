# Silvestr v Mýtě 2026 ❄️🎆

Mobilní průvodce pro partu: **Chata Lenka, Mýto pod Ďumbierom, 30. 12. 2026 – 2. 1. 2027**.
Po otevření hned vidíš chatu, nejbližší après-ski (Mýto, 14 min pěšky) a fotku místa.

- **Mapa** (Leaflet + OpenStreetMap) s výrazným pinem chaty, tlačítky „Zpět na chatu“ a „Celá oblast“.
- **Vysouvací panel** jako v Apple Maps (dole název, fotka, vzdálenost → tažením nahoru galerie, popis, akce, navigace).
  Na desktopu je seznam vedle mapy a detail v plovoucí kartě.
- **Filtry** Nejblíž chatě / Après-ski / Silvestrovské párty / Lyžování – mění mapu i seznam.
- **Silvestr 31. 12.** – dvě varianty večera (Poblíž chaty → Brezno, Velká klubová párty → Happy End Jasná),
  trasa tam i zpět, potvrzený program vs. tipy, odpočet do půlnoci.
- **Galerie** se swipem a celou obrazovkou, u každé fotky popisek, autor a odkaz na zdroj.
- **Navigace z chaty** v Apple Maps i Google Maps.

Stack: React 19, TypeScript, Vite, Tailwind CSS 4, Leaflet.

## Spuštění

```bash
npm install
npm run dev       # vývoj
npm run build     # produkční build do dist/
npm run preview   # náhled buildu
```

## Kde se co upravuje

| Co                                   | Kde                                       |
| ------------------------------------ | ----------------------------------------- |
| Místa, fotky, popisy, Instagram      | `src/data/places.ts` → `places`           |
| Akce, ceny, časy, vstupenky          | `src/data/places.ts` → `events`           |
| Plán Silvestra (obě varianty)        | `src/data/places.ts` → `nyeVariants`      |
| Předpočítané trasy (auto / pěšky)    | `src/data/routes.json`                    |

Každá akce má `source` (odkaz) a `verified` (datum ověření). **Silvestr v Mýtě** je zatím
`status: 'unconfirmed'` – až Mýto Ski & Bike zveřejní program, přepiš ho na `'confirmed'`
a doplň čas, cenu a zdroj.

### Trasy

Trasy jsou spočítané po skutečných silnicích/cestách (OSRM: `router.project-osrm.org` pro auto,
`routing.openstreetmap.de` pro chůzi) a uložené v `routes.json`, takže appka funguje i bez
živého routovacího API. Jasná je na severní straně Chopku – trasa vede přes Čertovicu, ne přes hřeben.
Lanovky přes Chopok (Krupová → Priehyba) jsou na mapě čárkovaně fialově a nejsou to silnice.

Přepočet trasy (příklad):

```
https://router.project-osrm.org/route/v1/driving/19.612108,48.847014;LON,LAT?overview=full&geometries=geojson
```

### Fotky

- Fotky z Wikimedia Commons mají uvedenou licenci (CC BY-SA) a autora.
- Ostatní fotky jsou z oficiálních webů míst (kopeczabavy.sk, jasna.sk, doubleredcars.eu, tale.sk,
  inzerát chaty). V repozitáři se neukládají – načítají se z původní adresy přes zmenšovač
  `wsrv.nl` (rychlé načítání na mobilu). Když zmenšovač selže, načte se originál.
- Plakáty jsou jen u programu akcí.

## Nasazení (GitHub Pages)

Workflow `.github/workflows/deploy.yml` při pushi do `main` postaví appku a nasadí ji na
`https://tsmerda.github.io/korutany-2026/`. Jednorázově je potřeba v repozitáři:
**Settings → Pages → Source: GitHub Actions** (u soukromého repozitáře jen s placeným plánem,
jinak repo přepnout na veřejné).

## Piny do Google Map

`npm run kml` vygeneruje z `src/data/places.ts` soubor `public/silvestr-2026.kml` (místa, parkoviště,
lanovky a trasy z chaty) a `public/silvestr-2026-odkazy.txt` (odkazy na místa v Google Maps).

- **Sdílená mapa:** [Google My Maps](https://www.google.com/mymaps) → Vytvořit novou mapu → Importovat → vybrat
  `silvestr-2026.kml` → Sdílet. Mapa se otevře i v appce Google Maps (Uložené → Mapy).
- **Seznam „Silvestr 2026“ v appce Google Maps:** otevři odkazy ze `silvestr-2026-odkazy.txt` a u každého
  místa klepni na Uložit → Silvestr 2026. Seznam pak jde nasdílet.
