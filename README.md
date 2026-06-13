# Korutany 2026 🌊🚴🍺

Jednoduchá landing page, která má nalákat partu kluků z Brna na prodloužený
víkend u rakouských jezer v Korutanech. Žádný backend, žádné databáze – jedna
stránka, lokální hlasování, hotovo.

Postavené na **React + Vite + TypeScript + Tailwind CSS 4**.

---

## 🚀 Jak to spustit

Potřebuješ Node 20+ (ideálně novější).

```bash
npm install
npm run dev
```

Pak otevři adresu, kterou Vite vypíše (defaultně `http://localhost:5173`).

Další příkazy:

```bash
npm run build     # produkční build do /dist
npm run preview   # náhled produkčního buildu
```

---

## ✏️ Kde se co upravuje

**Skoro celý obsah je v jednom souboru:** [`src/data.ts`](src/data.ts).
Stačí měnit pole, UI se přizpůsobí samo.

| Co chceš změnit              | Kde to je v `src/data.ts` |
| ---------------------------- | ------------------------- |
| Lokality (jezera) + skóre    | `locations`               |
| Program na 4 dny             | `program`                 |
| Trasy (chill / road / MTB)   | `routes`                  |
| Seznam „Co si vzít"          | `packing`                 |
| Rozpočet                     | `budget`                  |
| Možnosti v hlasování         | `vote`                    |
| Odkazy v horní navigaci      | `navItems`                |
| Obrázky (Unsplash URL)       | `images`                  |

Texty v hero sekci a závěrečné výzvě jsou napsané přímo v komponentách
[`src/components/Hero.tsx`](src/components/Hero.tsx) a
[`src/components/FinalCta.tsx`](src/components/FinalCta.tsx).

Barvy / téma (navy pozadí, voda, příroda, slunce) se ladí v
[`src/index.css`](src/index.css) v bloku `@theme`.

### Struktura

```
src/
  data.ts              # veškerý obsah (lokality, program, trasy, rozpočet…)
  App.tsx              # poskládání sekcí za sebe
  index.css            # Tailwind + barevné téma
  components/
    Nav, Hero, VibeStrip, Why, Locations, Program,
    Routes, Packing, Budget, Voting, FinalCta, Footer
    ui/                # malé stavební kameny (Section, ScoreBar, SmartImage)
```

---

## 🖼️ Obrázky

Používají se veřejné hotlinkovatelné fotky z Unsplash. Pokud se některá
nenačte (třeba bez internetu), komponenta `SmartImage` ji automaticky nahradí
barevným gradientem – stránka tím pádem nikdy nevypadá rozbitě.

Chceš jiné fotky? Vyměň URL v `images` v [`src/data.ts`](src/data.ts).

---

## 🗳️ Hlasování

Funguje čistě lokálně v Reactu (`useState`) – klik jen vizuálně označí výběr.
Nikam se nic neposílá, žádný backend.

---

## 🔮 Co by se dalo dodělat později

- **Sdílení hlasování přes URL** – výběr ukládat do query parametrů
  (`?lokalita=klopein&termin=...`), aby šlo poslat odkaz s předvyplněnou volbou.
- **Export do WhatsApp zprávy** – tlačítko „Pošli partě", které vygeneruje text
  shrnutí a otevře `https://wa.me/?text=...`.
- **Počítání hlasů** – lehký backend nebo Google Sheet / Supabase, ať se hlasy
  opravdu sčítají napříč partou.
- **Reálné GPX trasy** – nahradit fake tlačítko odkazem na Komoot / Strava.
- **Odpočet do odjezdu** a galerie fotek po návratu.

---

Made for boys trip • Brno → Korutany • léto 2026
