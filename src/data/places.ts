// ---------------------------------------------------------------------------
// VŠECHNA DATA PRŮVODCE NA JEDNOM MÍSTĚ
// ---------------------------------------------------------------------------
// • Místa, fotky, akce i trasy upravuješ jen tady (trasy jsou v routes.json).
// • U časově citlivých údajů (akce, ceny, časy) je vždy `source` + `verified`.
//   Když něco ověříš znovu, přepiš datum `verified`.
// • Silvestr v Mýtě: až Mýto Ski & Bike zveřejní program, přepiš událost
//   `myto-silvestr` na status 'confirmed' a doplň čas/cenu/zdroj.
// ---------------------------------------------------------------------------

export type LatLng = [number, number]

export type PhotoKind = 'venue' | 'event' | 'area' | 'poster'

export type Photo = {
  /** Původní URL fotky (oficiální web nebo Wikimedia Commons). */
  src: string
  /** Krátký konkrétní popisek – co přesně je na fotce. */
  caption: string
  /** Kdo je autor / odkud fotka je. */
  credit: string
  /** Odkaz na stránku, kde je fotka zveřejněná. */
  sourceUrl: string
  /** venue = přímo dané místo, event = z akce v tom místě, area = jen fotka areálu, poster = plakát */
  kind: PhotoKind
  /** Licence, pokud je otevřená (Wikimedia Commons). */
  license?: string
  /** Fotky z Commons se načítají napřímo, ostatní přes zmenšovač wsrv.nl. */
  direct?: boolean
}

export type Category = 'base' | 'apres' | 'party' | 'ski'

export type SubPoint = {
  label: string
  pos: LatLng
  kind: 'bar' | 'lift' | 'parking' | 'club'
}

export type Access = {
  /** Klíč do routes.json – trasa z chaty. */
  routeId?: string
  /** Krátký popis, jak se tam dostaneme. */
  text: string
  /** Pokračování lanovkou / na lyžích – vykreslí se čárkovaně a NENÍ to silnice. */
  liftLine?: LatLng[]
  liftText?: string
}

export type Place = {
  id: string
  name: string
  short: string
  category: Category[]
  pos: LatLng
  /** Kam míří navigace (parkoviště u hor, vchod u klubu). */
  navTo: LatLng
  navMode: 'walking' | 'driving'
  description: string
  photos: Photo[]
  instagram?: { handle: string; url: string }
  website?: string
  points?: SubPoint[]
  access: Access
  /** Pro řazení „Nejblíž chatě“, když chybí trasa. */
  airKm?: number
}

export type EventOption = {
  label: string
  start: string
  price: string
  includes?: string
}

export type EventStatus = 'confirmed' | 'tip' | 'unconfirmed'

export type TripEvent = {
  id: string
  placeId: string
  title: string
  /** ISO datum */
  date: string
  start?: string
  status: EventStatus
  summary: string
  options?: EventOption[]
  priceWaves?: { label: string; price: string }[]
  tickets?: { label: string; url: string }
  reservation?: { label: string; tel: string }
  poster?: Photo
  source: string
  verified: string
  note?: string
}

// ---- Výlet -----------------------------------------------------------------
export const trip = {
  title: 'Silvestr v Mýtě 2026',
  dates: '30. 12. 2026 – 2. 1. 2027',
  base: 'chata',
}

// ---- Pomocníci na URL fotek ---------------------------------------------------
const myto = (file: string) => `https://img.bigeron.com/${file}`
const jasna = (file: string) => `https://www.jasna.sk/fileadmin/resort_upload/jasna/${file}`
const drc = (file: string) => `https://doubleredcars.eu/wp-content/uploads/${file}`
const lenka = (file: string) =>
  `https://cdn.megau.eu/accommodations/12549/images/a12549-chata-lenka-myto-pod-dumbier-${file}.jpg`

const SRC = {
  lenka: 'https://cz.megaubytovanie.sk/chata-lenka-myto-pod-dumbierom',
  mytoVecer: 'https://www.kopeczabavy.sk/sk/vecerne-lyzovanie',
  mytoGaleria: 'https://www.kopeczabavy.sk/sk/fotogaleria',
  mytoStrava: 'https://www.kopeczabavy.sk/sk/stravovanie',
  mytoStredisko: 'https://www.kopeczabavy.sk/sk/stredisko-ski-bike',
  mytoParty: 'https://www.kopeczabavy.sk/sk/apre-ski-sunset-party',
  mytoCennik: 'https://www.kopeczabavy.sk/sk/cennik-otvaracie-hodiny',
  jasnaSilvestr: 'https://www.jasna.sk/cs/aktivity/udalosti/silvestr-s-kali-peter-pann',
  jasnaHappyEnd: 'https://www.jasna.sk/cs/stredisko/bary-a-restaurace/happy-end',
  jasnaKrupova: 'https://www.jasna.sk/cs/stredisko/bary-a-restaurace/apres-ski-bar-krupova',
  jasnaFunibar: 'https://www.jasna.sk/cs/stredisko/bary-a-restaurace/funibar',
  skybar: 'https://doubleredcars.eu/skybar',
  brezno: 'https://www.brezno.sk/jurasicc-night/',
  tale: 'https://www.tale.sk/ski-tale/',
}

const CHATA: LatLng = [48.847014, 19.612108]

// ---- Místa -----------------------------------------------------------------
export const places: Place[] = [
  {
    id: 'chata',
    name: 'Chata Lenka',
    short: 'Naše základna · Mýto pod Ďumbierom',
    category: ['base'],
    pos: CHATA,
    navTo: CHATA,
    navMode: 'driving',
    description:
      'Chata na slunném svahu s výhledem na sjezdovky Mýta. 4 ložnice, terasa s grilem, parkování přímo u chaty. Na sjezdovku a do après-ski baru je to asi 1 km pěšky.',
    website: SRC.lenka,
    access: {
      text: 'Parkování přímo u chaty (5 míst). Skibus „chaty → Mýto Ski & Bike“ jezdí pá–ne, v jiné dny se zeptej majitele.',
    },
    photos: [
      { src: lenka('20260702-195113-1636'), caption: 'Chata Lenka v zimě – pohled z terasy na štít chaty', credit: 'megaubytovanie.sk (inzerát chaty)', sourceUrl: SRC.lenka, kind: 'venue' },
      { src: lenka('20260109-212941-4270'), caption: 'Výhled ze zasněženého balkonu do údolí Mýta', credit: 'megaubytovanie.sk (inzerát chaty)', sourceUrl: SRC.lenka, kind: 'venue' },
      { src: lenka('20250220-071854-8584'), caption: 'Chata v noci, osvětlená z příjezdové cesty', credit: 'megaubytovanie.sk (inzerát chaty)', sourceUrl: SRC.lenka, kind: 'venue' },
      { src: lenka('20260603-192608-8389'), caption: 'Obývák s gaučem a dřevěným stropem', credit: 'megaubytovanie.sk (inzerát chaty)', sourceUrl: SRC.lenka, kind: 'venue' },
      { src: lenka('20250209-210719-1582'), caption: 'Kuchyň a jídelní stůl pro celou partu', credit: 'megaubytovanie.sk (inzerát chaty)', sourceUrl: SRC.lenka, kind: 'venue' },
    ],
  },
  {
    id: 'myto',
    name: 'Mýto Ski & Bike – après-ski bar',
    short: 'Nejbližší areál a bar pod svahem',
    category: ['apres', 'ski'],
    pos: [48.845702, 19.620964],
    navTo: [48.845702, 19.620964],
    navMode: 'walking',
    description:
      'Venkovní après-ski bar a samoobslužná restaurace přímo pod svahem, hned vedle nástupu na čtyřsedačku. Dvě sjezdovky po 1 420 m, večer obě osvětlené. V sezóně tu pořádají Après Ski Sunset Party s DJem během večerního lyžování.',
    website: 'https://www.kopeczabavy.sk/sk',
    instagram: { handle: '@mytoskibike', url: 'https://www.instagram.com/mytoskibike/' },
    points: [
      { label: 'Lanovka', pos: [48.845413, 19.620664], kind: 'lift' },
      { label: 'Parkoviště', pos: [48.846307, 19.621532], kind: 'parking' },
    ],
    access: {
      routeId: 'myto-foot',
      text: 'Pěšky z chaty po silnici dolů a podél hlavní cesty 72. Autem 2 min, velké parkoviště zdarma u areálu.',
    },
    photos: [
      { src: myto('restauracia_Myto_ski_and_bike_1_2_1.jpg'), caption: 'Venkovní bar s altánem a chata restaurace pod svahem', credit: 'Mýto Ski & Bike (oficiální web)', sourceUrl: SRC.mytoGaleria, kind: 'venue' },
      { src: myto('ludova_hudba_Myto_ski_and_bike_1.jpg'), caption: 'Lidová muzika a lidé pod svahem před restaurací při akci', credit: 'Mýto Ski & Bike (oficiální web)', sourceUrl: SRC.mytoStredisko, kind: 'event' },
      { src: myto('Myto-pod-dumbierom-najlepsie-vecerne-lyzovanie-na-slovensku-1.jpg'), caption: 'Obě osvětlené sjezdovky Mýta při západu slunce', credit: 'Mýto Ski & Bike (oficiální web)', sourceUrl: SRC.mytoVecer, kind: 'venue' },
      { src: myto('Vecerne-lyzovanie-30.jpg'), caption: 'Večerní lyžování – čtyřsedačka nad osvětlenou sjezdovkou', credit: 'Mýto Ski & Bike (oficiální web)', sourceUrl: SRC.mytoVecer, kind: 'venue' },
      { src: myto('VEČERKO - MYTO - -1 - kópia.jpg'), caption: 'Lyžaři pod svahem během večerního lyžování', credit: 'Mýto Ski & Bike (oficiální web)', sourceUrl: SRC.mytoVecer, kind: 'venue' },
      { src: myto('Myto_ski_and_bike_2_2.jpg'), caption: 'Pohled na celý areál Mýta v zimě', credit: 'Mýto Ski & Bike (oficiální web)', sourceUrl: SRC.mytoGaleria, kind: 'venue' },
      { src: myto('promo_foto_Myto_ski_and_bike_38_3.jpg'), caption: 'Parta na horní části sjezdovky', credit: 'Mýto Ski & Bike (oficiální web)', sourceUrl: SRC.mytoGaleria, kind: 'venue' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/976_44_M%C3%BDto_pod_%C4%8Eumbierom%2C_Slovakia_-_panoramio.jpg/1280px-976_44_M%C3%BDto_pod_%C4%8Eumbierom%2C_Slovakia_-_panoramio.jpg', caption: 'Sjezdovka Mýta s obcí a hřebenem Nízkých Tater v pozadí', credit: 'Michal Gorski, Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:976_44_M%C3%BDto_pod_%C4%8Eumbierom,_Slovakia_-_panoramio.jpg', kind: 'venue', license: 'CC BY-SA 3.0', direct: true },
      { src: myto('restauracia_myto_ski_and_bike_7.jpg'), caption: 'Interiér samoobslužné restaurace pod svahem', credit: 'Mýto Ski & Bike (oficiální web)', sourceUrl: SRC.mytoStrava, kind: 'venue' },
    ],
  },
  {
    id: 'tale',
    name: 'Ski Tále',
    short: 'Lyžování 4 km od chaty',
    category: ['ski'],
    pos: [48.86468, 19.58979],
    navTo: [48.867686, 19.593493],
    navMode: 'driving',
    description:
      'Rodinné středisko s 6 vleky (bez lanovky) a výhledem na Chopok. Modré i červené sjezdovky, půjčovna a škola. Dobrá volba na rychlé dopoledne nebo když je v Mýtě plno.',
    website: SRC.tale,
    instagram: { handle: '@resort_tale_official', url: 'https://www.instagram.com/resort_tale_official/' },
    points: [{ label: 'Parkoviště', pos: [48.867686, 19.593493], kind: 'parking' }],
    access: { routeId: 'tale-car', text: 'Autem přes Bystrou, parkoviště u sjezdovek zdarma.' },
    photos: [
      { src: 'https://www.tale.sk/wp-content/uploads/2021/11/ski1.jpg', caption: 'Areál Tále pod zasněženým Chopkem', credit: 'Tále (oficiální web)', sourceUrl: SRC.tale, kind: 'area' },
      { src: 'https://www.tale.sk/wp-content/uploads/2021/10/Ski-Tale-002.jpeg', caption: 'Sjezdovky Tále v lese nad loukou', credit: 'Tále (oficiální web)', sourceUrl: 'https://www.tale.sk/', kind: 'area' },
      { src: 'https://www.tale.sk/wp-content/uploads/2021/12/IMG_1754-1024x683.jpg', caption: 'Snowboardista na upravené sjezdovce Tále', credit: 'Tále (oficiální web)', sourceUrl: SRC.tale, kind: 'venue' },
    ],
  },
  {
    id: 'krupova',
    name: 'Chopok Juh – Après-ski bar Krupová',
    short: 'Bar u dolní stanice lanovky',
    category: ['apres', 'ski'],
    pos: [48.922106, 19.597635],
    navTo: [48.92157, 19.598742],
    navMode: 'driving',
    description:
      'Après-ski bar u nástupní stanice kabinky Krupová – Kosodrevina (1 084 m). Hudba celý den, 80 míst, otevřeno během provozu lanovek. Ideální konec dne na jižní straně Chopku.',
    website: SRC.jasnaKrupova,
    instagram: { handle: '@jasna_nizke_tatry', url: 'https://www.instagram.com/jasna_nizke_tatry/' },
    points: [
      { label: 'Parkoviště', pos: [48.92157, 19.598742], kind: 'parking' },
    ],
    access: {
      routeId: 'krupova-car',
      text: 'Autem na parkoviště Krupová (12 min), bar je pár kroků od parkoviště u dolní stanice.',
    },
    photos: [
      { src: jasna('apreski_krupova__4_.jpg'), caption: 'Oranžový stan baru Krupová s posezením u sjezdovky', credit: 'Jasná Nízke Tatry (oficiální web)', sourceUrl: SRC.jasnaKrupova, kind: 'venue' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Chopok_z_Kosodreviny.JPG/1280px-Chopok_z_Kosodreviny.JPG', caption: 'Chopok juh nad Krupovou (léto) – kam vede kabinka', credit: 'Pe3kZA, Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chopok_z_Kosodreviny.JPG', kind: 'area', license: 'CC BY-SA 4.0', direct: true },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Chata_Kosodrevina.JPG/1280px-Chata_Kosodrevina.JPG', caption: 'Kosodrevina – horní stanice kabinky z Krupové (léto)', credit: 'Pe3kZA, Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chata_Kosodrevina.JPG', kind: 'area', license: 'CC BY-SA 4.0', direct: true },
    ],
  },
  {
    id: 'priehyba',
    name: 'Priehyba – Funibar',
    short: 'Tip na après-ski během lyžařského dne',
    category: ['apres', 'ski'],
    pos: [48.962892, 19.589341],
    navTo: [48.92157, 19.598742],
    navMode: 'driving',
    description:
      'Bar s prosklenou kupolí na Priehybě (1 342 m) na severní straně Chopku, u nástupu na Funitel. Na lyžařský den: z Krupové lanovkami nahoru na Chopok a sjet na sever. Autem je to přes Čertovicu přes hodinu.',
    website: SRC.jasnaFunibar,
    instagram: { handle: '@jasna_nizke_tatry', url: 'https://www.instagram.com/jasna_nizke_tatry/' },
    access: {
      routeId: 'krupova-car',
      text: 'Autem na Krupovou (12 min), pak lanovkou Krupová → Kosodrevina → Chopok a na lyžích dolů na Priehybu.',
      liftText: 'Lanovky + lyže přes Chopok (není silnice)',
      liftLine: [
        [48.922106, 19.597635],
        [48.932463, 19.597452],
        [48.943726, 19.59006],
        [48.962718, 19.589017],
      ],
    },
    photos: [
      { src: jasna('IMG_1053.jpg'), caption: 'Funibar s kupolí a terasou plnou lyžařů na Priehybě', credit: 'Jasná Nízke Tatry (oficiální web)', sourceUrl: SRC.jasnaFunibar, kind: 'venue' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Jasn%C3%A1_-_Priehyba-_6-seda%C4%8Dkov%C3%A1_lanovka.JPG/1280px-Jasn%C3%A1_-_Priehyba-_6-seda%C4%8Dkov%C3%A1_lanovka.JPG', caption: 'Šestisedačka na Priehybu nad sjezdovkou Jasné', credit: 'Pudelek, Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jasn%C3%A1_-_Priehyba-_6-seda%C4%8Dkov%C3%A1_lanovka.JPG', kind: 'area', license: 'CC BY-SA 3.0', direct: true },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Chopok_-_Jasn%C3%A1_Ski_Resort.JPG/1280px-Chopok_-_Jasn%C3%A1_Ski_Resort.JPG', caption: 'Vrchol Chopku – přechod z jihu na sever', credit: 'Pudelek (Marcin Szala), Wikimedia Commons', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chopok_-_Jasn%C3%A1_Ski_Resort.JPG', kind: 'area', license: 'CC BY-SA 3.0', direct: true },
    ],
  },
  {
    id: 'skybar',
    name: 'Sky Bar – Double Red Cars Museum',
    short: 'Jurassic Night · Brezno',
    category: ['party'],
    pos: [48.798761, 19.631743],
    navTo: [48.798761, 19.631743],
    navMode: 'driving',
    description:
      'Prosklený bar ve stylu art deco na střeše muzea aut v Brezně, s terasou a výhledem na Nízké Tatry. Na Silvestra tu bude tematická párty Jurassic Night s výstavou dinosaurů a ohňostrojem.',
    website: SRC.skybar,
    instagram: { handle: '@doubleredcars', url: 'https://www.instagram.com/doubleredcars/' },
    access: { routeId: 'brezno-car', text: 'Autem z chaty po silnici 72 do Brezna, 18 min.' },
    photos: [
      { src: drc('2024/12/sb7.jpg'), caption: 'Sky Bar večer – prosklený sál a terasa s palmami', credit: 'Double Red Cars Museum (oficiální web)', sourceUrl: SRC.skybar, kind: 'venue' },
      { src: drc('2024/12/sb13.jpg'), caption: 'Sál Sky Baru připravený na akci, kde bude Silvestr', credit: 'Double Red Cars Museum (oficiální web)', sourceUrl: SRC.skybar, kind: 'venue' },
      { src: drc('2024/12/deco-test-1-scaled-1.jpg'), caption: 'Barové stoličky u pultu Sky Baru', credit: 'Double Red Cars Museum (oficiální web)', sourceUrl: SRC.skybar, kind: 'venue' },
      { src: drc('2024/12/deco-t1.jpg'), caption: 'Výčep a art deco obklad baru', credit: 'Double Red Cars Museum (oficiální web)', sourceUrl: SRC.skybar, kind: 'venue' },
      { src: drc('2025/12/skybar_6.webp'), caption: 'Terasa Sky Baru s výhledem na Brezno a hory', credit: 'Double Red Cars Museum (oficiální web)', sourceUrl: SRC.skybar, kind: 'venue' },
    ],
  },
  {
    id: 'happyend',
    name: 'Happy End Jasná',
    short: 'Silvestr s KALI & Peter Pann · Biela Púť',
    category: ['party'],
    pos: [48.971184, 19.583007],
    navTo: [48.970803, 19.584702],
    navMode: 'driving',
    description:
      'Největší klub na Liptově – přes den ski-in/ski-out restaurace pod Biela Púť, večer Happy End Music Club se zvukem Funktion-One. Je na severní straně Chopku, chata je na jižní: autem přes Čertovicu.',
    website: SRC.jasnaHappyEnd,
    instagram: { handle: '@happyendjasna', url: 'https://www.instagram.com/happyendjasna/' },
    points: [
      { label: 'P2 Biela Púť', pos: [48.970803, 19.584702], kind: 'parking' },
      { label: 'P4 Lúčky', pos: [48.979952, 19.592009], kind: 'parking' },
    ],
    access: {
      routeId: 'jasna-car',
      text: 'Autem přes průsmyk Čertovica (1 238 m) a Liptov, asi 67 km. Silnice přes Čertovicu bývá v noci zasněžená.',
    },
    photos: [
      { src: jasna('DSC00431.jpg'), caption: 'Vystoupení na pódiu Happy Endu, dav se světly mobilů', credit: 'Jasná Nízke Tatry (oficiální web)', sourceUrl: SRC.jasnaHappyEnd, kind: 'event' },
      { src: jasna('318806492_698063911755794_1190155035922341203_n.jpg'), caption: 'Laserová show nad tanečním parketem', credit: 'Jasná Nízke Tatry (oficiální web)', sourceUrl: SRC.jasnaSilvestr, kind: 'event' },
      { src: jasna('DSC02260-Enhanced-NR.jpg'), caption: 'Plný klub při koncertě s LED stěnou', credit: 'Jasná Nízke Tatry (oficiální web)', sourceUrl: SRC.jasnaHappyEnd, kind: 'event' },
      { src: jasna('319854644_1188893568391757_533751917773470964_n.jpg'), caption: 'Konfety a dav v patrovém interiéru klubu', credit: 'Jasná Nízke Tatry (oficiální web)', sourceUrl: SRC.jasnaSilvestr, kind: 'event' },
      { src: jasna('DSC01194.jpg'), caption: 'Parket během party, pohled z galerie', credit: 'Jasná Nízke Tatry (oficiální web)', sourceUrl: SRC.jasnaHappyEnd, kind: 'event' },
      { src: jasna('Bary_a_restauracie/Happy_End/happyend_jasna_6_noc.jpg'), caption: 'Budova Happy Endu v noci s barevným nasvícením', credit: 'Jasná Nízke Tatry (oficiální web)', sourceUrl: SRC.jasnaHappyEnd, kind: 'venue' },
      { src: jasna('Bary_a_restauracie/Happy_End/happyend_jasna_4.jpg'), caption: 'Happy End přes den – terasa přímo u sjezdovky', credit: 'Jasná Nízke Tatry (oficiální web)', sourceUrl: SRC.jasnaHappyEnd, kind: 'venue' },
    ],
  },
]

// ---- Akce --------------------------------------------------------------------
export const events: TripEvent[] = [
  {
    id: 'skybar-jurassic',
    placeId: 'skybar',
    title: 'Jurassic Night – Silvestr v Sky Baru',
    date: '2026-12-31',
    start: '18:00',
    status: 'confirmed',
    summary: 'Silvestr „o miliony let zpátky“ – výstava dinosaurů, party v Sky Baru a ohňostroj. Dvě varianty vstupu:',
    options: [
      { label: 'Galavečer', start: '18:00', price: '59 € / os.', includes: 'welcome drink, 4chodové menu, živá hudba, party, bufet, candy bar, ohňostroj' },
      { label: 'Silvestrovská párty', start: '20:00', price: '29 € / os.', includes: 'welcome drink, party, bufet, candy bar, ohňostroj' },
    ],
    reservation: { label: 'Rezervace', tel: '+421910446447' },
    poster: {
      src: 'https://www.brezno.sk/data-files/brezno/event/images/double-red_december_26.jpg',
      caption: 'Plakát „December v Double Red Cars Museum“ – Jurassic Night 31. 12.',
      credit: 'Double Red Cars Museum / brezno.sk',
      sourceUrl: SRC.brezno,
      kind: 'poster',
    },
    source: SRC.brezno,
    verified: '2026-11-26',
  },
  {
    id: 'happyend-silvestr',
    placeId: 'happyend',
    title: 'Silvestr s KALI & Peter Pann',
    date: '2026-12-31',
    start: '21:00',
    status: 'confirmed',
    summary: 'Rapper KALI & Peter Pann, DJ Just Dave a East Luke, světelná show a odpočet do roku 2027. Párty do ranních hodin.',
    priceWaves: [
      { label: '1. vlna online', price: '39 €' },
      { label: '2. vlna online', price: '49 €' },
      { label: 'Na místě', price: '59 €' },
    ],
    tickets: { label: 'Vstupenky na Gopass', url: 'https://gopass.travel/CZ/silvestrovska-party-s-kalim-v-happy-end-jasna-d7_22491' },
    poster: {
      src: jasna('1440X1800.jpg'),
      caption: 'Oficiální plakát Silvester 2026 – KALI & Peter Pann',
      credit: 'Jasná Nízke Tatry / Gopass',
      sourceUrl: SRC.jasnaSilvestr,
      kind: 'poster',
    },
    source: SRC.jasnaSilvestr,
    verified: '2026-11-26',
  },
  {
    id: 'myto-silvestr',
    placeId: 'myto',
    title: 'Silvestr v Mýtě',
    date: '2026-12-31',
    status: 'unconfirmed',
    summary:
      'Letošní silvestrovský program Mýto Ski & Bike zatím nezveřejnilo. Poslední Après Ski Sunset Party byly v lednu a únoru 2026 (18:00–21:00 při večerním lyžování).',
    source: SRC.mytoParty,
    verified: '2026-11-26',
    note: 'Sleduj Instagram @mytoskibike – až bude program, doplň ho sem.',
  },
  {
    id: 'myto-vecerne',
    placeId: 'myto',
    title: 'Večerní lyžování v Mýtě',
    date: '2026-12-30',
    start: '18:00',
    status: 'tip',
    summary: 'Obě sjezdovky osvětlené, 18:00–21:00. V top sezóně (23. 12. – 6. 1.) stojí večerní skipas 30 € (online 28 €). Ideální s drinkem v baru pod svahem.',
    tickets: { label: 'Skipasy online', url: 'https://tickets.kopeczabavy.sk/sk/Tickets' },
    source: SRC.mytoCennik,
    verified: '2026-11-26',
    note: 'Provoz konkrétně 31. 12. večer areál zatím neuvedl – ověř na webu nebo na +421 911 379 378. Předpokládané otevření sezóny 19. 12. 2026.',
  },
]

// ---- Silvestr: dvě varianty večera ----------------------------------------------
export type NyeStep = {
  time: string
  title: string
  text: string
  status: EventStatus
  placeId?: string
}

export type NyeVariant = {
  id: 'blizko' | 'klub'
  label: string
  sub: string
  placeIds: string[]
  routeThere: string
  routeBack: string
  transport: string[]
  steps: NyeStep[]
}

export const nyeVariants: NyeVariant[] = [
  {
    id: 'blizko',
    label: 'Poblíž chaty',
    sub: 'Mýto → Brezno',
    placeIds: ['chata', 'myto', 'skybar'],
    routeThere: 'brezno-car',
    routeBack: 'brezno-back-car',
    transport: [
      'Tam: autem 13 km po silnici 72, asi 18 min.',
      'Zpět: stejnou cestou, 18 min. Po půlnoci řidič nepije, nebo si taxi z Brezna zamluvte předem – v noci na Nový rok je o taxíky nouze.',
    ],
    steps: [
      { time: 'odpoledne', title: 'Lyžování a drink pod svahem v Mýtě', text: '14 min pěšky z chaty. Bar a restaurace jsou přímo u nástupu na lanovku.', status: 'tip', placeId: 'myto' },
      { time: '16:30', title: 'Zpátky na chatě, převléct se', text: 'Silvestrovský program v Mýtě zatím není potvrzený.', status: 'tip', placeId: 'chata' },
      { time: '17:40 / 19:40', title: 'Odjezd do Brezna', text: 'Na galavečer odjet v 17:40, na samotnou párty v 19:40.', status: 'tip' },
      { time: '18:00 / 20:00', title: 'Jurassic Night v Sky Baru', text: 'Galavečer od 18:00 za 59 €, nebo jen párty od 20:00 za 29 €. Rezervace na 0910 446 447.', status: 'confirmed', placeId: 'skybar' },
      { time: '0:00', title: 'Ohňostroj nad Breznem', text: 'Součást programu v obou variantách vstupu.', status: 'confirmed', placeId: 'skybar' },
    ],
  },
  {
    id: 'klub',
    label: 'Velká klubová párty',
    sub: 'Happy End Jasná',
    placeIds: ['chata', 'krupova', 'priehyba', 'happyend'],
    routeThere: 'jasna-car',
    routeBack: 'jasna-back-car',
    transport: [
      'Tam: autem přes Čertovicu a Liptov, 67 km, asi 1 h 10 min (v zimě počítej s rezervou, přes průsmyk 1 238 m).',
      'Parkovat na P2 Biela Púť hned u klubu. Při velkých večerních akcích Jasná obvykle otevírá P4 Lúčky s kyvadlovou dopravou – na Silvestra ověř.',
      'Zpět: 66 km, asi 1 h 10 min, párty končí v ranních hodinách. Někdo musí zůstat střízlivý, taxi z Liptova k nám přes průsmyk je drahé a nejisté.',
    ],
    steps: [
      { time: 'dopoledne', title: 'Lyžování na Chopku z jihu', text: 'Autem 12 min na Krupovou, nahoru lanovkami. Kdo chce, sjede přes Chopok na sever na drink do Funibaru na Priehybě.', status: 'tip', placeId: 'priehyba' },
      { time: '15:30', title: 'Après-ski bar Krupová', text: 'Drink u dolní stanice, pak 12 min zpátky na chatu.', status: 'tip', placeId: 'krupova' },
      { time: '19:30', title: 'Odjezd z chaty přes Čertovicu', text: 'Asi 1 h 10 min, plus čas na parkování.', status: 'tip' },
      { time: '21:00', title: 'Silvestr s KALI & Peter Pann', text: 'Vstupenky 39 € (1. vlna) / 49 € (2. vlna) online, 59 € na místě.', status: 'confirmed', placeId: 'happyend' },
      { time: '0:00', title: 'Odpočet do roku 2027 v klubu', text: 'DJ Just Dave a East Luke hrají až do rána.', status: 'confirmed', placeId: 'happyend' },
    ],
  },
]

export const placeById = (id: string) => places.find((p) => p.id === id)!
export const eventsFor = (placeId: string) => events.filter((e) => e.placeId === placeId)
