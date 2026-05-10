/* components.jsx — Production lib (paylaşılan görsel parçalar)
   Design referansı: src/lib/_design-reference.jsx (aynen kopyalandı + küçük üretim eklemeleri)
*/

const { useState: useStateLib, useEffect: useEffectLib, useRef: useRefLib } = React;

/* ========== ORNAMENTS / KÖŞELER ========== */
const CornerOrnament = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M2 22 Q2 2 22 2" />
    <path d="M8 22 Q8 8 22 8" />
    <circle cx="22" cy="8" r="2" fill="currentColor" stroke="none" />
    <circle cx="8" cy="22" r="2" fill="currentColor" stroke="none" />
    <path d="M14 14 q4 0 4 4" />
    <path d="M30 4 q-2 6 -8 8 q6 -2 8 -8 z" fill="currentColor" stroke="none" opacity=".5" />
  </svg>
);

const Sparkle = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
      fill="currentColor"/>
  </svg>
);

/* ========== PUSULA GÜLÜ ========== */
const CompassRose = ({ size = 120, animated = true }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <defs>
      <radialGradient id="cg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FAF1D6"/>
        <stop offset="100%" stopColor="#E6D29A"/>
      </radialGradient>
    </defs>
    <circle cx="60" cy="60" r="56" fill="url(#cg)" stroke="#B8862F" strokeWidth="1.5"/>
    <circle cx="60" cy="60" r="48" fill="none" stroke="#B8862F" strokeWidth="0.8" strokeDasharray="2 4"/>
    {Array.from({ length: 16 }).map((_, i) => {
      const a = (i * 360 / 16) * Math.PI / 180;
      const r1 = i % 4 === 0 ? 38 : 42;
      const r2 = 48;
      return <line key={i}
        x1={60 + Math.cos(a) * r1} y1={60 + Math.sin(a) * r1}
        x2={60 + Math.cos(a) * r2} y2={60 + Math.sin(a) * r2}
        stroke="#8B6724" strokeWidth={i % 4 === 0 ? 1.6 : 0.8}/>;
    })}
    {[["N", 60, 16], ["E", 104, 64], ["S", 60, 112], ["W", 16, 64]].map(([t, x, y]) => (
      <text key={t} x={x} y={y} fontFamily="Patrick Hand, cursive" fontSize="13" fill="#5D2E2E" textAnchor="middle" dominantBaseline="middle" fontWeight="700">{t}</text>
    ))}
    <g className={animated ? "compass-needle" : ""}>
      <polygon points="60,18 64,60 60,102 56,60" fill="#C62828" stroke="#8B1C1C" strokeWidth="1"/>
      <polygon points="18,60 60,56 102,60 60,64" fill="#3E2723" stroke="#1f1311" strokeWidth="1"/>
      <polygon points="60,30 62,60 60,90 58,60" fill="#FAF1D6"/>
      <circle cx="60" cy="60" r="4" fill="#B8862F" stroke="#5D2E2E" strokeWidth="1"/>
    </g>
  </svg>
);

/* ========== TÜRKİYE HARİTASI ========== */
const REGIONS = [
  { id: "marmara", name: "Marmara", color: "var(--r-marmara)", badge: "🌊",
    points: "60,30 240,15 270,80 250,170 130,200 30,160 20,80",
    cx: 150, cy: 110 },
  { id: "karadeniz", name: "Karadeniz", color: "var(--r-karadeniz)", badge: "🌲",
    points: "240,15 700,5 870,40 940,160 720,195 470,200 270,180 250,80",
    cx: 530, cy: 100 },
  { id: "ege", name: "Ege", color: "var(--r-ege)", badge: "🌿",
    points: "30,160 230,200 220,290 200,380 60,395 5,330 10,210",
    cx: 110, cy: 290 },
  { id: "icanadolu", name: "İç Anadolu", color: "var(--r-icanadolu)", badge: "🏔",
    points: "230,200 470,200 620,210 640,310 470,360 220,370 210,290",
    cx: 410, cy: 280 },
  { id: "akdeniz", name: "Akdeniz", color: "var(--r-akdeniz)", badge: "☀️",
    points: "200,375 470,360 620,395 580,430 250,430 200,400",
    cx: 410, cy: 400 },
  { id: "doguanadolu", name: "Doğu Anadolu", color: "var(--r-doguanadolu)", badge: "⛰",
    points: "640,200 870,180 970,225 940,300 740,320 630,310 620,210",
    cx: 800, cy: 250 },
  { id: "guneydogu", name: "Güneydoğu", color: "var(--r-guneydogu)", badge: "🔥",
    points: "620,310 740,320 940,300 920,400 620,420 580,395 620,395",
    cx: 760, cy: 360 },
];

const TURKEY_OUTLINE = "M50 220 Q200 50 600 50 Q900 50 970 230 Q900 410 600 410 Q200 410 50 220 Z";

/* ====== Leaflet-based real geographic Turkey map ====== */
const REGION_FILL_COLORS = {
  marmara: "#64B5F6", karadeniz: "#81C784", ege: "#AED581",
  icanadolu: "#FFE082", akdeniz: "#FFB74D",
  doguanadolu: "#B39DDB", guneydogu: "#EF9A9A",
};

const REGION_CENTERS = {
  marmara:     [40.5, 28.5],
  karadeniz:   [41.0, 36.5],
  ege:         [38.4, 28.0],
  icanadolu:   [39.0, 33.5],
  akdeniz:     [36.9, 32.5],
  doguanadolu: [39.5, 42.5],
  guneydogu:   [37.5, 39.5],
};

const REGION_DISPLAY_NAMES = {
  marmara: "Marmara", karadeniz: "Karadeniz", ege: "Ege",
  icanadolu: "İç Anadolu", akdeniz: "Akdeniz",
  doguanadolu: "Doğu Anadolu", guneydogu: "Güneydoğu",
};



/* ====== Kazanım Kategorileri — bölge başına 5, MEB temalarına dayalı ====== */
const CATEGORIES_BY_REGION = {
  marmara: [
    { id: "iklim",    label: "İklim & Konum",     emoji: "🌤️" },
    { id: "sanayi",   label: "Sanayi & Ekonomi",  emoji: "🏭" },
    { id: "tarih",    label: "Tarihi Miras",      emoji: "🏛️" },
    { id: "cografya", label: "Boğazlar",          emoji: "⚓" },
    { id: "kultur",   label: "Şehir & Kültür",    emoji: "🏙️" },
  ],
  karadeniz: [
    { id: "iklim",  label: "İklim & Yağış",   emoji: "🌧️" },
    { id: "bitki",  label: "Bitki Örtüsü",    emoji: "🌳" },
    { id: "tarim",  label: "Tarım Ürünleri",  emoji: "🍃" },
    { id: "sekil",  label: "Yer Şekilleri",   emoji: "🏔️" },
    { id: "kultur", label: "Halk Kültürü",    emoji: "🎻" },
  ],
  ege: [
    { id: "tarim",   label: "Tarım Ürünleri",  emoji: "🫒" },
    { id: "antik",   label: "Antik Kentler",   emoji: "🏛️" },
    { id: "kiyilar", label: "Kıyı Coğrafyası", emoji: "🌊" },
    { id: "enerji",  label: "Yenilenebilir",   emoji: "💨" },
    { id: "turizm",  label: "Turizm",          emoji: "🏖️" },
  ],
  icanadolu: [
    { id: "iklim",   label: "Karasal İklim",   emoji: "🌾" },
    { id: "baskent", label: "Başkent",         emoji: "🏛️" },
    { id: "tarim",   label: "Tahıl & Hayvan",  emoji: "🐑" },
    { id: "sekil",   label: "Yer Şekilleri",   emoji: "🏔️" },
    { id: "tarih",   label: "Tarihi Miras",    emoji: "⚱️" },
  ],
  akdeniz: [
    { id: "iklim",  label: "Akdeniz İklimi",  emoji: "☀️" },
    { id: "turizm", label: "Turizm",          emoji: "🏖️" },
    { id: "tarim",  label: "Turunçgil & Sera", emoji: "🍊" },
    { id: "sekil",  label: "Toroslar",        emoji: "🏔️" },
    { id: "antik",  label: "Antik Kentler",   emoji: "🏛️" },
  ],
  doguanadolu: [
    { id: "sekil",   label: "Yüksek Dağlar",  emoji: "🏔️" },
    { id: "iklim",   label: "Sert Karasal",   emoji: "❄️" },
    { id: "hayvan",  label: "Hayvancılık",    emoji: "🐂" },
    { id: "goller",  label: "Göller",         emoji: "💧" },
    { id: "kultur",  label: "Kültür",         emoji: "🎯" },
  ],
  guneydogu: [
    { id: "gap",    label: "GAP & Su",        emoji: "🏞️" },
    { id: "tarim",  label: "Pamuk & Tarım",   emoji: "🌱" },
    { id: "iklim",  label: "Sıcak İklim",     emoji: "☀️" },
    { id: "tarih",  label: "Tarihi Miras",    emoji: "🛕" },
    { id: "kultur", label: "Gastronomi",      emoji: "🍮" },
  ],
};

/* Kategoriye göre soru havuzu — pool'u 5 segmente böler.
   cat0 = [0,1,2], cat1 = [3,4,5], cat2 = [6,7,8], cat3 = [9,10,11], cat4 = [12,13,14] */
const getMissionsForCategory = (regionId, categoryId) => {
  const cats = (window.getCategoriesForRegion ? window.getCategoriesForRegion(regionId) : (CATEGORIES_BY_REGION[regionId] || []));
  const catIdx = cats.findIndex(c => c.id === categoryId);
  if (catIdx < 0) return [];
  const grade = (function(){
    try { const raw = localStorage.getItem("tk_state"); if (raw) { const g = parseInt(JSON.parse(raw).grade, 10); if (g>=5 && g<=8) return g; } } catch(e){}
    return 5;
  })();
  const graded = window.REGIONS_CONTENT_GRADED && window.REGIONS_CONTENT_GRADED[regionId];
  let pool = null;
  if (graded && graded.missionsByGrade && graded.missionsByGrade[grade] && graded.missionsByGrade[grade].length) {
    pool = graded.missionsByGrade[grade];
  } else if (window.REGIONS_CONTENT && window.REGIONS_CONTENT[regionId]) {
    pool = window.REGIONS_CONTENT[regionId].missions || [];
  }
  if (!pool || pool.length === 0) return [];
  const start = catIdx * 3;
  // Tag each mission with its original index so the recorder knows the category.
  return pool.slice(start, start + 3).map((m, i) => ({ ...m, _origIdx: start + i }));
};

Object.assign(window, { CATEGORIES_BY_REGION, getMissionsForCategory });

/* ====== Sınıfa Özel Kazanım Kategorileri (MEB müfredatı) ======
   4 sınıf × 7 bölge × 5 kategori = 140 etiket. Stable id'ler (cat0..cat4) sınıf
   içindeki progress data'sını tutarlı kılar; sınıf değişince zaten reset olur. */
const CATEGORIES_BY_REGION_GRADED = {
  5: {
    marmara: [
      { id: "cat0", label: "Bölge Tanıma",      emoji: "🗺️" },
      { id: "cat1", label: "İklim",             emoji: "🌤️" },
      { id: "cat2", label: "Önemli Şehirler",   emoji: "🏙️" },
      { id: "cat3", label: "Boğazlar",          emoji: "⚓" },
      { id: "cat4", label: "Yöresel Kültür",    emoji: "🎭" },
    ],
    karadeniz: [
      { id: "cat0", label: "İklim & Yağış",     emoji: "🌧️" },
      { id: "cat1", label: "Bitki Örtüsü",      emoji: "🌳" },
      { id: "cat2", label: "Tarım Ürünleri",    emoji: "🍃" },
      { id: "cat3", label: "Yer Şekilleri",     emoji: "🏔️" },
      { id: "cat4", label: "Halk Kültürü",      emoji: "🎻" },
    ],
    ege: [
      { id: "cat0", label: "Tarım Ürünleri",    emoji: "🫒" },
      { id: "cat1", label: "Antik Kentler",     emoji: "🏛️" },
      { id: "cat2", label: "Kıyı Yapısı",       emoji: "🌊" },
      { id: "cat3", label: "Akdeniz İklimi",    emoji: "☀️" },
      { id: "cat4", label: "Kültür",            emoji: "🎨" },
    ],
    icanadolu: [
      { id: "cat0", label: "Karasal İklim",     emoji: "🌾" },
      { id: "cat1", label: "Bozkır",            emoji: "🌱" },
      { id: "cat2", label: "Buğday & Hayvan",   emoji: "🐑" },
      { id: "cat3", label: "Başkent",           emoji: "🏙️" },
      { id: "cat4", label: "Kapadokya",         emoji: "🎈" },
    ],
    akdeniz: [
      { id: "cat0", label: "Akdeniz İklimi",    emoji: "☀️" },
      { id: "cat1", label: "Turunçgiller",      emoji: "🍊" },
      { id: "cat2", label: "Turizm & Plaj",     emoji: "🏖️" },
      { id: "cat3", label: "Antik Kentler",     emoji: "🏛️" },
      { id: "cat4", label: "Yer Şekilleri",     emoji: "🏔️" },
    ],
    doguanadolu: [
      { id: "cat0", label: "Yüksek Dağlar",     emoji: "🏔️" },
      { id: "cat1", label: "Sert İklim",        emoji: "❄️" },
      { id: "cat2", label: "Hayvancılık",       emoji: "🐂" },
      { id: "cat3", label: "Van Gölü",          emoji: "💧" },
      { id: "cat4", label: "Yer Şekilleri",     emoji: "⛰️" },
    ],
    guneydogu: [
      { id: "cat0", label: "GAP & Pamuk",       emoji: "🌱" },
      { id: "cat1", label: "Sıcak İklim",       emoji: "☀️" },
      { id: "cat2", label: "Bölge Tanıma",      emoji: "🗺️" },
      { id: "cat3", label: "Antep Yiyecekleri", emoji: "🍮" },
      { id: "cat4", label: "Tarihi Yerler",     emoji: "🛕" },
    ],
  },
  6: {
    marmara: [
      { id: "cat0", label: "Fiziki Konum",      emoji: "🧭" },
      { id: "cat1", label: "Akarsular",         emoji: "🌊" },
      { id: "cat2", label: "Madenler",          emoji: "⛏️" },
      { id: "cat3", label: "Tarım Çeşitliliği", emoji: "🌾" },
      { id: "cat4", label: "Boğazlar (Stratejik)", emoji: "⚓" },
    ],
    karadeniz: [
      { id: "cat0", label: "Yer Şekilleri (Dağlar)", emoji: "🏔️" },
      { id: "cat1", label: "İklim-Bitki İlişkisi",   emoji: "🌳" },
      { id: "cat2", label: "Akarsular",              emoji: "🌊" },
      { id: "cat3", label: "Tarım Sınıfları",        emoji: "🍃" },
      { id: "cat4", label: "Madenler",               emoji: "⛏️" },
    ],
    ege: [
      { id: "cat0", label: "Kırıklı Dağ Yapısı",  emoji: "🏔️" },
      { id: "cat1", label: "Kıyı Oluşumu",        emoji: "🌊" },
      { id: "cat2", label: "Tarım Çeşitliliği",   emoji: "🫒" },
      { id: "cat3", label: "Akdeniz İklimi",      emoji: "☀️" },
      { id: "cat4", label: "Madenler",            emoji: "⛏️" },
    ],
    icanadolu: [
      { id: "cat0", label: "Yer Şekilleri (Plato)",  emoji: "🏞️" },
      { id: "cat1", label: "Volkanik Yapılar",        emoji: "🌋" },
      { id: "cat2", label: "Karasal İklim",           emoji: "🌾" },
      { id: "cat3", label: "Göller (Tuz, vs.)",       emoji: "🧂" },
      { id: "cat4", label: "Akarsular (Kızılırmak)",  emoji: "🌊" },
    ],
    akdeniz: [
      { id: "cat0", label: "Toros Dağları",      emoji: "🏔️" },
      { id: "cat1", label: "Karstik Şekiller",   emoji: "🕳️" },
      { id: "cat2", label: "Akdeniz İklimi",     emoji: "☀️" },
      { id: "cat3", label: "Tarım & Sera",       emoji: "🍅" },
      { id: "cat4", label: "Akarsular",          emoji: "🌊" },
    ],
    doguanadolu: [
      { id: "cat0", label: "Yüksek Dağlar",     emoji: "🏔️" },
      { id: "cat1", label: "Volkanik Yapılar",  emoji: "🌋" },
      { id: "cat2", label: "Karasal İklim",     emoji: "❄️" },
      { id: "cat3", label: "Göller (Van vd.)",  emoji: "💧" },
      { id: "cat4", label: "Madenler",          emoji: "⛏️" },
    ],
    guneydogu: [
      { id: "cat0", label: "Plato Yapısı",         emoji: "🏞️" },
      { id: "cat1", label: "Fırat & Dicle",        emoji: "🌊" },
      { id: "cat2", label: "Tarım (Pamuk)",        emoji: "🌱" },
      { id: "cat3", label: "Sıcak İklim",          emoji: "☀️" },
      { id: "cat4", label: "Madenler (Petrol)",    emoji: "🛢️" },
    ],
  },
  7: {
    marmara: [
      { id: "cat0", label: "Sanayi & Ekonomi",       emoji: "🏭" },
      { id: "cat1", label: "Ulaşım Ağı",             emoji: "🛣️" },
      { id: "cat2", label: "UNESCO Tarihi Miras",    emoji: "🏛️" },
      { id: "cat3", label: "Göç & Kentleşme",        emoji: "🏙️" },
      { id: "cat4", label: "Turizm",                 emoji: "🛳️" },
    ],
    karadeniz: [
      { id: "cat0", label: "Doğa Turizmi",       emoji: "🌳" },
      { id: "cat1", label: "Tarım Sanayisi",     emoji: "🍃" },
      { id: "cat2", label: "Yaylacılık",         emoji: "🌲" },
      { id: "cat3", label: "Ulaşım",             emoji: "🛣️" },
      { id: "cat4", label: "Kültürel Miras",     emoji: "🎻" },
    ],
    ege: [
      { id: "cat0", label: "Antik Kentler (UNESCO)", emoji: "🏛️" },
      { id: "cat1", label: "Turizm",                 emoji: "🏖️" },
      { id: "cat2", label: "Tarım Ekonomisi",        emoji: "🫒" },
      { id: "cat3", label: "Liman Ulaşımı",          emoji: "🛳️" },
      { id: "cat4", label: "Kültür",                 emoji: "🎨" },
    ],
    icanadolu: [
      { id: "cat0", label: "Başkent (Ankara)",       emoji: "🏛️" },
      { id: "cat1", label: "UNESCO Mirası",          emoji: "🏺" },
      { id: "cat2", label: "Tarım Ekonomisi",        emoji: "🌾" },
      { id: "cat3", label: "Turizm",                 emoji: "🎈" },
      { id: "cat4", label: "Ulaşım",                 emoji: "🛣️" },
    ],
    akdeniz: [
      { id: "cat0", label: "Turizm Ekonomisi",       emoji: "🏖️" },
      { id: "cat1", label: "UNESCO Antik",           emoji: "🏛️" },
      { id: "cat2", label: "Sera Tarımı",            emoji: "🍅" },
      { id: "cat3", label: "Ulaşım",                 emoji: "🛣️" },
      { id: "cat4", label: "Kültürel Miras",         emoji: "🎭" },
    ],
    doguanadolu: [
      { id: "cat0", label: "Kayak Turizmi",          emoji: "🎿" },
      { id: "cat1", label: "Hayvancılık Ekonomisi",  emoji: "🐂" },
      { id: "cat2", label: "Tarihi Miras",           emoji: "🏰" },
      { id: "cat3", label: "Ulaşım",                 emoji: "🛣️" },
      { id: "cat4", label: "Göç & Yaşam",            emoji: "🏘️" },
    ],
    guneydogu: [
      { id: "cat0", label: "GAP Kalkınma",           emoji: "🏞️" },
      { id: "cat1", label: "UNESCO Mirası",          emoji: "🛕" },
      { id: "cat2", label: "Gastronomi",             emoji: "🍮" },
      { id: "cat3", label: "Tarım Ekonomisi",        emoji: "🌱" },
      { id: "cat4", label: "Ulaşım",                 emoji: "🛣️" },
    ],
  },
  8: {
    marmara: [
      { id: "cat0", label: "Deprem Riski",              emoji: "⚠️" },
      { id: "cat1", label: "Çevre Sorunları",           emoji: "🌫️" },
      { id: "cat2", label: "Sürdürülebilir Sanayi",     emoji: "♻️" },
      { id: "cat3", label: "Yenilenebilir Enerji",      emoji: "💨" },
      { id: "cat4", label: "İklim Değişikliği",         emoji: "🌡️" },
    ],
    karadeniz: [
      { id: "cat0", label: "Heyelan & Sel Riski",       emoji: "⚠️" },
      { id: "cat1", label: "Sürdürülebilir Tarım",      emoji: "🌱" },
      { id: "cat2", label: "HES & Su Enerjisi",         emoji: "💧" },
      { id: "cat3", label: "Orman Yönetimi",            emoji: "🌳" },
      { id: "cat4", label: "İklim Değişikliği",         emoji: "🌡️" },
    ],
    ege: [
      { id: "cat0", label: "Rüzgar & Jeotermal",        emoji: "💨" },
      { id: "cat1", label: "Antik Miras Koruma",        emoji: "🏛️" },
      { id: "cat2", label: "İklim Değişikliği",         emoji: "🌡️" },
      { id: "cat3", label: "Sürdürülebilir Turizm",     emoji: "♻️" },
      { id: "cat4", label: "Erozyon Önlemleri",         emoji: "🌱" },
    ],
    icanadolu: [
      { id: "cat0", label: "Erozyon Riski",             emoji: "🌪️" },
      { id: "cat1", label: "Su Kaynakları",             emoji: "💧" },
      { id: "cat2", label: "Sürdürülebilir Tarım",      emoji: "🌾" },
      { id: "cat3", label: "İklim Değişikliği",         emoji: "🌡️" },
      { id: "cat4", label: "Yenilenebilir Enerji",      emoji: "☀️" },
    ],
    akdeniz: [
      { id: "cat0", label: "Kuraklık (İklim Değ.)",     emoji: "🌡️" },
      { id: "cat1", label: "Güneş Enerjisi",            emoji: "☀️" },
      { id: "cat2", label: "Yangın Riski",              emoji: "🔥" },
      { id: "cat3", label: "Sürdürülebilir Turizm",     emoji: "♻️" },
      { id: "cat4", label: "Su Kaynakları",             emoji: "💧" },
    ],
    doguanadolu: [
      { id: "cat0", label: "Deprem Riski",              emoji: "⚠️" },
      { id: "cat1", label: "Sürdürülebilir Hayvancılık", emoji: "🐂" },
      { id: "cat2", label: "Yenilenebilir Enerji",      emoji: "💨" },
      { id: "cat3", label: "Sert İklim Adaptasyonu",    emoji: "❄️" },
      { id: "cat4", label: "Çevre Yönetimi",            emoji: "🌳" },
    ],
    guneydogu: [
      { id: "cat0", label: "GAP Sürdürülebilirliği",    emoji: "🏞️" },
      { id: "cat1", label: "Su Yönetimi",               emoji: "💧" },
      { id: "cat2", label: "İklim Değişikliği",         emoji: "🌡️" },
      { id: "cat3", label: "Yenilenebilir Enerji",      emoji: "☀️" },
      { id: "cat4", label: "Çevre Koruma",              emoji: "♻️" },
    ],
  },
};

/* Sınıfa göre kategori listesi döndüren helper.
   localStorage'tan grade okur; tk_state yoksa veya geçersizse 5 kullanır. */
const getCategoriesForRegion = (regionId) => {
  let grade = 5;
  try {
    const raw = localStorage.getItem("tk_state");
    if (raw) {
      const g = parseInt(JSON.parse(raw).grade, 10);
      if (g >= 5 && g <= 8) grade = g;
    }
  } catch(e) {}
  const set = CATEGORIES_BY_REGION_GRADED[grade] || CATEGORIES_BY_REGION_GRADED[5];
  return (set && set[regionId]) || [];
};

Object.assign(window, { CATEGORIES_BY_REGION_GRADED, getCategoriesForRegion });

/* Sınıfa Özel Bölge İkonları — kazanım temalı (MEB Sosyal Bilgiler) */
const REGION_TOPIC_ICONS_GRADED = {
  // ============================================================
  // 5. SINIF — Bölgemizi Tanıyalım (temel ürün, kültür, sembol)
  // ============================================================
  5: {
    marmara: [
      { emoji: "🌉", label: "Boğaz Köprüsü", city: "İstanbul", lat: 41.04, lng: 29.03,
        desc: "Asya ve Avrupa'yı birbirine bağlayan ünlü asma köprü. Marmara'nın simgesidir." },
      { emoji: "🕌", label: "Ayasofya", city: "İstanbul", lat: 41.01, lng: 28.98,
        desc: "Bin yılı aşkın tarihiyle İstanbul'un en önemli yapısı. Bizans ve Osmanlı izleri taşır." },
      { emoji: "🏰", label: "Topkapı Sarayı", city: "İstanbul", lat: 41.01, lng: 28.98,
        desc: "Osmanlı padişahlarının yaşadığı görkemli saray. Bugün önemli bir müzedir." },
      { emoji: "⚓", label: "Çanakkale Boğazı", city: "Çanakkale", lat: 40.15, lng: 26.41,
        desc: "Akdeniz'i Marmara'ya bağlayan dar deniz geçidi. Tarihi savaşlara sahne olmuştur." },
      { emoji: "🌷", label: "Edirne Lalesi", city: "Edirne", lat: 41.68, lng: 26.56,
        desc: "Osmanlı'nın eski başkenti Edirne, lale ve Selimiye Camii ile ünlüdür." },
      { emoji: "🛍️", label: "Kapalıçarşı", city: "İstanbul", lat: 41.01, lng: 28.97,
        desc: "Dünyanın en eski kapalı çarşılarından biri. Binlerce dükkânıyla ünlüdür." },
      { emoji: "🌊", label: "Marmara Denizi", city: "Marmara", lat: 40.65, lng: 28.20,
        desc: "Tamamı ülkemiz sınırları içinde olan tek denizimizdir. Bölgeye adını verir." },
      { emoji: "🍽️", label: "İskender Kebap", city: "Bursa", lat: 40.20, lng: 29.07,
        desc: "Bursa'nın dünyaca ünlü yöresel yemeği. Yoğurt ve tereyağı ile servis edilir." },
    ],
    karadeniz: [
      { emoji: "🍵", label: "Çay Bahçeleri", city: "Rize", lat: 41.02, lng: 40.52,
        desc: "Rize, Türkiye'nin çay deposudur. Yağışlı iklim çay tarımına çok uygundur." },
      { emoji: "🌰", label: "Fındık Bahçesi", city: "Giresun", lat: 40.91, lng: 38.39,
        desc: "Giresun ve çevresi dünya fındık üretiminin önemli bir kısmını sağlar." },
      { emoji: "🌧️", label: "Bol Yağış", city: "Rize", lat: 41.02, lng: 40.52,
        desc: "Karadeniz Bölgesi en çok yağış alan bölgemizdir. Yıl boyunca yağış görülür." },
      { emoji: "🎻", label: "Kemençe", city: "Trabzon", lat: 41.00, lng: 39.72,
        desc: "Karadeniz'in vazgeçilmez halk müziği aletidir. Horon oynanırken çalınır." },
      { emoji: "💃", label: "Horon", city: "Trabzon", lat: 41.00, lng: 39.72,
        desc: "Karadeniz'in coşkulu halk oyunudur. Ellerden tutulup hızlı ritimle oynanır." },
      { emoji: "🌳", label: "Yayla", city: "Rize", lat: 40.66, lng: 41.10,
        desc: "Yüksek yerlerdeki çayırlık alanlardır. Yaz aylarında hayvanlar otlatılır." },
      { emoji: "🐟", label: "Hamsi", city: "Trabzon", lat: 41.00, lng: 39.72,
        desc: "Karadeniz'in en sevilen balığıdır. Pek çok yöresel yemeği yapılır." },
      { emoji: "🍞", label: "Mısır Ekmeği", city: "Trabzon", lat: 41.00, lng: 39.72,
        desc: "Karadeniz'de mısır çok yetişir. Mısır unundan yapılan ekmek yörenin temel yiyeceğidir." },
    ],
    ege: [
      { emoji: "🫒", label: "Zeytin Bahçesi", city: "Aydın", lat: 37.85, lng: 27.85,
        desc: "Ege Bölgesi Türkiye'nin zeytin deposudur. Aydın ve İzmir öne çıkar." },
      { emoji: "🍇", label: "Üzüm Bağı", city: "Manisa", lat: 38.62, lng: 27.42,
        desc: "Manisa'nın çekirdeksiz üzümü dünyaca ünlüdür. Kuru üzüm de buradan ihraç edilir." },
      { emoji: "🏛️", label: "Efes Antik Kenti", city: "İzmir", lat: 37.94, lng: 27.34,
        desc: "Selçuk'taki bu antik kent UNESCO Dünya Mirası'dır. Celsus Kütüphanesi ünlüdür." },
      { emoji: "🌊", label: "Ege Denizi", city: "Ege", lat: 38.50, lng: 26.50,
        desc: "Berrak suları ve girintili kıyıları ile bölgenin simgesidir. Birçok ada barındırır." },
      { emoji: "🏖️", label: "Çeşme Plajı", city: "İzmir", lat: 38.32, lng: 26.30,
        desc: "Ege'nin ünlü tatil merkezidir. Temiz denizi ve rüzgârıyla ünlüdür." },
      { emoji: "🍑", label: "İncir", city: "Aydın", lat: 37.85, lng: 27.85,
        desc: "Aydın inciri dünyaca tanınır. Hem taze hem kuru olarak tüketilir." },
      { emoji: "🚜", label: "Pamuk Tarlası", city: "Denizli", lat: 37.78, lng: 29.09,
        desc: "Ege ovalarında pamuk üretilir. Tekstil sanayisinin ham maddesidir." },
      { emoji: "🎶", label: "Zeybek Oyunu", city: "Aydın", lat: 37.85, lng: 27.85,
        desc: "Ege'nin yiğitlik temalı halk oyunudur. Ağır ve görkemli figürler içerir." },
    ],
    icanadolu: [
      { emoji: "🏛️", label: "Anıtkabir", city: "Ankara", lat: 39.92, lng: 32.83,
        desc: "Atatürk'ün anıt mezarıdır. Başkentimiz Ankara'da bulunur." },
      { emoji: "🌾", label: "Buğday Tarlası", city: "Konya", lat: 37.87, lng: 32.49,
        desc: "Konya Ovası ülkemizin tahıl ambarıdır. Ekmeğimiz buradan gelir." },
      { emoji: "🏔️", label: "Kapadokya Peri Bacaları", city: "Nevşehir", lat: 38.65, lng: 34.83,
        desc: "Volkanik kayaların aşınmasıyla oluşan eşsiz manzaradır. UNESCO Dünya Mirası'dır." },
      { emoji: "🧂", label: "Tuz Gölü", city: "Aksaray", lat: 38.78, lng: 33.38,
        desc: "Türkiye'nin tuz ihtiyacının büyük kısmını karşılayan ikinci büyük gölümüzdür." },
      { emoji: "🎈", label: "Sıcak Hava Balonu", city: "Nevşehir", lat: 38.64, lng: 34.83,
        desc: "Kapadokya'nın simgesi haline gelmiştir. Gün doğumunda gökyüzünü süsler." },
      { emoji: "🐑", label: "Koyun Sürüsü", city: "Konya", lat: 37.87, lng: 32.49,
        desc: "Geniş bozkırlarda küçükbaş hayvancılık yaygındır. Yün ve süt sağlar." },
      { emoji: "❄️", label: "Karasal İklim", city: "Ankara", lat: 39.92, lng: 32.83,
        desc: "Yazları sıcak ve kurak, kışları soğuk geçer. Bozkır bitki örtüsü hâkimdir." },
      { emoji: "🏛️", label: "Mevlana Türbesi", city: "Konya", lat: 37.87, lng: 32.50,
        desc: "Mevlana Celaleddin Rumi'nin türbesidir. Sema gösterileri ile ünlüdür." },
    ],
    akdeniz: [
      { emoji: "🍊", label: "Portakal Bahçesi", city: "Antalya", lat: 36.90, lng: 30.71,
        desc: "Akdeniz iklimi turunçgillerin yetişmesi için idealdir. Antalya ve Mersin öne çıkar." },
      { emoji: "🍋", label: "Limon Bahçesi", city: "Mersin", lat: 36.81, lng: 34.64,
        desc: "Mersin limon üretiminde Türkiye birincisidir. İhracatın önemli bir kısmı buradan yapılır." },
      { emoji: "🌴", label: "Muz Serası", city: "Antalya", lat: 36.55, lng: 31.99,
        desc: "Anamur ve Alanya çevresinde muz yetiştirilir. Sıcak iklim sayesinde ürün vermektedir." },
      { emoji: "🏖️", label: "Konyaaltı Plajı", city: "Antalya", lat: 36.86, lng: 30.65,
        desc: "Antalya'nın ünlü plajıdır. Mavi bayraklı temiz denizi ile turistlerin gözdesidir." },
      { emoji: "🏛️", label: "Aspendos", city: "Antalya", lat: 36.94, lng: 31.17,
        desc: "Roma döneminden kalma muhteşem antik tiyatrodur. Hâlâ konser verilir." },
      { emoji: "☀️", label: "Akdeniz Güneşi", city: "Antalya", lat: 36.90, lng: 30.71,
        desc: "Yılın büyük kısmı güneşli geçer. Bu yüzden turizmde Türkiye birincisidir." },
      { emoji: "🥒", label: "Sera Tarımı", city: "Antalya", lat: 36.96, lng: 30.79,
        desc: "Kumluca ve Demre'de seralarda sebze yetiştirilir. Kışın bile üretim yapılır." },
      { emoji: "🍯", label: "Çam Balı", city: "Muğla", lat: 37.21, lng: 28.36,
        desc: "Muğla yöresinin ünlü çam balı dünyaca bilinir. Bölgenin önemli ürünüdür." },
    ],
    doguanadolu: [
      { emoji: "🏔️", label: "Ağrı Dağı", city: "Ağrı", lat: 39.70, lng: 44.30,
        desc: "Türkiye'nin en yüksek dağıdır (5137 m). Sönmüş bir volkandır." },
      { emoji: "💧", label: "Van Gölü", city: "Van", lat: 38.65, lng: 43.00,
        desc: "Türkiye'nin en büyük gölüdür. Tuzlu ve sodalı suyu vardır." },
      { emoji: "🐈", label: "Van Kedisi", city: "Van", lat: 38.50, lng: 43.40,
        desc: "İki gözü ayrı renkte olan ünlü kedimizdir. Suyu ve yüzmeyi sever." },
      { emoji: "❄️", label: "Karlı İklim", city: "Erzurum", lat: 39.90, lng: 41.27,
        desc: "Doğu Anadolu kışları çok soğuk geçer. Karın yerde kaldığı süre uzundur." },
      { emoji: "🐄", label: "Büyükbaş Hayvancılık", city: "Erzurum", lat: 39.90, lng: 41.27,
        desc: "Geniş otlaklar büyükbaş hayvancılığa elverişlidir. Et ve süt üretilir." },
      { emoji: "🧀", label: "Kars Kaşar Peyniri", city: "Kars", lat: 40.60, lng: 43.10,
        desc: "Kars'ın yüksek otlaklarından elde edilen kaşar peyniri ünlüdür." },
      { emoji: "🏰", label: "İshak Paşa Sarayı", city: "Ağrı", lat: 39.52, lng: 44.27,
        desc: "Doğubayazıt'taki tarihi saraydır. Anadolu'nun son büyük taş yapılarındandır." },
      { emoji: "🍯", label: "Erzurum Cağ Kebabı", city: "Erzurum", lat: 39.90, lng: 41.27,
        desc: "Erzurum'un ünlü yöresel yemeğidir. Yatay şişte odun ateşinde pişirilir." },
    ],
    guneydogu: [
      { emoji: "🌾", label: "Pamuk Tarlası", city: "Şanlıurfa", lat: 37.16, lng: 38.79,
        desc: "GAP sayesinde Harran ovasında pamuk bolca yetişir. Tekstilin ham maddesidir." },
      { emoji: "🥜", label: "Antep Fıstığı", city: "Gaziantep", lat: 37.07, lng: 37.38,
        desc: "Gaziantep'in dünyaca ünlü ürünüdür. Baklavaya tat ve renk verir." },
      { emoji: "🍮", label: "Antep Baklavası", city: "Gaziantep", lat: 37.07, lng: 37.38,
        desc: "Coğrafi işaretli ünlü tatlımızdır. Kat kat yufka ve fıstık ile yapılır." },
      { emoji: "🏛️", label: "Göbeklitepe", city: "Şanlıurfa", lat: 37.22, lng: 38.92,
        desc: "Dünyanın bilinen en eski tapınağıdır (12.000 yaşında). UNESCO Dünya Mirası'dır." },
      { emoji: "🐟", label: "Balıklıgöl", city: "Şanlıurfa", lat: 37.15, lng: 38.79,
        desc: "Hz. İbrahim'in atıldığına inanılan kutsal göldür. Sazanları yenmez." },
      { emoji: "🪨", label: "Mardin Taş Evleri", city: "Mardin", lat: 37.31, lng: 40.74,
        desc: "Sarımsı taşlardan yapılmış geleneksel Mardin evleri. Açık hava müzesi gibidir." },
      { emoji: "☀️", label: "Sıcak ve Kurak İklim", city: "Şanlıurfa", lat: 37.16, lng: 38.79,
        desc: "Yazları çok sıcak ve kuraktır. Kışları ılıman geçer." },
      { emoji: "🌶️", label: "Urfa Biberi", city: "Şanlıurfa", lat: 37.16, lng: 38.79,
        desc: "Şanlıurfa'nın ünlü acı biberidir. Yöresel yemeklerin vazgeçilmezidir." },
    ],
  },

  // ============================================================
  // 6. SINIF — Yeryüzü Şekilleri ve Sular (fiziki coğrafya)
  // ============================================================
  6: {
    marmara: [
      { emoji: "⛷️", label: "Uludağ", city: "Bursa", lat: 40.10, lng: 29.22,
        desc: "Marmara Bölgesi'nin en yüksek dağıdır (2543 m). Kayak merkezi olarak ünlüdür." },
      { emoji: "💧", label: "Sapanca Gölü", city: "Sakarya", lat: 40.71, lng: 30.27,
        desc: "Tatlı sulu tektonik gölümüzdür. Çevre illerin içme suyunu sağlar." },
      { emoji: "🌊", label: "Sakarya Nehri", city: "Sakarya", lat: 40.95, lng: 30.40,
        desc: "İç Anadolu'dan doğup Karadeniz'e dökülen önemli akarsuyumuzdur." },
      { emoji: "💧", label: "İznik Gölü", city: "Bursa", lat: 40.45, lng: 29.55,
        desc: "Tektonik kökenli tatlı su gölüdür. Kıyısında tarihi İznik şehri yer alır." },
      { emoji: "⚠️", label: "Kuzey Anadolu Fayı", city: "Kocaeli", lat: 40.74, lng: 29.97,
        desc: "Türkiye'nin en aktif fay hattıdır. Marmara'dan geçer ve depremlere yol açar." },
      { emoji: "⛏️", label: "Mermer Yatakları", city: "Balıkesir", lat: 40.42, lng: 27.72,
        desc: "Marmara Adası ve çevresi mermer üretiminde önemlidir. İhraç ürünümüzdür." },
      { emoji: "🌳", label: "Trakya Ovası", city: "Tekirdağ", lat: 41.10, lng: 27.15,
        desc: "Ergene Ovası tahıl üretiminde önemlidir. Düz arazileri tarıma elverişlidir." },
      { emoji: "🏞️", label: "Kocaeli Yarımadası", city: "Kocaeli", lat: 40.85, lng: 29.85,
        desc: "Plato karakterinde alçak yer şekilleri içerir. Sanayi tesislerine ev sahipliği yapar." },
    ],
    karadeniz: [
      { emoji: "🏔️", label: "Kuzey Anadolu Dağları", city: "Trabzon", lat: 40.85, lng: 39.50,
        desc: "Karadeniz kıyısı boyunca uzanan dağ silsilesidir. İklimi büyük ölçüde etkiler." },
      { emoji: "🌊", label: "Kızılırmak", city: "Samsun", lat: 41.71, lng: 35.95,
        desc: "Türkiye'nin en uzun nehridir (1355 km). Karadeniz'e dökülür." },
      { emoji: "🌊", label: "Yeşilırmak", city: "Samsun", lat: 41.36, lng: 36.30,
        desc: "Tokat ve Amasya'dan geçerek Samsun'da Karadeniz'e dökülür. Bafra Ovası'nı oluşturur." },
      { emoji: "🌊", label: "Çoruh Nehri", city: "Artvin", lat: 41.18, lng: 41.82,
        desc: "Türkiye'nin en hızlı akan nehridir. Rafting için idealdir." },
      { emoji: "💧", label: "Uzungöl", city: "Trabzon", lat: 40.62, lng: 40.30,
        desc: "Heyelan set gölüdür. Yeşillikler içindeki manzarasıyla turist çeker." },
      { emoji: "⛏️", label: "Zonguldak Taş Kömürü", city: "Zonguldak", lat: 41.45, lng: 31.79,
        desc: "Türkiye'nin tek taş kömürü havzasıdır. Sanayinin önemli ham maddesidir." },
      { emoji: "⛏️", label: "Murgul Bakırı", city: "Artvin", lat: 41.19, lng: 41.55,
        desc: "Artvin Murgul, Türkiye'nin önemli bakır madeni yataklarındandır." },
      { emoji: "🏞️", label: "Bafra Ovası", city: "Samsun", lat: 41.55, lng: 35.90,
        desc: "Kızılırmak'ın oluşturduğu delta ovasıdır. Tarıma çok elverişlidir." },
    ],
    ege: [
      { emoji: "🏔️", label: "Bozdağlar", city: "İzmir", lat: 38.32, lng: 28.07,
        desc: "Ege Bölgesi'nde doğu-batı yönlü uzanan dağ silsilesidir. Aralarında ovalar bulunur." },
      { emoji: "🌊", label: "Büyük Menderes", city: "Aydın", lat: 37.74, lng: 27.59,
        desc: "Adı 'menderes' kelimesinin kaynağıdır. Ege Denizi'ne dökülür." },
      { emoji: "🌊", label: "Gediz Nehri", city: "İzmir", lat: 38.61, lng: 26.85,
        desc: "Ege Bölgesi'nin önemli nehridir. İzmir Körfezi'ne dökülür ve delta oluşturur." },
      { emoji: "💧", label: "Bafa Gölü", city: "Muğla", lat: 37.50, lng: 27.42,
        desc: "Eskiden bir körfez iken kapanmasıyla oluşan göldür. Doğal güzelliği ile bilinir." },
      { emoji: "🏞️", label: "Pamukkale Travertenleri", city: "Denizli", lat: 37.92, lng: 29.12,
        desc: "Karstik kökenli, kireçten oluşan beyaz travertenlerdir. UNESCO Dünya Mirası'dır." },
      { emoji: "🏞️", label: "Menderes Ovası", city: "Aydın", lat: 37.85, lng: 27.85,
        desc: "Akarsu birikintilerinden oluşmuş verimli ova. Pamuk ve incir tarımı yapılır." },
      { emoji: "⛏️", label: "Soma Linyiti", city: "Manisa", lat: 39.18, lng: 27.61,
        desc: "Manisa Soma'da büyük linyit kömürü yatakları vardır. Termik santrali besler." },
      { emoji: "⛏️", label: "Bor Madeni", city: "Kütahya", lat: 39.42, lng: 29.99,
        desc: "Emet'te dünyanın en büyük bor rezervleri vardır. Türkiye dünya birincisidir." },
    ],
    icanadolu: [
      { emoji: "🏔️", label: "Erciyes Dağı", city: "Kayseri", lat: 38.53, lng: 35.45,
        desc: "İç Anadolu'nun en yüksek dağıdır (3917 m). Sönmüş bir volkandır, kayak merkezidir." },
      { emoji: "🏔️", label: "Hasan Dağı", city: "Aksaray", lat: 38.13, lng: 34.17,
        desc: "Sönmüş volkanik dağdır (3268 m). Çatalhöyük duvar resimlerinde de yer alır." },
      { emoji: "🌊", label: "Kızılırmak Kaynağı", city: "Sivas", lat: 39.85, lng: 38.32,
        desc: "Türkiye'nin en uzun nehri Sivas'tan doğar. İç Anadolu'yu kıvrılarak geçer." },
      { emoji: "💧", label: "Tuz Gölü", city: "Aksaray", lat: 38.78, lng: 33.38,
        desc: "Türkiye'nin ikinci büyük gölüdür. Kapalı havzadadır, çok tuzludur." },
      { emoji: "💧", label: "Beyşehir Gölü", city: "Konya", lat: 37.78, lng: 31.50,
        desc: "Türkiye'nin üçüncü büyük gölüdür. Tatlı sulu, tarıma su sağlar." },
      { emoji: "🏞️", label: "Konya Ovası", city: "Konya", lat: 37.87, lng: 32.49,
        desc: "Türkiye'nin tahıl ambarıdır. Geniş düzlüklerde buğday ekilir." },
      { emoji: "🏔️", label: "Peri Bacaları", city: "Nevşehir", lat: 38.65, lng: 34.83,
        desc: "Volkanik tüflerin aşınmasıyla oluşan jeolojik şekillerdir. Kapadokya'ya özgüdür." },
      { emoji: "⛏️", label: "Sivas Demir Yatakları", city: "Sivas", lat: 39.75, lng: 37.02,
        desc: "Divriği'de zengin demir madeni vardır. Karabük ve Ereğli'de işlenir." },
    ],
    akdeniz: [
      { emoji: "🏔️", label: "Toros Dağları", city: "Antalya", lat: 36.78, lng: 31.40,
        desc: "Akdeniz kıyısı boyunca uzanan yüksek dağ silsilesidir. İklimi belirler." },
      { emoji: "🌊", label: "Seyhan Nehri", city: "Adana", lat: 36.99, lng: 35.32,
        desc: "Toroslardan doğup Akdeniz'e dökülür. Çukurova'yı sular." },
      { emoji: "🌊", label: "Ceyhan Nehri", city: "Adana", lat: 37.02, lng: 35.81,
        desc: "Çukurova'yı sulayan ikinci büyük nehirdir. Akdeniz'e dökülür." },
      { emoji: "💧", label: "Eğirdir Gölü", city: "Isparta", lat: 38.05, lng: 30.87,
        desc: "Türkiye'nin dördüncü büyük gölüdür. Tatlı sulu, balıkçılık yapılır." },
      { emoji: "💧", label: "Burdur Gölü", city: "Burdur", lat: 37.72, lng: 30.18,
        desc: "Tektonik kökenli, hafif tuzlu göldür. Su seviyesi giderek azalmaktadır." },
      { emoji: "🏞️", label: "Çukurova", city: "Adana", lat: 36.99, lng: 35.32,
        desc: "Türkiye'nin en büyük delta ovasıdır. Pamuk başta olmak üzere tarıma elverişlidir." },
      { emoji: "🏞️", label: "Karstik Mağaralar", city: "Antalya", lat: 37.10, lng: 30.93,
        desc: "Toroslar'ın kireç taşı yapısı binlerce mağara oluşturmuştur. Damlataş ünlüdür." },
      { emoji: "⛏️", label: "Krom Madeni", city: "Antalya", lat: 37.21, lng: 31.16,
        desc: "Akdeniz Bölgesi'nde Toros eteklerinde krom madeni çıkarılır. İhracat ürünüdür." },
    ],
    doguanadolu: [
      { emoji: "🏔️", label: "Ağrı Dağı", city: "Ağrı", lat: 39.70, lng: 44.30,
        desc: "Türkiye'nin en yüksek noktasıdır (5137 m). Sönmüş volkandır, zirvesi karlıdır." },
      { emoji: "🏔️", label: "Süphan Dağı", city: "Bitlis", lat: 38.92, lng: 42.82,
        desc: "Türkiye'nin ikinci yüksek volkanik dağıdır (4058 m). Van Gölü'nün kuzeyindedir." },
      { emoji: "🌊", label: "Fırat Nehri", city: "Erzurum", lat: 39.78, lng: 41.05,
        desc: "Erzurum yakınlarından doğar. Türkiye'den geçen en uzun akarsuyumuzdur." },
      { emoji: "🌊", label: "Murat Nehri", city: "Muş", lat: 38.74, lng: 41.50,
        desc: "Fırat'ın en büyük koludur. Doğu Anadolu'yu boylu boyunca geçer." },
      { emoji: "💧", label: "Van Gölü", city: "Van", lat: 38.65, lng: 43.00,
        desc: "Türkiye'nin en büyük gölüdür (3713 km²). Volkanik set gölüdür, sodalıdır." },
      { emoji: "🏞️", label: "Erzurum-Kars Platosu", city: "Erzurum", lat: 39.90, lng: 41.27,
        desc: "Türkiye'nin en yüksek ve en geniş platosudur. Hayvancılığa elverişlidir." },
      { emoji: "🏞️", label: "Iğdır Ovası", city: "Iğdır", lat: 39.92, lng: 44.05,
        desc: "Doğu Anadolu'nun en alçak yeridir. Mikroklima sayesinde meyvecilik yapılır." },
      { emoji: "⛏️", label: "Divriği Demir", city: "Sivas", lat: 39.37, lng: 38.12,
        desc: "Türkiye'nin en zengin demir yataklarındandır. Doğu Anadolu sınırına yakındır." },
    ],
    guneydogu: [
      { emoji: "🏔️", label: "Karacadağ", city: "Diyarbakır", lat: 37.67, lng: 39.83,
        desc: "Sönmüş bir volkanik dağdır. Etekleri tarıma elverişlidir, buğdayın anavatanıdır." },
      { emoji: "🌊", label: "Fırat Nehri", city: "Şanlıurfa", lat: 37.49, lng: 38.30,
        desc: "Bölgeyi sulayan en önemli akarsudur. Atatürk Barajı üzerine kurulmuştur." },
      { emoji: "🌊", label: "Dicle Nehri", city: "Diyarbakır", lat: 37.91, lng: 40.22,
        desc: "Diyarbakır'dan geçerek Suriye'ye akar. Mezopotamya'nın iki büyük nehrinden biridir." },
      { emoji: "💧", label: "Atatürk Barajı", city: "Şanlıurfa", lat: 37.48, lng: 38.32,
        desc: "Türkiye'nin en büyük barajıdır. GAP'ın kalbidir, elektrik üretir ve sulama yapar." },
      { emoji: "🏞️", label: "Harran Ovası", city: "Şanlıurfa", lat: 36.86, lng: 39.03,
        desc: "GAP sayesinde sulanan verimli ovadır. Pamuk ve mısır yetiştirilir." },
      { emoji: "🏞️", label: "Diyarbakır Bazalt Platosu", city: "Diyarbakır", lat: 37.91, lng: 40.22,
        desc: "Karacadağ'dan akan lavlarla oluşmuş plato. Siyah bazalt taşlar yaygındır." },
      { emoji: "⛏️", label: "Batman Petrolü", city: "Batman", lat: 37.89, lng: 41.13,
        desc: "Türkiye'nin en önemli petrol kuyularındandır. Rafineri burada bulunur." },
      { emoji: "⛏️", label: "Şırnak Asfaltiti", city: "Şırnak", lat: 37.52, lng: 42.46,
        desc: "Asfaltit, kömüre benzeyen yakıt taşıdır. Şırnak'ın önemli yer altı kaynağıdır." },
    ],
  },

  // ============================================================
  // 7. SINIF — Tarihte Yolculuk + Ekonomi/Yaşam (UNESCO, sanayi)
  // ============================================================
  7: {
    marmara: [
      { emoji: "🏭", label: "Bursa Otomotiv Sanayi", city: "Bursa", lat: 40.20, lng: 29.07,
        desc: "Türkiye'nin otomotiv başkentidir. TOFAŞ ve Renault burada üretim yapar." },
      { emoji: "🛍️", label: "İstanbul Tekstil Merkezi", city: "İstanbul", lat: 41.04, lng: 28.97,
        desc: "Laleli ve Merter, hazır giyim ihracatının kalbi sayılır. İstanbul önemli sanayi merkezidir." },
      { emoji: "🛬", label: "İstanbul Havalimanı", city: "İstanbul", lat: 41.27, lng: 28.74,
        desc: "Dünyanın en büyük havalimanlarından biridir. 2018'de açılmıştır." },
      { emoji: "🚢", label: "Ambarlı Limanı", city: "İstanbul", lat: 40.98, lng: 28.69,
        desc: "Türkiye'nin en yoğun konteyner limanlarındandır. İhracat ve ithalatın merkezidir." },
      { emoji: "🚇", label: "Marmaray", city: "İstanbul", lat: 41.00, lng: 29.00,
        desc: "Asya ile Avrupa'yı boğaz altından bağlayan demir yoludur. 2013'te açılmıştır." },
      { emoji: "🏛️", label: "Selimiye Camii (UNESCO)", city: "Edirne", lat: 41.68, lng: 26.56,
        desc: "Mimar Sinan'ın 'ustalık eserim' dediği yapısıdır. UNESCO Dünya Mirası listesindedir." },
      { emoji: "🌷", label: "Tarihi Yarımada (UNESCO)", city: "İstanbul", lat: 41.01, lng: 28.97,
        desc: "Sultanahmet, Ayasofya, Topkapı çevresi UNESCO listesindedir. Bizans-Osmanlı mirasını taşır." },
      { emoji: "🛣️", label: "Kuzey Marmara Otoyolu", city: "Kocaeli", lat: 40.85, lng: 29.85,
        desc: "Yavuz Sultan Selim Köprüsü ile birlikte yapılmıştır. Trafiği rahatlatır." },
    ],
    karadeniz: [
      { emoji: "🏭", label: "Karabük Demir Çelik", city: "Karabük", lat: 41.20, lng: 32.63,
        desc: "Türkiye'nin ilk demir çelik fabrikasıdır (1937). Sanayileşmenin sembolüdür." },
      { emoji: "🏭", label: "Ereğli Demir Çelik", city: "Zonguldak", lat: 41.28, lng: 31.41,
        desc: "ERDEMİR Türkiye'nin en büyük çelik üreticisidir. Sanayinin temel ham maddesini sağlar." },
      { emoji: "🚢", label: "Samsun Limanı", city: "Samsun", lat: 41.29, lng: 36.34,
        desc: "Karadeniz'in en büyük limanlarındandır. İhracatta önemli rol oynar." },
      { emoji: "🛬", label: "Trabzon Havalimanı", city: "Trabzon", lat: 41.00, lng: 39.79,
        desc: "Karadeniz'in en yoğun havalimanıdır. Yurtdışı uçuşlarıyla bağlantı sağlar." },
      { emoji: "🏛️", label: "Sümela Manastırı", city: "Trabzon", lat: 40.69, lng: 39.66,
        desc: "Kayalara oyulmuş tarihi Hristiyan manastırıdır. Karadeniz'in turist çeken anıtıdır." },
      { emoji: "🏛️", label: "Safranbolu Evleri (UNESCO)", city: "Karabük", lat: 41.25, lng: 32.69,
        desc: "Geleneksel Osmanlı evleri ile UNESCO Dünya Mirası'dır. Açık hava müzesi gibidir." },
      { emoji: "⛷️", label: "Kartalkaya Kayak Merkezi", city: "Bolu", lat: 40.62, lng: 31.78,
        desc: "Bolu'daki popüler kayak merkezidir. Kış turizminde önemli yer tutar." },
      { emoji: "🌳", label: "Ayder Yaylası Turizmi", city: "Rize", lat: 40.95, lng: 41.10,
        desc: "Ünlü yayla turizm merkezidir. Kaplıcaları ve doğasıyla bilinir." },
    ],
    ege: [
      { emoji: "🏛️", label: "Efes Antik Kenti (UNESCO)", city: "İzmir", lat: 37.94, lng: 27.34,
        desc: "Antik dünyanın en görkemli şehirlerindendir. UNESCO Dünya Mirası listesindedir." },
      { emoji: "🏛️", label: "Bergama (UNESCO)", city: "İzmir", lat: 39.13, lng: 27.18,
        desc: "Helenistik dönemin önemli şehridir. Tıp tanrısı Asklepios'un tapınağı buradadır." },
      { emoji: "🏛️", label: "Pamukkale-Hierapolis (UNESCO)", city: "Denizli", lat: 37.92, lng: 29.12,
        desc: "Beyaz travertenleri ve antik şehri ile UNESCO Dünya Mirası'dır." },
      { emoji: "🚢", label: "Alsancak Limanı", city: "İzmir", lat: 38.45, lng: 27.15,
        desc: "Ege'nin en büyük limanıdır. İhracatın önemli kapısıdır." },
      { emoji: "🛬", label: "Adnan Menderes Havalimanı", city: "İzmir", lat: 38.29, lng: 27.16,
        desc: "Ege'nin merkez havalimanıdır. Yoğun yurtdışı trafiği vardır." },
      { emoji: "🏭", label: "Denizli Tekstil", city: "Denizli", lat: 37.78, lng: 29.09,
        desc: "Ev tekstili (havlu, bornoz) üretiminde dünya markası olmuştur. İhracat şampiyonudur." },
      { emoji: "🏖️", label: "Bodrum Turizmi", city: "Muğla", lat: 37.04, lng: 27.43,
        desc: "Mavi yolculuğun başlangıç noktasıdır. Halikarnas Mausoleionu burada bulunmuştur." },
      { emoji: "🏛️", label: "Truva (UNESCO)", city: "Çanakkale", lat: 39.96, lng: 26.24,
        desc: "Homeros'un İlyada destanına konu olan antik şehirdir. UNESCO Dünya Mirası'dır." },
    ],
    icanadolu: [
      { emoji: "🏛️", label: "Hattuşa (UNESCO)", city: "Çorum", lat: 40.02, lng: 34.62,
        desc: "Hitit İmparatorluğu'nun başkentidir. UNESCO Dünya Mirası listesindedir." },
      { emoji: "🏛️", label: "Çatalhöyük (UNESCO)", city: "Konya", lat: 37.67, lng: 32.83,
        desc: "Dünyanın bilinen en eski yerleşim yerlerindendir (9000 yıl). UNESCO listesindedir." },
      { emoji: "🏛️", label: "Anıtkabir", city: "Ankara", lat: 39.92, lng: 32.83,
        desc: "Atatürk'ün anıt mezarıdır. Cumhuriyet'in en önemli sembolüdür." },
      { emoji: "🏭", label: "Eskişehir Lokomotif Fabrikası", city: "Eskişehir", lat: 39.78, lng: 30.52,
        desc: "TÜLOMSAŞ Türkiye'nin tek lokomotif üreticisidir. Sanayinin önemli kalesidir." },
      { emoji: "🏭", label: "Kayseri Mobilya Sanayisi", city: "Kayseri", lat: 38.73, lng: 35.48,
        desc: "Türkiye mobilya üretiminin önemli merkezidir. Boydak, İstikbal markaları buradan çıkar." },
      { emoji: "🛬", label: "Esenboğa Havalimanı", city: "Ankara", lat: 40.13, lng: 32.99,
        desc: "Başkentin uluslararası havalimanıdır. Yoğun trafik kapasitesine sahiptir." },
      { emoji: "⛷️", label: "Erciyes Kayak Merkezi", city: "Kayseri", lat: 38.53, lng: 35.45,
        desc: "Türkiye'nin en modern kayak merkezlerindendir. Erciyes Dağı eteklerindedir." },
      { emoji: "🎈", label: "Kapadokya Turizmi (UNESCO)", city: "Nevşehir", lat: 38.65, lng: 34.83,
        desc: "Peri bacaları ve yer altı şehirleri ile UNESCO Dünya Mirası'dır. Balon turlarıyla ünlüdür." },
    ],
    akdeniz: [
      { emoji: "🏭", label: "Adana Tekstil Sanayi", city: "Adana", lat: 37.00, lng: 35.32,
        desc: "Çukurova pamuğunu işleyen büyük tekstil merkezidir. Türkiye sanayisinin önemli halkasıdır." },
      { emoji: "🏛️", label: "Aspendos Tiyatrosu", city: "Antalya", lat: 36.94, lng: 31.17,
        desc: "Roma'dan kalma muhteşem antik tiyatrodur. Hâlâ konser verilmektedir." },
      { emoji: "🏛️", label: "Likya Yolu", city: "Antalya", lat: 36.20, lng: 30.30,
        desc: "Antik Likya kentlerini birbirine bağlayan tarihi yürüyüş yoludur. 540 km uzunluğundadır." },
      { emoji: "🚢", label: "Mersin Limanı", city: "Mersin", lat: 36.79, lng: 34.62,
        desc: "Türkiye'nin en büyük konteyner limanlarındandır. Doğu Akdeniz ticaretinin merkezidir." },
      { emoji: "🛬", label: "Antalya Havalimanı", city: "Antalya", lat: 36.90, lng: 30.80,
        desc: "Türkiye'nin en yoğun turist havalimanıdır. Yıl boyu uçuş trafiği yoğundur." },
      { emoji: "🏖️", label: "Side Antik Kent ve Plajı", city: "Antalya", lat: 36.77, lng: 31.39,
        desc: "Antik kent ile plajın iç içe olduğu turistik merkezdir. Apollon Tapınağı ünlüdür." },
      { emoji: "⛷️", label: "Saklıkent Kayak Merkezi", city: "Antalya", lat: 36.80, lng: 30.32,
        desc: "Sabah denize, öğleden sonra kayağa imkan veren ilginç bölgedir. Toroslar'ın eteklerindedir." },
      { emoji: "🛣️", label: "TAG Otoyolu", city: "Adana", lat: 36.99, lng: 35.32,
        desc: "Tarsus-Adana-Gaziantep otoyolu, Doğu-Batı bağlantısının kalbidir. İhracat trafiğine hizmet eder." },
    ],
    doguanadolu: [
      { emoji: "🏛️", label: "Nemrut Dağı (UNESCO)", city: "Adıyaman", lat: 37.98, lng: 38.74,
        desc: "Kommagene Krallığı'nın dev heykelleriyle UNESCO Dünya Mirası'dır. Gün doğumu ünlüdür." },
      { emoji: "🏛️", label: "İshak Paşa Sarayı", city: "Ağrı", lat: 39.52, lng: 44.27,
        desc: "Doğubayazıt'taki 18. yy yapısı görkemli bir saraydır. Anadolu'nun son taş eseridir." },
      { emoji: "🏛️", label: "Akdamar Kilisesi", city: "Van", lat: 38.34, lng: 43.04,
        desc: "Van Gölü'ndeki adada 10. yy'dan kalan kilisedir. Taş kabartmalarıyla ünlüdür." },
      { emoji: "🏛️", label: "Erzurum Çifte Minareli Medrese", city: "Erzurum", lat: 39.91, lng: 41.27,
        desc: "Selçuklu mimarisinin başyapıtıdır. Tarihi taş işçiliği görülmeye değerdir." },
      { emoji: "⛷️", label: "Palandöken Kayak Merkezi", city: "Erzurum", lat: 39.86, lng: 41.27,
        desc: "Türkiye'nin en uzun pistlerine sahip kayak merkezidir. Olimpiyat seviyesindedir." },
      { emoji: "🛬", label: "Erzurum Havalimanı", city: "Erzurum", lat: 39.96, lng: 41.17,
        desc: "Doğu Anadolu'nun ana havalimanıdır. Kış turizmine hizmet verir." },
      { emoji: "🚂", label: "Doğu Ekspresi", city: "Kars", lat: 40.60, lng: 43.10,
        desc: "Ankara-Kars arasında işleyen tarihi tren hattıdır. Karlı manzaralarıyla ünlüdür." },
      { emoji: "🏭", label: "Elazığ Krom İşletmesi", city: "Elazığ", lat: 38.68, lng: 39.22,
        desc: "Etibakır işletmesi krom ve bakır üretir. Bölgenin önemli sanayisidir." },
    ],
    guneydogu: [
      { emoji: "🏛️", label: "Göbeklitepe (UNESCO)", city: "Şanlıurfa", lat: 37.22, lng: 38.92,
        desc: "12.000 yıl öncesine ait dünyanın en eski tapınağıdır. UNESCO Dünya Mirası'dır." },
      { emoji: "🏛️", label: "Diyarbakır Surları (UNESCO)", city: "Diyarbakır", lat: 37.91, lng: 40.22,
        desc: "Çin Seddi'nden sonra dünyanın en uzun sur sistemidir. UNESCO Dünya Mirası'dır." },
      { emoji: "🏛️", label: "Mardin Tarihi Kenti", city: "Mardin", lat: 37.31, lng: 40.74,
        desc: "Sarı taş evleri ve dini yapılarıyla açık hava müzesi gibidir. UNESCO geçici listesindedir." },
      { emoji: "🏛️", label: "Zeugma Mozaikleri", city: "Gaziantep", lat: 37.06, lng: 37.38,
        desc: "Gaziantep Müzesi'nde sergilenen Roma mozaikleridir. 'Çingene Kızı' dünyaca ünlüdür." },
      { emoji: "🏭", label: "Gaziantep Sanayi", city: "Gaziantep", lat: 37.07, lng: 37.38,
        desc: "Halı, makine halısı ve gıda sanayisinde Türkiye'nin önde gelen şehridir." },
      { emoji: "🛬", label: "Şanlıurfa GAP Havalimanı", city: "Şanlıurfa", lat: 37.45, lng: 38.90,
        desc: "GAP bölgesine hizmet veren havalimanıdır. Bölgesel turizmi destekler." },
      { emoji: "🚢", label: "Habur Sınır Kapısı", city: "Şırnak", lat: 37.24, lng: 42.45,
        desc: "Türkiye'nin Irak'a açılan en yoğun kara sınır kapısıdır. Ticarette kritik öneme sahiptir." },
      { emoji: "🛣️", label: "Nizip-Birecik Yolu", city: "Gaziantep", lat: 37.03, lng: 37.97,
        desc: "Güneydoğu'yu birbirine bağlayan ana yoldur. Tarihi ipek yolu güzergâhındadır." },
    ],
  },

  // ============================================================
  // 8. SINIF — Doğal Afet, Sürdürülebilirlik, Yenilenebilir Enerji
  // ============================================================
  8: {
    marmara: [
      { emoji: "⚠️", label: "1999 Gölcük Depremi", city: "Kocaeli", lat: 40.74, lng: 29.97,
        desc: "17 Ağustos 1999'da yaşanan büyük depremdir. Marmara'da yıkıma yol açmıştır." },
      { emoji: "⚠️", label: "Kuzey Anadolu Fayı", city: "Sakarya", lat: 40.78, lng: 30.40,
        desc: "Türkiye'nin en aktif fay hattıdır. Marmara depremi beklenen bölgede yer alır." },
      { emoji: "🌫️", label: "Müsilaj Kirliliği", city: "Marmara", lat: 40.65, lng: 28.20,
        desc: "Marmara Denizi'nde görülen 'deniz salyası'dır. Aşırı kirlilik ve ısınma sebep olur." },
      { emoji: "💨", label: "Bandırma Rüzgar Santrali", city: "Balıkesir", lat: 40.35, lng: 27.97,
        desc: "Bandırma çevresinde büyük rüzgar tarlaları bulunur. Yenilenebilir enerji üretir." },
      { emoji: "♻️", label: "İSTAÇ Geri Dönüşüm", city: "İstanbul", lat: 41.05, lng: 28.95,
        desc: "İstanbul'un atık yönetimini ve geri dönüşümünü yapan kuruluştur. Çevre dostudur." },
      { emoji: "☀️", label: "Çanakkale Güneş Santrali", city: "Çanakkale", lat: 40.15, lng: 26.41,
        desc: "Bölgede kurulan büyük güneş enerjisi santralleri yenilenebilir elektrik üretir." },
      { emoji: "🌳", label: "Belgrad Ormanı", city: "İstanbul", lat: 41.18, lng: 28.97,
        desc: "İstanbul'un akciğeridir. Doğal hayatı korur ve hava kirliliğini azaltır." },
      { emoji: "🚜", label: "Trakya Sürdürülebilir Tarım", city: "Edirne", lat: 41.50, lng: 26.80,
        desc: "Trakya ovasında çevre dostu tarım uygulamaları yaygınlaşmaktadır. Toprağı korur." },
    ],
    karadeniz: [
      { emoji: "⚠️", label: "Heyelan Riski", city: "Rize", lat: 41.02, lng: 40.52,
        desc: "Karadeniz'in dik yamaçları ve bol yağışı heyelana sebep olur. Sık karşılaşılan afettir." },
      { emoji: "⚠️", label: "Sel Felaketleri", city: "Giresun", lat: 40.91, lng: 38.39,
        desc: "Aşırı yağışlar sel ve taşkınlara yol açar. 2020 Giresun seli büyük zarar vermiştir." },
      { emoji: "💨", label: "Sinop Rüzgar Santrali", city: "Sinop", lat: 42.02, lng: 35.15,
        desc: "Karadeniz kıyılarındaki rüzgar enerjisi yatırımıdır. Temiz elektrik üretir." },
      { emoji: "💧", label: "HES (Hidroelektrik)", city: "Artvin", lat: 41.18, lng: 41.82,
        desc: "Çoruh Nehri üzerindeki hidroelektrik santralleri elektrik üretir. Yenilenebilir kaynaktır." },
      { emoji: "🌳", label: "Küre Dağları Milli Parkı", city: "Kastamonu", lat: 41.85, lng: 33.65,
        desc: "Avrupa'nın 100 sıcak orman noktasından biridir. Biyoçeşitliliği korur." },
      { emoji: "🌳", label: "Yeniköy Yangın Olayları", city: "Bolu", lat: 40.74, lng: 31.61,
        desc: "Yaz kuraklığında orman yangınları riski artar. Müdahale ekipleri hazırdır." },
      { emoji: "♻️", label: "Trabzon Atık Yönetimi", city: "Trabzon", lat: 41.00, lng: 39.72,
        desc: "Şehirde modern atık tesisi geri dönüşüm yapar. Çevreyi korumaya katkı sağlar." },
      { emoji: "🐟", label: "Hamsi Sürdürülebilir Avcılığı", city: "Samsun", lat: 41.29, lng: 36.34,
        desc: "Aşırı avlanma hamsi stoğunu tehdit eder. Av yasağı dönemleri uygulanır." },
    ],
    ege: [
      { emoji: "⚠️", label: "İzmir Depremi (2020)", city: "İzmir", lat: 38.39, lng: 26.79,
        desc: "30 Ekim 2020'de Seferihisar açıklarında yaşanan depremdir. Bayraklı'da yıkım olmuştur." },
      { emoji: "🔥", label: "Manavgat Yangını (2021)", city: "Antalya", lat: 36.79, lng: 31.44,
        desc: "Ege ve Akdeniz'de büyük orman yangınları yaşanmıştır. İklim değişikliği etkisidir." },
      { emoji: "💨", label: "Çeşme Rüzgar Santrali", city: "İzmir", lat: 38.32, lng: 26.30,
        desc: "Ege kıyılarındaki rüzgar Türkiye'nin en büyük rüzgar santrallerini besler." },
      { emoji: "♨️", label: "Aydın Jeotermal", city: "Aydın", lat: 37.85, lng: 28.05,
        desc: "Aydın ve Denizli Türkiye'nin jeotermal başkentidir. Sera ve ısınmada kullanılır." },
      { emoji: "☀️", label: "Karapınar Güneş", city: "Konya", lat: 37.71, lng: 33.55,
        desc: "Konya yakınında olsa da Ege bağlantılı; iç bölgelerden büyük güneş tarlasıdır." },
      { emoji: "🐢", label: "Caretta Caretta", city: "Muğla", lat: 36.81, lng: 28.62,
        desc: "İztuzu Plajı (Dalyan) deniz kaplumbağalarının yumurtlama alanıdır. Koruma altındadır." },
      { emoji: "🌊", label: "Ege Deniz Kirliliği", city: "İzmir", lat: 38.45, lng: 27.10,
        desc: "İzmir Körfezi atık ve liman trafiğinden etkilenir. Temizleme çalışmaları sürer." },
      { emoji: "🌳", label: "Dilek Yarımadası Milli Parkı", city: "Aydın", lat: 37.69, lng: 27.15,
        desc: "Doğal Akdeniz makilerini ve nadir hayvanları koruyan milli parktır." },
    ],
    icanadolu: [
      { emoji: "⚠️", label: "Tuz Gölü Kuruması", city: "Aksaray", lat: 38.78, lng: 33.38,
        desc: "İklim değişikliği ve aşırı su kullanımı Tuz Gölü'nü tehdit ediyor. Kuş ölümleri yaşanmıştır." },
      { emoji: "🔥", label: "Bozkır Yangını Riski", city: "Konya", lat: 37.87, lng: 32.49,
        desc: "Yaz kuraklığı bozkırda yangın riskini artırır. Tarım arazileri tehdit altındadır." },
      { emoji: "💨", label: "Sivas Rüzgar Santrali", city: "Sivas", lat: 39.75, lng: 37.02,
        desc: "İç Anadolu yüksek platolarında rüzgar enerjisi yatırımları artmaktadır. Temiz enerjidir." },
      { emoji: "☀️", label: "Karapınar Güneş Tarlası", city: "Konya", lat: 37.71, lng: 33.55,
        desc: "Türkiye'nin en büyük güneş enerjisi santrallerindendir. 1300 MW kapasitelidir." },
      { emoji: "♨️", label: "Kırşehir Jeotermal", city: "Kırşehir", lat: 39.15, lng: 34.16,
        desc: "Termal kaynaklarla seralarda üretim ve ısıtma yapılır. Yenilenebilir enerjidir." },
      { emoji: "💧", label: "Kuraklık ve Kuyular", city: "Konya", lat: 37.87, lng: 32.49,
        desc: "Konya Ovası'nda yer altı suyu hızla azalıyor, obruklar oluşuyor. Sürdürülebilir tarım gerekli." },
      { emoji: "🕳️", label: "Konya Obrukları", city: "Konya", lat: 37.40, lng: 32.66,
        desc: "Yer altı suyunun azalması ile büyük çukurlar oluşuyor. Karapınar çevresinde sıktır." },
      { emoji: "🌳", label: "Salda Gölü Koruma", city: "Aksaray", lat: 38.43, lng: 34.32,
        desc: "İç Anadolu'nun nadir göllerinden Acıgöl ve çevresi koruma altındadır. Flamingoları barındırır." },
    ],
    akdeniz: [
      { emoji: "🔥", label: "Manavgat Orman Yangını", city: "Antalya", lat: 36.79, lng: 31.44,
        desc: "2021 yazındaki büyük yangın binlerce hektar ormanı yok etti. İklim krizinin habercisidir." },
      { emoji: "🔥", label: "Marmaris Yangını", city: "Muğla", lat: 36.85, lng: 28.27,
        desc: "Akdeniz kıyılarında sıcak ve kuru hava yangınları artırır. Koruma çalışmaları yoğunlaşmıştır." },
      { emoji: "⚠️", label: "Doğu Anadolu Fayı", city: "Hatay", lat: 36.20, lng: 36.16,
        desc: "6 Şubat 2023 depremlerinin merkez üssü çevresidir. DAF üzerinde yaşanan büyük afettir." },
      { emoji: "💨", label: "Belen Rüzgar Santrali", city: "Hatay", lat: 36.49, lng: 36.20,
        desc: "Hatay Belen'de büyük rüzgar enerjisi tesisleri vardır. Bölgenin elektrik ihtiyacını karşılar." },
      { emoji: "☀️", label: "Antalya Güneş Enerjisi", city: "Antalya", lat: 36.90, lng: 30.71,
        desc: "Yıl boyu güneşli olan Antalya'da güneş paneli yatırımları büyür. Çatı GES'leri yaygındır." },
      { emoji: "🐢", label: "Caretta Caretta Koruma", city: "Antalya", lat: 36.27, lng: 30.50,
        desc: "Belek ve Patara plajları kaplumbağa yumurta alanlarıdır. Geceleri ışık yasağı vardır." },
      { emoji: "🌊", label: "Akdeniz Foku", city: "Antalya", lat: 36.21, lng: 29.78,
        desc: "Nesli tükenmek üzere olan Akdeniz fokları Foça ve Kaş'ta görülür. Koruma altındadır." },
      { emoji: "💧", label: "Su Kıtlığı", city: "Adana", lat: 36.99, lng: 35.32,
        desc: "Akdeniz bölgesi kuraklık baskısı altında. Damla sulama sürdürülebilirlik için yaygınlaşıyor." },
    ],
    doguanadolu: [
      { emoji: "⚠️", label: "Van Depremi (2011)", city: "Van", lat: 38.73, lng: 43.45,
        desc: "23 Ekim 2011'de yaşanan büyük depremdir. Erciş'te ağır hasara yol açmıştır." },
      { emoji: "⚠️", label: "Doğu Anadolu Fayı", city: "Elazığ", lat: 38.68, lng: 39.22,
        desc: "DAF, Türkiye'nin diğer büyük fay hattıdır. 2020 Elazığ depreminin nedeni olmuştur." },
      { emoji: "🌨️", label: "Çığ Tehlikesi", city: "Bitlis", lat: 38.40, lng: 42.10,
        desc: "Yüksek dağlık alanlarda kar birikmesiyle çığlar oluşur. Yolları kapatabilir." },
      { emoji: "💨", label: "Kars Rüzgar Santrali", city: "Kars", lat: 40.60, lng: 43.10,
        desc: "Yüksek plato rüzgar enerjisine elverişlidir. Doğu'da yenilenebilir enerji yatırımı yapılır." },
      { emoji: "💧", label: "Keban Barajı", city: "Elazığ", lat: 38.81, lng: 38.75,
        desc: "Türkiye'nin en büyük barajlarındandır. Hidroelektrik üretir, Fırat üzerindedir." },
      { emoji: "💧", label: "Karakaya Barajı", city: "Diyarbakır", lat: 38.23, lng: 39.16,
        desc: "Fırat üzerindeki büyük HES'tir. Yenilenebilir elektrik üretir." },
      { emoji: "🌳", label: "Munzur Milli Parkı", city: "Tunceli", lat: 39.20, lng: 39.43,
        desc: "Endemik bitkileriyle koruma altındaki milli parktır. Munzur Vadisi eşsizdir." },
      { emoji: "❄️", label: "Aşırı Soğuk", city: "Erzurum", lat: 39.90, lng: 41.27,
        desc: "Doğu Anadolu kışları çok soğuktur. -30°C'ye inebilir, donma riski yüksektir." },
    ],
    guneydogu: [
      { emoji: "⚠️", label: "Kahramanmaraş Depremi (2023)", city: "Kahramanmaraş", lat: 37.58, lng: 36.93,
        desc: "6 Şubat 2023'te yaşanan asrın felaketidir. 11 ili etkileyen büyük afettir." },
      { emoji: "⚠️", label: "DAF (Doğu Anadolu Fayı)", city: "Adıyaman", lat: 37.76, lng: 38.28,
        desc: "Güneydoğu'yu boylu boyunca geçen aktif fay hattıdır. 2023 depremlerinin nedenidir." },
      { emoji: "🔥", label: "Sıcak Dalgası", city: "Şanlıurfa", lat: 37.16, lng: 38.79,
        desc: "Yazları 45°C'yi aşan sıcaklık görülür. İklim değişikliği etkisi şiddetlenmektedir." },
      { emoji: "💧", label: "Atatürk Barajı (HES)", city: "Şanlıurfa", lat: 37.48, lng: 38.32,
        desc: "Türkiye'nin en büyük HES'idir. GAP'ın temelidir, tarım ve elektrik için kritiktir." },
      { emoji: "☀️", label: "Şanlıurfa Güneş Enerjisi", city: "Şanlıurfa", lat: 37.16, lng: 38.79,
        desc: "Türkiye'nin en çok güneş alan ilidir. Büyük GES yatırımları yapılır." },
      { emoji: "💨", label: "Gaziantep Rüzgar", city: "Gaziantep", lat: 37.07, lng: 37.38,
        desc: "Bölgede rüzgar enerjisi tesisleri kurulmaktadır. Yenilenebilir enerji çeşitlenir." },
      { emoji: "🌳", label: "Hasankeyf-Ilısu Etkisi", city: "Batman", lat: 37.71, lng: 41.41,
        desc: "Ilısu Barajı tarihi Hasankeyf'i sular altında bıraktı. Çevresel ve kültürel tartışma yaratmıştır." },
      { emoji: "💧", label: "Kuraklık ve GAP", city: "Diyarbakır", lat: 37.91, lng: 40.22,
        desc: "Bölgede kuraklık riski sürdürülebilir tarımı zorunlu kılar. GAP suyu verimli kullanılmalıdır." },
    ],
  },
};

Object.assign(window, { REGION_TOPIC_ICONS_GRADED });
/* Sınıfa göre topic icons döndüren helper. */
const getTopicIconsForRegion = (regionId) => {
  let grade = 5;
  try {
    const raw = localStorage.getItem("tk_state");
    if (raw) {
      const g = parseInt(JSON.parse(raw).grade, 10);
      if (g >= 5 && g <= 8) grade = g;
    }
  } catch(e) {}
  const set = (window.REGION_TOPIC_ICONS_GRADED || {})[grade] ||
              (window.REGION_TOPIC_ICONS_GRADED || {})[5];
  if (set && set[regionId]) return set[regionId];
  // Fallback to legacy flat REGION_TOPIC_ICONS
  return (window.REGION_TOPIC_ICONS && window.REGION_TOPIC_ICONS[regionId]) || [];
};
Object.assign(window, { getTopicIconsForRegion });




/* ====== Bölge temalı ikonlar — küçük noktalar, tıklanınca açıklamalı popup ======
   Her bölgede 8 ikon; doğru cevap arttıkça aşamalı belirir.
   correct=1 → ~1/3, correct=2 → ~2/3, correct=3 (done) → tümü görünür. */
const REGION_TOPIC_ICONS = {
  marmara: [
    { emoji: "🌉", label: "Boğaz Köprüsü",     city: "İstanbul",   lat: 41.04, lng: 29.03,
      desc: "Asya ve Avrupa'yı birbirine bağlayan ünlü asma köprü, 1973'te açıldı." },
    { emoji: "🕌", label: "Ayasofya",          city: "İstanbul",   lat: 41.01, lng: 28.98,
      desc: "Bizans'tan Osmanlı'ya, kilise-cami-müze-cami olarak hizmet veren mimari şaheser." },
    { emoji: "🏰", label: "Topkapı Sarayı",    city: "İstanbul",   lat: 41.01, lng: 28.98,
      desc: "Osmanlı padişahlarının 400 yıl yaşadığı saray, UNESCO Dünya Mirası." },
    { emoji: "🏭", label: "Bursa Sanayisi",    city: "Bursa",      lat: 40.20, lng: 29.07,
      desc: "Otomotiv (TOFAŞ) ve tekstil sanayisinin Türkiye merkezi." },
    { emoji: "⚓", label: "Çanakkale Boğazı",  city: "Çanakkale",  lat: 40.15, lng: 26.41,
      desc: "Marmara ve Ege'yi bağlayan stratejik geçit; Çanakkale Zaferi'nin yeri." },
    { emoji: "🌷", label: "Selimiye Camii",    city: "Edirne",     lat: 41.68, lng: 26.56,
      desc: "Mimar Sinan'ın 'ustalık eserim' dediği cami, UNESCO Dünya Mirası." },
    { emoji: "🚢", label: "Galata Kulesi",     city: "İstanbul",   lat: 41.03, lng: 28.97,
      desc: "Ortaçağ'dan kalma taş kule, İstanbul'un en bilinen simgelerinden." },
    { emoji: "🛍️", label: "Kapalıçarşı",       city: "İstanbul",   lat: 41.01, lng: 28.97,
      desc: "Dünyanın en eski ve en büyük kapalı çarşılarından, 600 yıllık." },
    { emoji: "⛷️", label: "Uludağ",            city: "Bursa",      lat: 40.10, lng: 29.22,
      desc: "Marmara'nın en yüksek dağı (2543m), kayak ve doğa turizmi merkezi." },
    { emoji: "🛬", label: "İstanbul Havalimanı", city: "İstanbul", lat: 41.27, lng: 28.74,
      desc: "Dünyanın en büyük terminallerinden, uluslararası ulaşım merkezi." },
    { emoji: "🌊", label: "Marmara Denizi",    city: "Marmara",    lat: 40.65, lng: 28.20,
      desc: "Türkiye'ye ait olan iç deniz; Karadeniz ve Ege arasında köprü." },
    { emoji: "⚠️", label: "Deprem Riski",      city: "Kocaeli",    lat: 40.74, lng: 29.97,
      desc: "Kuzey Anadolu Fayı boyunca; 1999 Marmara depremi büyük yıkıma yol açtı." },
  ],
  karadeniz: [
    { emoji: "🍃", label: "Çay Tarlaları",     city: "Rize",       lat: 41.02, lng: 40.52,
      desc: "Türkiye çay üretiminin %95'i Rize ve çevresinde, yağışlı iklim sayesinde." },
    { emoji: "🥜", label: "Fındık",            city: "Giresun",    lat: 40.92, lng: 38.39,
      desc: "Türkiye dünya fındık üretiminin %75'ini sağlar, ihracat şampiyonu." },
    { emoji: "🌳", label: "Yağmur Ormanları",  city: "Trabzon",    lat: 40.99, lng: 39.78,
      desc: "Bol yağış nedeniyle Türkiye'nin en gür ve geniş orman alanları." },
    { emoji: "🏔️", label: "Kaçkar Dağları",    city: "Rize-Artvin", lat: 40.83, lng: 41.15,
      desc: "Doğu Karadeniz'in 3937m'ye ulaşan heybetli sıradağları, dağcılık merkezi." },
    { emoji: "🐟", label: "Hamsi",             city: "Karadeniz",  lat: 41.30, lng: 36.33,
      desc: "Karadeniz'in simge balığı; hamsili pilav ve hamsi tava ile ünlü." },
    { emoji: "🎻", label: "Kemençe & Horon",   city: "Trabzon",    lat: 41.00, lng: 39.72,
      desc: "Karadeniz'in halk müziği aleti kemençe ve hareketli horon halk oyunu." },
    { emoji: "🌧️", label: "Bol Yağış",         city: "Rize",       lat: 41.02, lng: 40.52,
      desc: "Yıllık 2200mm yağışla Türkiye'nin en yağışlı şehri." },
    { emoji: "🌽", label: "Mısır",             city: "Samsun",     lat: 41.29, lng: 36.33,
      desc: "Bölgenin temel tahıl ürünü; mısır ekmeği yöresel mutfağın simgesi." },
    { emoji: "⛪", label: "Sümela Manastırı",  city: "Trabzon",    lat: 40.69, lng: 39.66,
      desc: "Kayalara oyulmuş Bizans manastırı, doğa ve mimari harikası." },
    { emoji: "🌲", label: "Yaylalar",          city: "Trabzon",    lat: 40.65, lng: 40.10,
      desc: "Ayder, Pokut, Sal yaylaları — yayla turizminin merkezi." },
    { emoji: "🛂", label: "Sarp Sınır Kapısı", city: "Artvin",     lat: 41.50, lng: 41.55,
      desc: "Gürcistan ile kara sınırı; Türkiye'nin doğuda en uç noktası." },
    { emoji: "⚠️", label: "Heyelan Riski",     city: "Rize",       lat: 41.02, lng: 40.50,
      desc: "Eğimli arazi + yoğun yağış = sık heyelan; ağaçlandırma ile mücadele." },
  ],
  ege: [
    { emoji: "🫒", label: "Zeytin",            city: "İzmir-Aydın", lat: 38.42, lng: 27.13,
      desc: "Türkiye zeytin üretiminin yarısından fazlası Ege'de yetiştirilir." },
    { emoji: "🏛️", label: "Efes Antik Kenti",  city: "Selçuk",     lat: 37.94, lng: 27.34,
      desc: "Antik Çağ'ın en önemli liman kentlerinden, UNESCO Dünya Mirası." },
    { emoji: "🍇", label: "Üzüm Bağları",      city: "Manisa",     lat: 38.61, lng: 27.43,
      desc: "Çekirdeksiz sultani üzümün anavatanı, kuru üzüm ihracat lideri." },
    { emoji: "🌊", label: "Pamukkale",         city: "Denizli",    lat: 37.92, lng: 29.12,
      desc: "Doğal beyaz traverten basamakları, UNESCO Dünya Mirası." },
    { emoji: "🍞", label: "İncir",             city: "Aydın",      lat: 37.85, lng: 27.85,
      desc: "Türkiye dünya kuru incir ihracatının lideri; ana üretim Aydın'da." },
    { emoji: "⛪", label: "Bergama (Pergamon)", city: "Bergama",   lat: 39.13, lng: 27.18,
      desc: "Antik Pergamon Krallığı'nın başkenti, UNESCO Dünya Mirası." },
    { emoji: "🌬️", label: "Yel Değirmenleri",  city: "Bodrum",     lat: 37.04, lng: 27.43,
      desc: "Ege rüzgarlarıyla çalışan tarihi yapılar, Bodrum sahillerinde sıralı." },
    { emoji: "🏖️", label: "Bodrum Kıyıları",   city: "Bodrum",     lat: 37.04, lng: 27.43,
      desc: "Mavi Yolculuk'un başlangıç noktası, girintili-çıkıntılı kıyılarıyla." },
    { emoji: "💨", label: "Rüzgar Türbinleri", city: "Çeşme",      lat: 38.32, lng: 26.31,
      desc: "Çeşme/Aliağa rüzgar santrali — yenilenebilir enerji üssü." },
    { emoji: "♨️", label: "Jeotermal",          city: "Denizli",    lat: 37.78, lng: 29.10,
      desc: "Türkiye jeotermal kapasitesinin büyük kısmı Ege'de; sera/ısıtma için." },
    { emoji: "🐡", label: "Su Ürünleri",       city: "Foça",       lat: 38.67, lng: 26.76,
      desc: "Ege kıyıları balıkçılık ve su ürünleri yetiştiriciliği için elverişli." },
    { emoji: "🛣️", label: "Kuşadası Limanı",   city: "Kuşadası",   lat: 37.86, lng: 27.26,
      desc: "Türkiye'nin en yoğun kruvaziyer turizm limanlarından." },
  ],
  icanadolu: [
    { emoji: "🌾", label: "Buğday",            city: "Konya",      lat: 37.87, lng: 32.49,
      desc: "Konya Ovası: Türkiye'nin tahıl ambarı, en çok buğday burada üretilir." },
    { emoji: "🏙️", label: "Ankara (Başkent)",  city: "Ankara",     lat: 39.93, lng: 32.86,
      desc: "Türkiye Cumhuriyeti'nin başkenti, Atatürk tarafından 1923'te seçildi." },
    { emoji: "🏔️", label: "Erciyes Dağı",     city: "Kayseri",    lat: 38.53, lng: 35.45,
      desc: "İç Anadolu'nun 3917m'lik volkanik dağı, önemli kayak merkezi." },
    { emoji: "🍃", label: "Kapadokya",         city: "Nevşehir",   lat: 38.65, lng: 34.83,
      desc: "Peri bacaları ve yer altı şehirleri ile UNESCO Dünya Mirası." },
    { emoji: "🐑", label: "Koyun & Keçi",      city: "Sivas",      lat: 39.75, lng: 37.02,
      desc: "Bozkır iklimi küçükbaş hayvancılığa elverişli; en çok burada yetişir." },
    { emoji: "⚱️", label: "Hattuşaş",          city: "Çorum",      lat: 40.02, lng: 34.62,
      desc: "Hitit İmparatorluğu'nun başkenti, UNESCO Dünya Mirası." },
    { emoji: "🧂", label: "Tuz Gölü",          city: "Aksaray",    lat: 38.75, lng: 33.38,
      desc: "Türkiye tuz üretiminin %70'ini karşılayan ikinci büyük göl." },
    { emoji: "🎨", label: "Mevlana Türbesi",   city: "Konya",      lat: 37.87, lng: 32.50,
      desc: "Mevlana Celaleddin Rumi'nin türbesi, semâ ve sufi gelenek merkezi." },
    { emoji: "🇹🇷", label: "Anıtkabir",         city: "Ankara",     lat: 39.92, lng: 32.84,
      desc: "Atatürk'ün anıt mezarı, Türkiye'nin manevi merkezi." },
    { emoji: "🗿", label: "Çatalhöyük",        city: "Konya",      lat: 37.67, lng: 32.83,
      desc: "Neolitik Çağ yerleşim yeri, dünyanın bilinen en eski şehirlerinden." },
    { emoji: "🎈", label: "Sıcak Hava Balonu", city: "Kapadokya",  lat: 38.62, lng: 34.81,
      desc: "Kapadokya semalarında dünyaca ünlü balon turları." },
    { emoji: "🌪️", label: "Erozyon Riski",     city: "Karapınar",  lat: 37.73, lng: 33.55,
      desc: "Bozkır arazide rüzgar erozyonu; ağaçlandırma ile mücadele edilir." },
  ],
  akdeniz: [
    { emoji: "🏖️", label: "Antalya Plajları",  city: "Antalya",    lat: 36.85, lng: 30.71,
      desc: "Türkiye'nin turizm başkenti; Konyaaltı ve Lara plajlarıyla ünlü." },
    { emoji: "🍊", label: "Turunçgiller",      city: "Adana",      lat: 36.99, lng: 35.32,
      desc: "Portakal, mandalin, limon — sıcak iklim sayesinde bol verim." },
    { emoji: "🌴", label: "Muz",               city: "Anamur",     lat: 36.07, lng: 32.83,
      desc: "Türkiye'de muz yetişen tek bölge; Anamur ve Alanya öne çıkar." },
    { emoji: "🏛️", label: "Aspendos Tiyatrosu", city: "Antalya",   lat: 36.93, lng: 31.17,
      desc: "Antik Roma tiyatrosu, akustiği günümüzde de mükemmel çalışır." },
    { emoji: "🏔️", label: "Toros Dağları",    city: "Antalya",    lat: 36.78, lng: 30.54,
      desc: "Akdeniz'i Anadolu'dan ayıran sıradağ; karstik şekiller bol." },
    { emoji: "🏞️", label: "Olympos",           city: "Antalya",    lat: 36.39, lng: 30.47,
      desc: "Yanartaş'ın doğal alevleri ile mistik antik kent." },
    { emoji: "🌊", label: "Mavi Bayrak",       city: "Antalya",    lat: 36.54, lng: 31.99,
      desc: "Türkiye dünyada en çok Mavi Bayraklı plaja sahip ülkelerden biri." },
    { emoji: "🍅", label: "Sera Tarımı",       city: "Antalya",    lat: 36.85, lng: 30.65,
      desc: "Yıl boyu domates, biber, salatalık üretimi; Avrupa'ya ihraç edilir." },
    { emoji: "🌅", label: "Ölüdeniz",          city: "Fethiye",    lat: 36.55, lng: 29.10,
      desc: "Lagünüyle dünya çapında ünlü plaj; yamaç paraşütü merkezi." },
    { emoji: "🐢", label: "Caretta Caretta",   city: "Patara",     lat: 36.27, lng: 29.32,
      desc: "Tehdit altındaki deniz kaplumbağalarının yumurta bıraktığı kumsal." },
    { emoji: "☀️", label: "Güneş Enerjisi",    city: "Antalya",    lat: 36.85, lng: 30.71,
      desc: "Türkiye'nin en yüksek güneşlenme süresi — solar enerji potansiyeli." },
    { emoji: "🔥", label: "Orman Yangını Riski", city: "Manavgat", lat: 36.78, lng: 31.45,
      desc: "İklim değişikliği etkisiyle artan yaz yangınları; mücadele kritik." },
  ],
  doguanadolu: [
    { emoji: "🏔️", label: "Ağrı Dağı",         city: "Ağrı",       lat: 39.70, lng: 44.30,
      desc: "Türkiye'nin en yüksek dağı, 5137m. Volkanik kökenli." },
    { emoji: "💧", label: "Van Gölü",          city: "Van",        lat: 38.65, lng: 43.00,
      desc: "Türkiye'nin en büyük gölü, sodyumlu suyu balıkçılık için elverişsiz." },
    { emoji: "🐂", label: "Büyükbaş Hayvancılık", city: "Erzurum", lat: 39.90, lng: 41.27,
      desc: "Geniş otlaklar ve serin iklim sayesinde sığır yetiştiriciliği yaygın." },
    { emoji: "❄️", label: "Palandöken",        city: "Erzurum",    lat: 39.85, lng: 41.27,
      desc: "Türkiye'nin en uzun pisti olan kayak merkezi (12 km)." },
    { emoji: "🐈", label: "Van Kedisi",        city: "Van",        lat: 38.50, lng: 43.40,
      desc: "İki gözü farklı renkte (gök-amber), suyu seven dünyaca ünlü kedi cinsi." },
    { emoji: "🧀", label: "Kars Kaşarı",       city: "Kars",       lat: 40.61, lng: 43.10,
      desc: "Bölgenin meşhur kaşar peyniri, coğrafi işaretli ürün." },
    { emoji: "🛕", label: "Akdamar Adası",     city: "Van",        lat: 38.34, lng: 43.04,
      desc: "Van Gölü'ndeki ada; 10. yüzyıldan kalma Akdamar Kilisesi." },
    { emoji: "🎯", label: "Yüksek Rakım",      city: "Erzurum",    lat: 39.90, lng: 41.27,
      desc: "Bölgenin ortalama yüksekliği 2000m; sert karasal iklim oluşturur." },
    { emoji: "🌋", label: "Nemrut Krater Gölü", city: "Bitlis",    lat: 38.63, lng: 42.23,
      desc: "Sönmüş volkanın krater içinde oluşmuş göl, eşsiz coğrafi olay." },
    { emoji: "🏛️", label: "İshak Paşa Sarayı", city: "Doğubayazıt", lat: 39.52, lng: 44.13,
      desc: "Geç Osmanlı dönemi sarayı, Doğu mimarisinin nadide örneği." },
    { emoji: "⚠️", label: "Deprem Riski",      city: "Elazığ",     lat: 38.78, lng: 39.41,
      desc: "Doğu Anadolu Fayı boyunca yüksek deprem riski; afet bilinci kritik." },
    { emoji: "🦌", label: "Sarıkamış Yaban Hayatı", city: "Kars", lat: 40.32, lng: 42.58,
      desc: "Kars'ın geyik ve sarıkamış çamı ormanları; Avrupa'nın yegane sarıçamları." },
  ],
  guneydogu: [
    { emoji: "🌱", label: "Pamuk",             city: "Şanlıurfa",  lat: 37.16, lng: 38.79,
      desc: "GAP sayesinde Türkiye'nin pamuk üretim merkezi haline geldi." },
    { emoji: "🏞️", label: "Atatürk Barajı",    city: "Şanlıurfa",  lat: 37.48, lng: 38.32,
      desc: "Türkiye'nin en büyük barajı, GAP projesinin kalbi; Fırat üzerinde." },
    { emoji: "🛕", label: "Göbeklitepe",       city: "Şanlıurfa",  lat: 37.22, lng: 38.92,
      desc: "12.000 yıllık tapınak, dünyanın bilinen en eski mabedi (UNESCO)." },
    { emoji: "⛰️", label: "Nemrut Dağı",       city: "Adıyaman",   lat: 37.98, lng: 38.74,
      desc: "Antik Kommagene Krallığı'nın dev tanrı heykelleri, UNESCO Dünya Mirası." },
    { emoji: "🥜", label: "Antep Fıstığı",     city: "Gaziantep",  lat: 37.07, lng: 37.38,
      desc: "Dünyaca ünlü Antep fıstığı, coğrafi işaretli; baklavanın olmazsa olmazı." },
    { emoji: "🍮", label: "Antep Baklavası",   city: "Gaziantep",  lat: 37.07, lng: 37.38,
      desc: "UNESCO Yaratıcı Şehirler Ağı'nda Gaziantep — gastronomi şehri." },
    { emoji: "💎", label: "Mardin Taş Evleri", city: "Mardin",     lat: 37.31, lng: 40.74,
      desc: "Sarımsı kireç taşıyla yapılmış geleneksel mimari, açık hava müzesi." },
    { emoji: "☀️", label: "Sıcak İklim",       city: "Diyarbakır", lat: 37.92, lng: 40.23,
      desc: "Türkiye'nin en sıcak yazları (40°C+) burada yaşanır; karasal." },
    { emoji: "🛢️", label: "Petrol",            city: "Batman",     lat: 37.89, lng: 41.13,
      desc: "Türkiye'nin başlıca petrol üretim sahalarından biri." },
    { emoji: "🏛️", label: "Diyarbakır Surları", city: "Diyarbakır", lat: 37.92, lng: 40.23,
      desc: "5 km uzunluğundaki tarihi surlar, UNESCO Dünya Mirası." },
    { emoji: "🌊", label: "Halfeti",           city: "Şanlıurfa",  lat: 37.25, lng: 37.87,
      desc: "Birecik Barajı sularıyla yarısı sular altında kalan kasaba; siyah gül." },
    { emoji: "🌾", label: "Sulu Tarım (GAP)",  city: "Diyarbakır", lat: 37.92, lng: 40.23,
      desc: "GAP sulamasıyla yıl boyu sulu tarım — pamuk, mısır, sebze." },
  ],
};

/* Inject one-time CSS for topic icon animation */
(function injectTopicIconCSS() {
  if (typeof document === 'undefined' || document.getElementById('tk-topic-icon-css')) return;
  const s = document.createElement('style');
  s.id = 'tk-topic-icon-css';
  s.textContent = `

    @keyframes tk-cluster-pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(1.08); }
    }
    .tk-cluster-badge {
      width: 22px; height: 22px;
      border-radius: 50%;
      border: 2px solid #FAF6EC;
      box-shadow: 0 1px 4px rgba(62,39,35,.4);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Quicksand', system-ui, sans-serif;
      color: #FFF7EB;
      font-weight: 700;
      font-size: 11px;
      line-height: 1;
      cursor: pointer;
      animation: tk-cluster-pulse 2.4s ease-in-out infinite;
      text-shadow: 0 1px 1px rgba(0,0,0,.35);
    }
    .tk-cluster-divicon { background: transparent; border: none; }
    @keyframes tk-dot-pop {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.35); opacity: 1; }
      100% { transform: scale(1);    opacity: 1; }
    }
    .tk-region-dot {
      animation: tk-dot-pop 500ms cubic-bezier(.34, 1.56, .64, 1);
      cursor: pointer !important;
    }
    .tk-region-dot:hover .tk-dot-circle { transform: scale(1.4); }
    .tk-dot-circle {
      transition: transform .15s ease-out;
    }
    .tk-region-popup .leaflet-popup-content-wrapper {
      background: var(--bg-cream);
      border-radius: 14px;
      box-shadow: 0 8px 28px rgba(62,39,35,.25);
      border: 1.5px solid var(--rule);
    }
    .tk-region-popup .leaflet-popup-content {
      margin: 12px 16px;
      font-family: var(--font-body);
    }
    .tk-region-popup .leaflet-popup-tip {
      background: var(--bg-cream);
    }
    @media (prefers-reduced-motion: reduce) {
      .tk-region-dot { animation: none; }
      .tk-region-dot:hover .tk-dot-circle { transform: none; }
    }
  `;
  document.head.appendChild(s);
})();

const TurkeyMap = ({
  progress = {},
  hoverable = true,
  onRegionClick = null,
  decorative = false,
  mapSrc, /* legacy, unused with Leaflet */
  selectableRegions = null,
  highlightRegion = null,
  height = 420,
}) => {
  const containerRef = useRefLib(null);
  const mapRef = useRefLib(null);
  const layerRef = useRefLib(null);
  const markersRef = useRefLib([]);
  const topicMarkersRef = useRefLib([]);
  const topicClusterRef = useRefLib(null);
  const propsRef = useRefLib({ progress, onRegionClick, selectableRegions, hoverable });
  const [hovered, setHovered] = useStateLib(null);

  useEffectLib(() => {
    propsRef.current = { progress, onRegionClick, selectableRegions, hoverable };
  });

  const computeStyle = (feature) => {
    const region = feature.properties.region;
    const status = progress[region] || "open";
    const isHL = highlightRegion === region || hovered === region;
    const isSel = !selectableRegions || selectableRegions.indexOf(region) !== -1;
    const fill = REGION_FILL_COLORS[region] || "#888";
    // Tamamlanan bölgeler: kalemle çizilmiş gibi koyu, kalın çerçeve (yeşil ✓ yerine)
    if (status === "done") {
      return {
        fillColor: fill,
        weight: isHL ? 1.1 : 0.9,
        color: "rgba(40,30,25,0.55)",
        opacity: isHL ? 0.75 : 0.6,
        fillOpacity: isHL ? 0.7 : 0.6,
      };
    }
    // Kilitli bölgeler de kendi pastel renklerini korur, sadece daha soluk + kilit ikonu durumu gösterir
    if (status === "locked") {
      return {
        fillColor: fill,
        weight: isHL ? 0.8 : 0.3,
        color: isHL ? "rgba(40,30,25,0.4)" : "rgba(255,255,255,0.35)",
        fillOpacity: isHL ? 0.55 : 0.42,
      };
    }
    // Mission mode'unda seçilemeyen bölgeler: gri
    if (!isSel) {
      return { fillColor: "#cfcfcf", weight: 0.3, color: "#888", fillOpacity: 0.35 };
    }
    return {
      fillColor: fill,
      weight: isHL ? 0.9 : 0.3,
      color: isHL ? "rgba(40,30,25,0.5)" : "rgba(255,255,255,0.35)",
      fillOpacity: isHL ? 0.75 : 0.6,
    };
  };

  const refreshTopicMarkers = () => {
    if (!mapRef.current || !window.L) return;
    // Clean previous
    if (topicClusterRef.current) {
      try { mapRef.current.removeLayer(topicClusterRef.current); } catch(e){}
      topicClusterRef.current = null;
    }
    topicMarkersRef.current = [];

    let regionsProgress = {};
    try { const raw = localStorage.getItem('tk_state'); if (raw) regionsProgress = (JSON.parse(raw).regionsProgress) || {}; } catch(e) {}

    // Cluster group with custom badge + click handler
    const cluster = window.L.markerClusterGroup({
      maxClusterRadius: 18,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      spiderfyOnMaxZoom: false,
      animate: true,
      iconCreateFunction: (c) => {
        const count = c.getChildCount();
        // Pick the dominant region color among children
        let regionColor = "var(--accent)";
        const children = c.getAllChildMarkers();
        if (children.length && children[0].options && children[0].options._tkRegion) {
          regionColor = REGION_FILL_COLORS[children[0].options._tkRegion] || "var(--accent)";
        }
        const html = '<div class="tk-cluster-badge" style="background:' + regionColor + '">' + count + '</div>';
        return window.L.divIcon({ html, className: 'tk-cluster-divicon', iconSize: [24, 24], iconAnchor: [12, 12] });
      },
    });

    cluster.on('clusterclick', (e) => {
      const childMarkers = e.layer.getAllChildMarkers();
      const items = childMarkers.map(m => m.options && m.options._tkData).filter(Boolean);
      if (!items.length) return;
      const header = '<div style="font-family:var(--font-display);font-size:18px;color:var(--title);margin-bottom:10px;text-align:center;border-bottom:1.5px dashed var(--rule);padding-bottom:8px">📍 Bu yakınlıkta ' + items.length + ' yer</div>';
      const list = items.map(it => {
        const regColor = REGION_FILL_COLORS[it.region] || "var(--accent)";
        return '<div style="display:flex;gap:10px;padding:9px 10px;background:var(--bg-paper);border-radius:8px;margin-bottom:5px;border-left:3px solid ' + regColor + '">' +
          '<div style="font-size:24px;flex-shrink:0;line-height:1.2">' + it.emoji + '</div>' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-family:var(--font-hand);font-weight:700;font-size:14px;color:var(--title);line-height:1.15;margin-bottom:1px">' + it.label + '</div>' +
            '<div style="font-size:9px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">📍 ' + it.city + '</div>' +
            '<div style="font-size:11px;line-height:1.35;color:var(--ink-soft)">' + it.desc + '</div>' +
          '</div>' +
        '</div>';
      }).join('');
      const html = '<div style="min-width:250px;max-width:300px;max-height:320px;overflow-y:auto">' + header + list + '</div>';
      window.L.popup({ className: 'tk-region-popup', maxWidth: 320, autoPan: true })
        .setLatLng(e.layer.getLatLng())
        .setContent(html)
        .openOn(e.target._map);
    });

    Object.entries(REGION_TOPIC_ICONS).forEach(([region, _legacy]) => {
      const icons = (window.getTopicIconsForRegion ? window.getTopicIconsForRegion(region) : _legacy) || [];
      const data = regionsProgress[region] || {};
      const correctCount = ((data.missions || []).filter(m => m && m.correct)).length;
      const total = icons.length;
      const visible = correctCount === 0 ? 0 :
                      correctCount >= 3 ? total :
                      Math.max(1, Math.ceil(total * correctCount / 3));
      const fillColor = REGION_FILL_COLORS[region] || "#888";
      for (let i = 0; i < visible; i++) {
        const ic = icons[i];
        const html = '<div class="tk-region-dot"><div class="tk-dot-circle" style="width:13px;height:13px;border-radius:50%;background:' + fillColor + ';border:2.5px solid #FAF6EC;box-shadow:0 1px 3px rgba(0,0,0,.45)"></div></div>';
        const lIcon = window.L.divIcon({ html, className: '', iconSize: [18, 18], iconAnchor: [9, 9] });
        const marker = window.L.marker([ic.lat, ic.lng], {
          icon: lIcon, interactive: true, riseOnHover: true,
          _tkData: { ...ic, region }, _tkRegion: region,
        });
        const popupHtml = '<div style="text-align:center;min-width:160px;max-width:220px">' +
          '<div style="font-size:42px;line-height:1;margin-bottom:6px">' + ic.emoji + '</div>' +
          '<div style="font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--title);line-height:1.1;margin-bottom:2px">' + ic.label + '</div>' +
          '<div style="font-family:var(--font-label);font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">📍 ' + ic.city + '</div>' +
          '<div style="font-size:13px;line-height:1.45;color:var(--ink-soft)">' + ic.desc + '</div>' +
          '</div>';
        marker.bindPopup(popupHtml, { className: 'tk-region-popup', maxWidth: 240, closeButton: true });
        marker.bindTooltip(ic.label, { permanent: false, direction: 'top', offset: [0, -8] });
        cluster.addLayer(marker);
        topicMarkersRef.current.push(marker);
      }
    });

    cluster.addTo(mapRef.current);
    topicClusterRef.current = cluster;
  };

  const refreshStatusMarkers = () => {
    if (!mapRef.current || !window.L) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    Object.entries(REGION_CENTERS).forEach(([region, center]) => {
      const status = progress[region] || "open";
      let html = null;
      if (status === "locked") {
        html = '<div style="background:#FAF6EC;color:#3E2723;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2.5px solid #3E2723;font-size:18px;box-shadow:0 2px 6px rgba(0,0,0,0.4)">🔒</div>';
      }
      if (!html) return;
      const icon = window.L.divIcon({ html, className: "", iconSize: [40, 40], iconAnchor: [20, 20] });
      const marker = window.L.marker(center, { icon, interactive: false, keyboard: false }).addTo(mapRef.current);
      markersRef.current.push(marker);
    });
  };

  useEffectLib(() => {
    if (mapRef.current || !containerRef.current) return;
    if (!window.L || !window.TURKEY_GEO) {
      console.warn("Leaflet veya TURKEY_GEO yüklenmedi");
      return;
    }
    const map = window.L.map(containerRef.current, {
      zoomControl: !decorative,
      dragging: !decorative,
      scrollWheelZoom: false,
      doubleClickZoom: !decorative,
      touchZoom: !decorative,
      boxZoom: !decorative,
      keyboard: !decorative,
      attributionControl: false,
      zoomSnap: 0.25,
    });
    window.L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
      maxZoom: 18, subdomains: "abcd",
    }).addTo(map);

    const layer = window.L.geoJSON(window.TURKEY_GEO, {
      style: computeStyle,
      onEachFeature: (feature, lyr) => {
        const region = feature.properties.region;
        const provName = feature.properties.name;
        lyr.bindTooltip(`${provName} · ${REGION_DISPLAY_NAMES[region] || region}`, {
          sticky: true, direction: "top", offset: [0, -8], className: "tk-tooltip",
        });
        lyr.on("click", () => {
          const p = propsRef.current;
          if (!p.onRegionClick) return;
          const status = (p.progress || {})[region] || "open";
          const isSel = !p.selectableRegions || p.selectableRegions.indexOf(region) !== -1;
          if (status === "locked" || !isSel) return;
          p.onRegionClick(region);
        });
        lyr.on("mouseover", () => {
          if (!propsRef.current.hoverable) return;
          setHovered(region);
        });
        lyr.on("mouseout", () => setHovered(null));
      },
    }).addTo(map);

    layerRef.current = layer;
    mapRef.current = map;
    map.fitBounds(layer.getBounds(), { paddingTopLeft: [4, 50], paddingBottomRight: [4, 4] });
    map.setZoom(map.getZoom() + 0.1, { animate: false });
    refreshStatusMarkers();
    refreshTopicMarkers();
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      markersRef.current = [];
      topicMarkersRef.current = [];
    };
  }, []);

  useEffectLib(() => {
    if (layerRef.current) layerRef.current.setStyle(computeStyle);
    refreshStatusMarkers();
    refreshTopicMarkers();
  });

  let cursorStyle = "default";
  if (hovered && onRegionClick) {
    const status = progress[hovered] || "open";
    const isSel = !selectableRegions || selectableRegions.indexOf(hovered) !== -1;
    cursorStyle = (status === "locked" || !isSel) ? "not-allowed" : "pointer";
  }
  const hoveredColor = hovered ? REGION_FILL_COLORS[hovered] : null;
  const hoveredName = hovered ? (REGION_DISPLAY_NAMES[hovered] || hovered) : null;
  const hoveredStatus = hovered ? (progress[hovered] || "open") : null;
  const hoveredSuffix = hoveredStatus === "locked" ? "  🔒" : (hoveredStatus === "done" ? "  ✓" : "");

  return (
    <div style={{
      position: "relative", width: "100%", height,
      borderRadius: 12, overflow: "hidden",
      border: "1.5px solid var(--rule)",
      boxShadow: "0 6px 14px rgba(62,39,35,.12)",
      background: "#E8EEF3",
    }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", cursor: cursorStyle }}/>
      {hovered && hoverable && (
        <div style={{
          position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 1000,
          background: "#FAF6EC", color: hoveredColor,
          padding: "6px 18px", borderRadius: 999,
          fontFamily: "Patrick Hand, cursive", fontWeight: 700, fontSize: 18,
          border: `2px solid ${hoveredColor}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          pointerEvents: "none",
        }}>
          {hoveredName}{hoveredSuffix}
        </div>
      )}
    </div>
  );
};

/* ========== ROZET ========== */
const Badge = ({ region, label, locked = false, size = 76, big = false, inner }) => {
  const r = REGIONS.find(x => x.id === region) || REGIONS[0];
  const innerSize = big ? size * 0.66 : size * 0.62;
  const innerContent = inner !== undefined ? inner : (locked ? "?" : r.badge);
  const innerFontSize = (typeof inner === "string" && inner.indexOf("/") !== -1)
    ? size * 0.32 : (big ? size * 0.42 : size * 0.4);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div className={"badge " + (locked ? "locked" : "")}
           style={{ width: size, height: size, background: locked ? undefined : r.color }}>
        {!locked && big && (
          <svg width={size + 30} height="20" viewBox="0 0 120 20" style={{ position: "absolute", top: size - 10 }}>
            <path d="M10 0 L0 18 L25 14 L60 18 L95 14 L120 18 L110 0 Z" fill="#C62828" stroke="#8B1C1C" strokeWidth="1"/>
          </svg>
        )}
        <div style={{
          width: innerSize, height: innerSize, borderRadius: "50%",
          background: "rgba(250,241,214,.22)",
          border: "2px dashed rgba(250,241,214,.6)",
          display: "grid", placeItems: "center",
          fontSize: innerFontSize,
          fontFamily: (typeof inner === "string" && inner.indexOf("/") !== -1) ? "var(--font-hand)" : "inherit",
          fontWeight: (typeof inner === "string" && inner.indexOf("/") !== -1) ? 700 : "normal",
          color: locked ? "var(--ink-soft)" : "#FFF7EB",
        }}>
          {innerContent}
        </div>
      </div>
      {label && (
        <div style={{ fontFamily: "var(--font-hand)", fontSize: big ? 18 : 13, color: locked ? "#8C7567" : "var(--title)", fontWeight: 700 }}>
          {label}
        </div>
      )}
    </div>
  );
};

/* ========== TopBar (with settings menu) ========== */
const TopBar = ({ name = "Maceracı", earned = 3, total = 7,
                  onChangeName, onExport, onAbout, onReset, onChantamClick, progressMap, onJourneyClick }) => {
  const [menuOpen, setMenuOpen] = useStateLib(false);
  const closeMenu = () => setMenuOpen(false);
  const handle = (fn) => () => { closeMenu(); fn && fn(); };
  const menuItems = [
    { icon: "✏️", label: "Adımı Değiştir", fn: onChangeName },
    { icon: "📥", label: "İlerlememi İndir (JSON)", fn: onExport },
    { icon: "ℹ️", label: "Hakkında", fn: onAbout },
    { icon: "🔄", label: "Yeniden Başla", fn: onReset, danger: true },
  ];
  return (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 22px",
    background: "linear-gradient(180deg, #FAF6EC 0%, #F1E9D2 100%)",
    borderBottom: "1.5px solid var(--rule)",
    boxShadow: "0 2px 6px rgba(62,39,35,.08)",
    fontFamily: "var(--font-body)",
  }}>
    <div onClick={() => onChantamClick && onChantamClick()}
         role="button" tabIndex={0}
         onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && onChantamClick) onChantamClick(); }}
         title="Performansını gör"
         style={{
           display: "flex", alignItems: "center", gap: 12,
           cursor: onChantamClick ? "pointer" : "default",
           padding: "4px 10px 4px 4px",
           borderRadius: 999,
           transition: "background .15s, transform .12s",
         }}
         onMouseEnter={(e) => { if (onChantamClick) e.currentTarget.style.background = "rgba(184,134,47,.12)"; }}
         onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
      <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--bg-cream)",
        border: "2px solid var(--gold)", display: "grid", placeItems: "center", fontSize: 22 }}>🎒</div>
      <div>
        <div className="t-label" style={{ fontSize: 11 }}>Çantam</div>
        <div style={{ fontFamily: "var(--font-hand)", fontSize: 20, fontWeight: 700, color: "var(--title)" }}>{name}</div>
      </div>
    </div>
    <div style={{ flex: 1 }}/>
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      {progressMap && (() => {
        const earnedCount = Object.keys(progressMap).filter(k => progressMap[k] === "done").length;
        const totalCount = (window.REGIONS || []).length;
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1, marginRight: 2 }}>
            <div className="t-label" style={{ fontSize: 10 }}>Rozetlerim</div>
            <div style={{
              fontFamily: "var(--font-hand)", fontSize: 16, fontWeight: 700, color: "var(--title)",
              lineHeight: 1,
            }}>
              <span style={{ color: "var(--accent)" }}>{earnedCount}</span>
              <span style={{ color: "var(--ink-mute)" }}>/{totalCount}</span>
            </div>
          </div>
        );
      })()}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {progressMap && (window.REGIONS || []).map(r => {
          const isDone = progressMap[r.id] === "done";
          const fill = (window.REGION_FILL_COLORS || {})[r.id] || "#888";
          return (
            <div key={r.id} title={r.name + (isDone ? " (kazanıldı)" : " (henüz açılmadı)")} style={{
              width: 32, height: 32, borderRadius: "50%",
              background: isDone ? fill : "var(--bg-cream)",
              border: "2px solid " + (isDone ? fill : "var(--ink-mute)"),
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: isDone ? 15 : 13,
              color: isDone ? "#FFF7EB" : "var(--ink-mute)",
              fontWeight: 700,
              boxShadow: isDone ? "0 1px 3px rgba(0,0,0,.2)" : "none",
              cursor: "default",
              transition: "all .2s",
              opacity: isDone ? 1 : 0.65,
            }}>
              {isDone ? r.badge : "?"}
            </div>
          );
        })}
      </div>
    </div>
    <div style={{ flex: 1 }}/>
    <button onClick={() => onJourneyClick && onJourneyClick()} title="Yolculuk Haritam" style={{
      padding: "6px 12px", marginRight: 8,
      borderRadius: 999,
      background: "var(--bg-cream)",
      border: "2px solid var(--ink-mute)",
      cursor: onJourneyClick ? "pointer" : "default",
      fontFamily: "var(--font-hand)",
      fontWeight: 700,
      fontSize: 14,
      color: "var(--title)",
      display: "flex",
      alignItems: "center",
      gap: 6,
      transition: "all .15s",
    }}
      onMouseEnter={(e) => { if (onJourneyClick) e.currentTarget.style.background = "rgba(184,134,47,.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-cream)"; }}>
      🛤️ Yolculuk Haritam
    </button>
    <div style={{ position: "relative" }}>
      <button onClick={() => setMenuOpen(o => !o)} style={{
        width: 42, height: 42, borderRadius: "50%",
        background: menuOpen ? "var(--accent)" : "var(--bg-cream)",
        color: menuOpen ? "#FFF7EB" : "inherit",
        border: "2px solid " + (menuOpen ? "var(--accent-ink)" : "var(--ink-mute)"),
        cursor: "pointer", fontSize: 18,
        transition: "all .15s",
      }} aria-label="Ayarlar">⚙️</button>
      {menuOpen && (
        <React.Fragment>
          <div onClick={closeMenu} style={{
            position: "fixed", inset: 0, zIndex: 9998, background: "transparent",
          }}/>
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 9999,
            background: "var(--bg-cream)", borderRadius: 12, padding: 6,
            boxShadow: "0 8px 28px rgba(62,39,35,.18), 0 0 0 1.5px var(--rule)",
            minWidth: 230,
          }}>
            {menuItems.map(item => (
              <button key={item.label} onClick={handle(item.fn)} style={{
                display: "flex", width: "100%", alignItems: "center", gap: 12,
                padding: "10px 14px", borderRadius: 8, border: "none",
                background: "transparent", cursor: "pointer", fontSize: 15,
                fontFamily: "var(--font-body)", textAlign: "left", fontWeight: 500,
                color: item.danger ? "var(--accent)" : "var(--ink)",
                transition: "background .12s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = item.danger ? "rgba(198,40,40,.08)" : "rgba(62,39,35,.06)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  </div>
  );
};

/* ========== Konfeti ========== */
const Confetti = ({ count = 30 }) => {
  const colors = ["#C62828", "#558B2F", "#F9A825", "#1976D2", "#FFA726", "#7CB342", "#B8862F"];
  return (
    <svg viewBox="0 0 800 600" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = (i * 53) % 800;
        const y = (i * 37) % 380 + 20;
        const c = colors[i % colors.length];
        const r = (i * 23) % 360;
        const w = 8 + (i % 4) * 2;
        const h = 4 + (i % 3) * 2;
        return <rect key={i} x={x} y={y} width={w} height={h} rx="1.5"
                     fill={c} transform={`rotate(${r} ${x + w/2} ${y + h/2})`} opacity=".9"/>;
      })}
    </svg>
  );
};

/* ========== TimerBar (M5 — Quiz için yatay süre çubuğu) ========== */
const TimerBar = ({ seconds = 15, onExpire, paused = false }) => {
  const [remaining, setRemaining] = useStateLib(seconds);

  useEffectLib(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffectLib(() => {
    if (paused) return;
    if (remaining <= 0) {
      if (typeof onExpire === 'function') onExpire();
      return;
    }
    const t = setTimeout(() => {
      setRemaining(r => Math.max(0, +(r - 0.1).toFixed(2)));
    }, 100);
    return () => clearTimeout(t);
  }, [remaining, paused]);

  const pct = Math.max(0, Math.min(100, (remaining / seconds) * 100));
  const half = seconds / 2;
  const quarter = seconds / 4;
  const labelColor = remaining <= quarter ? "var(--accent)" : (remaining <= half ? "#B8862F" : "var(--success)");
  const fillBg = remaining <= quarter
    ? "linear-gradient(90deg, #C62828 0%, #E53935 100%)"
    : (remaining <= half
        ? "linear-gradient(90deg, #F9A825 0%, #FFB300 100%)"
        : "linear-gradient(90deg, #558B2F 0%, #7CB342 100%)");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span className="t-label" style={{ fontSize: 11 }}>Kalan süre</span>
        <span style={{ fontFamily: "var(--font-hand)", fontSize: 18, color: labelColor, fontWeight: 700 }}>
          ⏱ {Math.ceil(remaining).toString().padStart(2, "0")} sn
        </span>
      </div>
      <div style={{
        height: 14, borderRadius: 999, background: "#E1D2AA", overflow: "hidden",
        border: "1.5px solid var(--rule)",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: fillBg,
          transition: "width 100ms linear, background 200ms ease",
        }}/>
      </div>
    </div>
  );
};

/* ========== Logo ========== */


/* ====== MEB Sosyal Bilgiler — Türkiye Coğrafyası Kazanımları ====== */
const KAZANIMLAR = {
  5: [
    { code: "SB.5.5.1", text: "Türkiye'nin 7 coğrafi bölgesini ve genel özelliklerini tanır.", region: "all" },
    { code: "SB.5.5.2", text: "Türkiye'nin coğrafi konumunu ve çevresindeki denizleri bilir.", region: "marmara" },
    { code: "SB.5.5.3", text: "Marmara Bölgesi'nin sanayi, ulaşım ve İstanbul'un önemini açıklar.", region: "marmara" },
    { code: "SB.5.5.4", text: "Karadeniz Bölgesi'nin yağışlı iklimi ve bitki örtüsünü tanır.", region: "karadeniz" },
    { code: "SB.5.5.5", text: "Akdeniz Bölgesi'nin iklim, turizm ve tarım özelliklerini açıklar.", region: "akdeniz" },
    { code: "SB.5.5.6", text: "Ege Bölgesi'nin tarım ürünleri ve girintili kıyısını anlatır.", region: "ege" },
    { code: "SB.5.5.7", text: "İç Anadolu'nun bozkır bitki örtüsü ve karasal iklimini bilir.", region: "icanadolu" },
    { code: "SB.5.5.8", text: "Doğu Anadolu'nun yüksek dağları ve hayvancılığını tanır.", region: "doguanadolu" },
    { code: "SB.5.5.9", text: "Güneydoğu Anadolu'nun pamuk üretimi ve GAP'ı bilir.", region: "guneydogu" },
    { code: "SB.5.6.1", text: "Bölgelerin yöresel yiyecek ve kültürel özelliklerini eşleştirir.", region: "all" },
    { code: "SB.5.6.2", text: "Türkiye'nin önemli şehirlerini bölgelere göre sınıflandırır.", region: "all" },
    { code: "SB.5.7.1", text: "Bölgelerin başlıca ekonomik faaliyetlerini ayırt eder.", region: "all" },
  ],
  6: [
    { code: "SB.6.4.1", text: "Türkiye'nin matematik konumunu (enlem-boylam) açıklar.", region: "all" },
    { code: "SB.6.4.2", text: "Marmara'nın stratejik konumu ve Boğazların önemini değerlendirir.", region: "marmara" },
    { code: "SB.6.4.3", text: "Karadeniz'in fiziki yapısı (Kuzey Anadolu Dağları) ve iklim ilişkisini açıklar.", region: "karadeniz" },
    { code: "SB.6.4.4", text: "Ege'nin kıyı oluşumu (kırıklı dağlar) ve girinti-çıkıntıları bilir.", region: "ege" },
    { code: "SB.6.4.5", text: "İç Anadolu'nun yer şekilleri (plato, ova) ve volkanik yapılarını tanır.", region: "icanadolu" },
    { code: "SB.6.4.6", text: "Akdeniz'de Toros Dağları ve karstik şekillerin oluşumunu açıklar.", region: "akdeniz" },
    { code: "SB.6.4.7", text: "Doğu Anadolu'nun yüksek dağları, Van Gölü ve volkanik yapısını bilir.", region: "doguanadolu" },
    { code: "SB.6.4.8", text: "Güneydoğu Anadolu'nun plato yapısı ve Fırat-Dicle havzasını tanır.", region: "guneydogu" },
    { code: "SB.6.5.1", text: "İklim çeşitleri (Akdeniz, Karadeniz, Karasal) ile bitki örtüsü ilişkisini kurar.", region: "all" },
    { code: "SB.6.5.2", text: "Türkiye'nin önemli akarsu ve göllerini sınıflandırır.", region: "all" },
    { code: "SB.6.6.1", text: "Tarım ürünleri ve hayvancılığın bölgesel dağılımını analiz eder.", region: "all" },
    { code: "SB.6.6.2", text: "Türkiye'nin başlıca madenlerini ve bulundukları bölgeleri sıralar.", region: "all" },
  ],
  7: [
    { code: "SB.7.5.1", text: "Türkiye'nin sanayi bölgelerini (özellikle Marmara) ve sektörlerini tanır.", region: "marmara" },
    { code: "SB.7.5.2", text: "Karadeniz'in turizm potansiyeli ve doğa turlarını açıklar.", region: "karadeniz" },
    { code: "SB.7.5.3", text: "Ege'nin antik kentleri (Efes, Bergama) ve UNESCO mirasını bilir.", region: "ege" },
    { code: "SB.7.5.4", text: "Akdeniz'in kıyı turizmi ve tarihi yerlerini sıralar.", region: "akdeniz" },
    { code: "SB.7.5.5", text: "İç Anadolu'nun başkent rolü, Kapadokya ve Hattusa mirasını açıklar.", region: "icanadolu" },
    { code: "SB.7.5.6", text: "Doğu Anadolu'nun kayak turizmi ve hayvancılığa dayalı sanayisini tanır.", region: "doguanadolu" },
    { code: "SB.7.5.7", text: "Güneydoğu Anadolu'nun GAP projesi ve tarımsal kalkınmasını değerlendirir.", region: "guneydogu" },
    { code: "SB.7.5.8", text: "Türkiye'deki ulaşım sistemlerini (kara, hava, deniz, demir) açıklar.", region: "all" },
    { code: "SB.7.6.1", text: "Köy-kent göçünün nedenlerini ve sosyal etkilerini sıralar.", region: "all" },
    { code: "SB.7.6.2", text: "Bölgeler arası ekonomik farklılıkları analiz eder.", region: "all" },
    { code: "SB.7.7.1", text: "Türkiye'nin UNESCO Dünya Mirası alanlarını coğrafyayla ilişkilendirir.", region: "all" },
    { code: "SB.7.7.2", text: "Bölgesel kültürel zenginliği ifade eder.", region: "all" },
  ],
  8: [
    { code: "SB.8.5.1", text: "Marmara'nın çevresel sorunları (deniz kirliliği, sanayi atığı) değerlendirir.", region: "marmara" },
    { code: "SB.8.5.2", text: "Karadeniz'de heyelan ve sel risklerini, mücadele yöntemlerini açıklar.", region: "karadeniz" },
    { code: "SB.8.5.3", text: "Ege'nin yenilenebilir enerji potansiyelini (rüzgar, jeotermal) tanır.", region: "ege" },
    { code: "SB.8.5.4", text: "Akdeniz'de iklim değişikliği etkileri ve kuraklığı analiz eder.", region: "akdeniz" },
    { code: "SB.8.5.5", text: "İç Anadolu'da erozyon ve toprak koruma yöntemlerini sıralar.", region: "icanadolu" },
    { code: "SB.8.5.6", text: "Doğu Anadolu'da deprem riski ve afet hazırlığını açıklar.", region: "doguanadolu" },
    { code: "SB.8.5.7", text: "Güneydoğu Anadolu'da GAP'ın sürdürülebilirlik etkilerini değerlendirir.", region: "guneydogu" },
    { code: "SB.8.6.1", text: "Türkiye'nin doğal afet türlerini ve risk haritasını analiz eder.", region: "all" },
    { code: "SB.8.6.2", text: "Yenilenebilir enerji kaynaklarını (güneş, rüzgar, jeotermal, su) bölgelerle eşleştirir.", region: "all" },
    { code: "SB.8.7.1", text: "Su havzalarını ve sürdürülebilir yönetimini açıklar.", region: "all" },
    { code: "SB.8.7.2", text: "Bölgesel kalkınma projelerinin (GAP, DAP, KOP) etkilerini karşılaştırır.", region: "all" },
    { code: "SB.8.7.3", text: "Türkiye'nin biyoçeşitliliğini ve milli parklarını tanır.", region: "all" },
  ],
};
Object.assign(window, { KAZANIMLAR });

/* ========== Çantam (BackpackModal) — Performans Dashboard ========== */
const BackpackModal = ({ progress, onClose }) => {
  if (!progress) return null;
  const REGIONS = window.REGIONS || [];
  const state = progress.state || {};
  const rp = state.regionsProgress || {};
  const playerName = state.playerName || "Maceracı";

  const startedAt = state.startedAt ? new Date(state.startedAt) : null;
  const elapsedMs = startedAt ? Date.now() - startedAt.getTime() : 0;
  const elapsedMin = Math.max(1, Math.round(elapsedMs / 60000));

  // Stats
  let totalAttempts = 0, totalCorrect = 0, totalMissionsCompleted = 0, totalMissionTimeMs = 0;
  Object.values(rp).forEach(r => {
    (r.missions || []).forEach(m => {
      if (!m) return;
      totalAttempts += (m.attempts || 0);
      if (m.correct) { totalCorrect += 1; totalMissionsCompleted += 1; }
      totalMissionTimeMs += (m.timeMs || 0);
    });
  });
  const accuracy = totalAttempts > 0 ? Math.round(totalCorrect / totalAttempts * 100) : 0;
  const earned = (typeof progress.earnedBadgeCount === "function") ? progress.earnedBadgeCount() : 0;

  // Region color palette
  const COLOR = {
    marmara: "#64B5F6", karadeniz: "#81C784", ege: "#AED581",
    icanadolu: "#FFE082", akdeniz: "#FFB74D",
    doguanadolu: "#B39DDB", guneydogu: "#EF9A9A",
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  };

  const StatCard = ({ icon, value, label, color }) => (
    <div style={{
      background: "var(--bg-paper)", borderRadius: 12, padding: "14px 12px",
      border: "1.5px solid var(--rule-soft)", textAlign: "center",
    }}>
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{
        fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700,
        color: color || "var(--title)", lineHeight: 1, marginTop: 4,
      }}>{value}</div>
      <div className="t-label" style={{ fontSize: 10, marginTop: 4 }}>{label}</div>
    </div>
  );

  const RegionRow = ({ region }) => {
    const status = (typeof progress.getRegionStatus === "function")
      ? progress.getRegionStatus(region.id) : "locked";
    const data = rp[region.id] || {};
    const missions = Array.isArray(data.missions) ? data.missions : [];
    const completedCount = missions.filter(m => m && m.correct).length;
    const attemptsTotal = missions.reduce((s, m) => s + (m && m.attempts || 0), 0);
    const timeMin = Math.round(missions.reduce((s, m) => s + (m && m.timeMs || 0), 0) / 60000);

    let detail = null;
    let statusBadge = null;
    if (status === "done") {
      statusBadge = <span style={{ color: "var(--success)", fontWeight: 700 }}>✓ Tamamlandı</span>;
      detail = `${completedCount}/3 görev · ${attemptsTotal} deneme${timeMin > 0 ? ` · ${timeMin} dk` : ""}`;
    } else if (status === "open") {
      if (completedCount > 0) {
        statusBadge = <span style={{ color: "var(--accent)", fontWeight: 700 }}>● Devam ediyor</span>;
        detail = `${completedCount}/3 görev tamamlandı`;
      } else {
        statusBadge = <span style={{ color: "var(--ink-soft)", fontWeight: 700 }}>○ Açık · henüz başlamadın</span>;
        detail = "Tıkla, keşfetmeye başla";
      }
    } else {
      statusBadge = <span style={{ color: "var(--ink-mute)", fontWeight: 700 }}>🔒 Kilitli</span>;
      detail = "Önce diğer bölgeleri tamamla";
    }

    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "12px 14px",
        background: "var(--bg-paper)",
        borderRadius: 10, marginBottom: 8,
        borderLeft: "5px solid " + (COLOR[region.id] || "#ccc"),
        boxShadow: "0 1px 2px rgba(62,39,35,.05)",
      }}>
        <div style={{ fontSize: 26 }}>{region.badge}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-hand)", fontSize: 20, fontWeight: 700, color: "var(--ink)",
          }}>{region.name}</div>
          <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>{detail}</div>
        </div>
        <div style={{ fontSize: 12, fontFamily: "var(--font-label)", textTransform: "uppercase", letterSpacing: ".06em" }}>
          {statusBadge}
        </div>
      </div>
    );
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9990,
      background: "rgba(62,39,35,.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div onClick={(e) => e.stopPropagation()} className="paper-cream" style={{
        width: "100%", maxWidth: 700, maxHeight: "90vh",
        borderRadius: 18, padding: 0, overflow: "hidden",
        border: "1.5px solid var(--rule)",
        boxShadow: "0 16px 48px rgba(0,0,0,.45)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 24px", borderBottom: "1.5px dashed var(--rule)",
          background: "linear-gradient(180deg, #FAF6EC 0%, #F1E9D2 100%)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 26 }}>🎒</span>
            <div>
              <div className="t-label" style={{ fontSize: 11 }}>Çantam</div>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 28, color: "var(--title)", lineHeight: 1,
              }}>Performansım</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "var(--bg-cream)", border: "1.5px solid var(--ink-mute)",
            cursor: "pointer", fontSize: 16, color: "var(--ink)",
          }} aria-label="Kapat">✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto" }}>
          {/* Player */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "14px 16px",
            background: "var(--bg-paper)",
            borderRadius: 12, border: "1.5px solid var(--rule-soft)",
            marginBottom: 18,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "var(--gold-soft)", border: "2px solid var(--gold)",
              display: "grid", placeItems: "center", fontSize: 28,
            }}>👤</div>
            <div style={{ flex: 1 }}>
              <div className="t-label" style={{ fontSize: 11 }}>Maceracı</div>
              <div style={{
                fontFamily: "var(--font-hand)", fontSize: 26, fontWeight: 700, color: "var(--title)", lineHeight: 1.1,
              }}>{playerName}</div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 2 }}>
                Başlangıç: {formatDate(startedAt)} · Süre: {elapsedMin} dk
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="t-label" style={{ fontSize: 11, marginBottom: 8 }}>Genel Durum</div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 22,
          }}>
            <StatCard icon="🏆" value={`${earned}/7`} label="Rozet" color="var(--accent)"/>
            <StatCard icon="📋" value={`${totalMissionsCompleted}/21`} label="Görev"/>
            <StatCard icon="⚡" value={`${accuracy}%`} label="Doğruluk" color="var(--success)"/>
            <StatCard icon="📝"
              value={state.quizScore !== null && state.quizScore !== undefined ? `${state.quizScore}/15` : "—"}
              label="Quiz"/>
          </div>

          {/* Per-region progress */}
          <div className="t-label" style={{ fontSize: 11, marginBottom: 8 }}>Bölge Bölge İlerleme</div>
          <div>
            {REGIONS.map(r => <RegionRow key={r.id} region={r}/>)}
          </div>

          {/* Kazanımlar (MEB Sosyal Bilgiler) */}
          {(() => {
            const KAZ = window.KAZANIMLAR || {};
            const grade = (state.grade && KAZ[state.grade]) ? state.grade : 5;
            const list = KAZ[grade] || [];
            if (!list.length) return null;
            const isKazDone = (k) => {
              if (k.region === "all") return earned >= 5;
              const rs = (state.regionsProgress || {})[k.region];
              return rs && rs.status === "done";
            };
            const tamamlananlar = list.filter(isKazDone);
            const tamamlanacaklar = list.filter(k => !isKazDone(k));

            const KazRow = ({ k, done }) => (
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "8px 12px",
                background: done ? "rgba(85,139,47,.08)" : "var(--bg-paper)",
                borderRadius: 8, marginBottom: 6,
                borderLeft: "3px solid " + (done ? "var(--success)" : "var(--rule)"),
              }}>
                <div style={{
                  fontSize: 16, lineHeight: 1.4, marginTop: 1,
                  color: done ? "var(--success)" : "var(--ink-mute)",
                }}>{done ? "✓" : "○"}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-label)", fontSize: 10,
                    color: done ? "var(--success)" : "var(--ink-mute)", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 1,
                  }}>{k.code}</div>
                  <div style={{
                    fontSize: 13, lineHeight: 1.4,
                    color: done ? "var(--ink)" : "var(--ink-soft)",
                    textDecoration: done ? "none" : "none",
                  }}>{k.text}</div>
                </div>
              </div>
            );

            return (
              <div style={{ marginTop: 22 }}>
                <div className="t-label" style={{ fontSize: 11, marginBottom: 8 }}>
                  📚 Kazanımlarım — {grade}. Sınıf · {tamamlananlar.length}/{list.length}
                </div>
                {tamamlananlar.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{
                      fontFamily: "var(--font-hand)", fontSize: 14, color: "var(--success)",
                      fontWeight: 700, marginBottom: 6,
                    }}>
                      ✓ Tamamlananlar ({tamamlananlar.length})
                    </div>
                    {tamamlananlar.map(k => <KazRow key={k.code} k={k} done={true}/>)}
                  </div>
                )}
                {tamamlanacaklar.length > 0 && (
                  <div>
                    <div style={{
                      fontFamily: "var(--font-hand)", fontSize: 14, color: "var(--ink-soft)",
                      fontWeight: 700, marginBottom: 6,
                    }}>
                      ○ Tamamlanacaklar ({tamamlanacaklar.length})
                    </div>
                    {tamamlanacaklar.map(k => <KazRow key={k.code} k={k} done={false}/>)}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Encouragement footer */}
          <div style={{
            marginTop: 20, padding: "14px 16px",
            background: "var(--gold-soft)",
            borderRadius: 10, border: "1.5px dashed var(--gold)",
            fontFamily: "var(--font-hand)", fontSize: 16, color: "var(--ink)", textAlign: "center",
          }}>
            {earned === 7
              ? "🎉 Tüm rozetleri topladın! Final aşamasındasın, harika gidiyorsun!"
              : earned >= 4
                ? `🌟 ${earned} rozet kazandın! Sona az kaldı, hadi devam!`
                : earned >= 1
                  ? `💪 ${earned} rozet senin oldu! Bir sonrakine geç.`
                  : "🚀 Macera daha yeni başlıyor, ilk bölgeyi seç ve keşfet!"}
          </div>
        </div>
      </div>
    </div>
  );
};


/* ========== JourneyBar — Rozetlerim + ilerleme adımı ========== */
const JourneyBar = ({ progressMap = {}, regionsProgress = {} }) => {
  const REGIONS = window.REGIONS || [];
  const Badge = window.Badge;
  return (
    <div style={{
      flexShrink: 0,
      padding: "6px 56px 10px",
      background: "linear-gradient(180deg, transparent, rgba(241,233,210,.95) 30%)",
    }}>
      <div className="t-label" style={{ fontSize: 11, marginBottom: 4 }}>
        Rozetlerim · Yolculuk
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4 }}>
        {REGIONS.map((r, i) => {
          const status = progressMap[r.id] || "open";
          const data = regionsProgress[r.id] || {};
          const correctCount = ((data.missions || []).filter(m => m && m.correct)).length;
          const isDone = status === "done";
          const partial = !isDone && correctCount > 0;
          const fillColor = REGION_FILL_COLORS[r.id] || "#888";
          const next = i < REGIONS.length - 1 ? REGIONS[i+1] : null;
          const nextDone = next && progressMap[next.id] === "done";
          const linkActive = isDone && nextDone;

          return (
            <React.Fragment key={r.id}>
              <div style={{ flexShrink: 0 }}>
                {Badge && (
                  <Badge
                    region={r.id}
                    label={r.name}
                    locked={!isDone}
                    size={50}
                    inner={partial ? (correctCount + "/3") : undefined}
                  />
                )}
              </div>
              {next && (
                <div style={{
                  flex: 1, height: 3, minWidth: 12,
                  marginTop: 24,
                  background: linkActive ? "var(--success)" :
                              (isDone ? "linear-gradient(90deg, " + fillColor + ", var(--rule-soft))" : "var(--rule-soft)"),
                  borderRadius: 2,
                  transition: "background .3s",
                  opacity: linkActive ? 1 : 0.6,
                }}/>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
Object.assign(window, { JourneyBar });

/* ========== JourneyMap — Tek bölge için yatay 5 kategori (haritanın altında) ========== */
const JourneyMap = ({ regionId, regionsProgress = {}, onCategorySelect }) => {
  const REGIONS = window.REGIONS || [];
  const CATS_BY_REG = null; /* replaced by getCategoriesForRegion */
  const region = REGIONS.find(r => r.id === regionId) || REGIONS[0];
  if (!region) return null;
  const cats = (window.getCategoriesForRegion ? window.getCategoriesForRegion(region.id) : (window.CATEGORIES_BY_REGION && window.CATEGORIES_BY_REGION[region.id]) || []);
  const data = regionsProgress[region.id] || {};
  const catProgress = data.categories || {};
  const fillColor = (window.REGION_FILL_COLORS || {})[region.id] || "#888";
  const doneCount = cats.filter(c => (catProgress[c.id] && catProgress[c.id].completed)).length;
  const totalCorrect = cats.reduce((s, c) => {
    const cp = catProgress[c.id] || {};
    return s + (typeof cp.correctCount === "number" ? cp.correctCount : 0);
  }, 0);
  const overallPct = cats.length ? Math.round((totalCorrect / (cats.length * 3)) * 100) : 0;

  return (
    <div style={{
      flexShrink: 0,
      padding: "8px 24px 12px",
      background: "linear-gradient(180deg, transparent, rgba(241,233,210,.95) 30%)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, gap: 12 }}>
        <div className="t-label" style={{ fontSize: 11 }}>
          🛤️ Yolculuk Haritam · {region.name} · {doneCount}/{cats.length} kategori · {overallPct}%
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-mute)", fontFamily: "var(--font-hand)" }}>
          Bir kategori seçerek o sorulara odaklan →
        </div>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(" + cats.length + ", minmax(0, 1fr))",
        gap: 8,
      }}>
        {cats.map((c, i) => {
          const cp = catProgress[c.id] || {};
          const correct = (typeof cp.correctCount === "number") ? cp.correctCount : ((cp.missions || []).filter(m => m && m.correct).length);
          const pct = Math.min(100, Math.round((correct / 3) * 100));
          const isDone = !!cp.completed;
          return (
            <button
              key={c.id}
              onClick={() => !isDone && onCategorySelect && onCategorySelect(region.id, c.id)}
              disabled={isDone}
              title={c.label + " · " + pct + "%"}
              style={{
                display: "flex", flexDirection: "column", alignItems: "stretch", gap: 4,
                padding: "10px 10px",
                background: isDone ? "var(--bg-paper)" : "var(--bg-cream)",
                border: "2px solid " + (isDone ? "var(--success)" : (correct > 0 ? fillColor : "var(--rule-soft)")),
                borderRadius: 10,
                cursor: isDone ? "default" : "pointer",
                textAlign: "left",
                fontFamily: "var(--font-body)",
                opacity: isDone ? 0.85 : 1,
                transition: "all .15s",
                position: "relative",
              }}
              onMouseEnter={(e) => { if (!isDone) e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{c.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-hand)", fontWeight: 700, fontSize: 13, color: "var(--ink)",
                    lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{c.label}</div>
                  <div style={{
                    fontSize: 11, color: isDone ? "var(--success)" : "var(--ink-mute)", fontWeight: 700,
                  }}>
                    {isDone ? "✓ Tamamlandı" : (correct + "/3 · " + pct + "%")}
                  </div>
                </div>
              </div>
              <div style={{
                height: 5, borderRadius: 3,
                background: "var(--rule-soft)", overflow: "hidden",
              }}>
                <div style={{
                  width: pct + "%", height: "100%",
                  background: isDone ? "var(--success)" : fillColor,
                  transition: "width .35s ease-out",
                }}/>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
Object.assign(window, { JourneyMap });

/* ========== AllJourneyModal — Tüm 7 bölge × 5 kategori grid (modal) ========== */
const AllJourneyModal = ({ regionsProgress = {}, onClose, onCategorySelect }) => {
  const REGIONS = window.REGIONS || [];
  const CATS = null; /* replaced by getCategoriesForRegion */
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9990,
      background: "rgba(62,39,35,.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div onClick={(e) => e.stopPropagation()} className="paper-cream" style={{
        width: "100%", maxWidth: 1100, maxHeight: "90vh",
        borderRadius: 18, padding: 0, overflow: "hidden",
        border: "1.5px solid var(--rule)",
        boxShadow: "0 16px 48px rgba(0,0,0,.45)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 24px", borderBottom: "1.5px dashed var(--rule)",
          background: "linear-gradient(180deg, #FAF6EC 0%, #F1E9D2 100%)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 26 }}>🛤️</span>
            <div>
              <div className="t-label" style={{ fontSize: 11 }}>Yolculuk Haritam</div>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 26, color: "var(--title)", lineHeight: 1,
              }}>Tüm Bölgeler · Tüm Kazanımlar</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "var(--bg-cream)", border: "1.5px solid var(--ink-mute)",
            cursor: "pointer", fontSize: 16, color: "var(--ink)",
          }} aria-label="Kapat">✕</button>
        </div>
        <div style={{ padding: "18px 24px", overflowY: "auto", flex: 1 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
          }}>
            {REGIONS.map(r => {
              const cats = (window.getCategoriesForRegion ? window.getCategoriesForRegion(r.id) : []);
              const data = regionsProgress[r.id] || {};
              const catProgress = data.categories || {};
              const fillColor = (window.REGION_FILL_COLORS || {})[r.id] || "#888";
              const doneCount = cats.filter(c => (catProgress[c.id] && catProgress[c.id].completed)).length;
              const totalCorrect = cats.reduce((s, c) => {
                const cp = catProgress[c.id] || {};
                return s + (typeof cp.correctCount === "number" ? cp.correctCount : 0);
              }, 0);
              const overallPct = cats.length ? Math.round((totalCorrect / (cats.length * 3)) * 100) : 0;
              return (
                <div key={r.id} style={{
                  background: "var(--bg-paper)",
                  borderRadius: 12,
                  border: "2px solid " + (doneCount === cats.length ? fillColor : "var(--rule-soft)"),
                  padding: "12px 14px",
                  boxShadow: "0 2px 4px rgba(62,39,35,.08)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: fillColor,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, color: "#FFF7EB",
                      boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                    }}>{r.badge}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "var(--font-display)", fontSize: 22, color: "var(--title)",
                        lineHeight: 1, marginBottom: 2,
                      }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-mute)", fontWeight: 600 }}>
                        {doneCount}/{cats.length} kategori · {overallPct}%
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {cats.map(c => {
                      const cp = catProgress[c.id] || {};
                      const correct = (typeof cp.correctCount === "number") ? cp.correctCount :
                        ((cp.missions || []).filter(m => m && m.correct).length);
                      const pct = Math.min(100, Math.round((correct / 3) * 100));
                      const isDone = !!cp.completed;
                      return (
                        <button
                          key={c.id}
                          onClick={() => !isDone && onCategorySelect && onCategorySelect(r.id, c.id)}
                          disabled={isDone}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "6px 8px",
                            background: "transparent",
                            border: "1px solid " + (isDone ? "var(--success)" : "transparent"),
                            borderRadius: 6,
                            cursor: isDone ? "default" : "pointer",
                            textAlign: "left",
                            fontFamily: "var(--font-body)",
                            transition: "background .12s",
                          }}
                          onMouseEnter={(e) => { if (!isDone) e.currentTarget.style.background = "rgba(184,134,47,.10)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                          <span style={{ fontSize: 14, flexShrink: 0 }}>{c.emoji}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 12, fontWeight: 600, color: "var(--ink)",
                              lineHeight: 1.15, marginBottom: 2,
                            }}>{c.label}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <div style={{
                                flex: 1, height: 5, borderRadius: 3,
                                background: "var(--rule-soft)", overflow: "hidden",
                              }}>
                                <div style={{
                                  width: pct + "%", height: "100%",
                                  background: isDone ? "var(--success)" : fillColor,
                                  transition: "width .3s",
                                }}/>
                              </div>
                              <div style={{
                                fontSize: 10, fontWeight: 700,
                                color: isDone ? "var(--success)" : "var(--ink-mute)",
                                minWidth: 28, textAlign: "right",
                              }}>{isDone ? "✓" : pct + "%"}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
Object.assign(window, { AllJourneyModal });



const Logo = ({ size = 220 }) => (
  <svg width={size} height={size * 0.78} viewBox="0 0 220 170">
    <path d="M30 70 Q40 40 80 38 Q140 32 180 42 Q210 50 205 80 Q200 110 175 115 Q160 122 130 120 Q90 122 60 115 Q35 105 30 70 Z"
      fill="#E8D9B5" stroke="#5D2E2E" strokeWidth="2"/>
    <path d="M30 70 Q40 40 80 38 Q140 32 180 42 Q210 50 205 80 Q200 110 175 115 Q160 122 130 120 Q90 122 60 115 Q35 105 30 70 Z"
      fill="url(#logoTex)" opacity=".5"/>
    <defs>
      <pattern id="logoTex" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r=".7" fill="#B8862F" opacity=".4"/>
      </pattern>
    </defs>
    <g transform="translate(135, 78)">
      <circle r="32" fill="#FAF1D6" stroke="#B8862F" strokeWidth="1.6"/>
      <circle r="26" fill="none" stroke="#B8862F" strokeWidth=".7" strokeDasharray="2 3"/>
      <polygon points="0,-26 4,0 0,26 -4,0" fill="#C62828" stroke="#8B1C1C"/>
      <polygon points="-26,0 0,-4 26,0 0,4" fill="#3E2723"/>
      <circle r="3" fill="#B8862F"/>
    </g>
    <g transform="translate(60, 60)">
      <circle r="22" fill="rgba(187,222,251,.5)" stroke="#5D2E2E" strokeWidth="2.5"/>
      <circle r="22" fill="none" stroke="#FAF1D6" strokeWidth="1" opacity=".7"/>
      <line x1="16" y1="16" x2="32" y2="32" stroke="#5D2E2E" strokeWidth="4" strokeLinecap="round"/>
    </g>
    <g fill="#C62828">
      <path d="M195 20 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 z"/>
      <path d="M20 130 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 l3 -1 z"/>
    </g>
    <g transform="translate(115, 78)">
      <circle r="3.5" fill="#C62828" stroke="#FAF1D6" strokeWidth="1.5"/>
    </g>
  </svg>
);

/* ========== Bölge sahnesi (Karadeniz örneği) ========== */
const RegionSceneKaradeniz = () => (
  <svg viewBox="0 0 600 220" width="100%">
    <defs>
      <linearGradient id="kdSky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#E0E5DA"/>
        <stop offset="1" stopColor="#B7C4A8"/>
      </linearGradient>
    </defs>
    <rect width="600" height="220" fill="url(#kdSky)"/>
    <ellipse cx="180" cy="100" rx="180" ry="20" fill="#FAF6EC" opacity=".7"/>
    <ellipse cx="420" cy="120" rx="160" ry="16" fill="#FAF6EC" opacity=".55"/>
    <path d="M0 160 L80 70 L150 130 L230 50 L320 130 L400 80 L500 140 L600 90 L600 220 L0 220 Z" fill="#3F5F3E"/>
    <path d="M0 160 L80 70 L150 130 L230 50 L320 130 L400 80 L500 140 L600 90 L600 220 L0 220 Z" fill="#2E7D32" opacity=".6"/>
    <path d="M0 220 L0 180 Q150 165 300 180 Q450 195 600 175 L600 220 Z" fill="#5C8D2E"/>
    {Array.from({ length: 20 }).map((_, i) => (
      <ellipse key={i} cx={30 + i * 30} cy={195 + (i%3)*4} rx="14" ry="3" fill="#3F6B1F" opacity=".7"/>
    ))}
    {Array.from({ length: 24 }).map((_, i) => (
      <line key={i} x1={(i*27)%600} y1={(i*13)%80} x2={(i*27)%600 - 4} y2={(i*13)%80 + 12}
        stroke="#FAF6EC" strokeWidth="1.2" opacity=".4"/>
    ))}
    <g transform="translate(440, 130)">
      <polygon points="0,20 25,0 50,20" fill="#5D2E2E"/>
      <rect x="6" y="20" width="38" height="22" fill="#E8D9B5" stroke="#5D2E2E" strokeWidth="1"/>
      <rect x="20" y="28" width="10" height="14" fill="#5D2E2E"/>
    </g>
  </svg>
);

/* ========== Helper: getRegion (REGIONS + REGIONS_CONTENT birleştir) ========== */
const getRegion = (id) => {
  const base = REGIONS.find(r => r.id === id) || {};
  const content = (window.REGIONS_CONTENT && window.REGIONS_CONTENT[id]) || {};
  return { ...base, ...content };
};


/* ====== Grade-aware mission/quiz selection (random pool sampling) ====== */
const _gameOrder = { regions: {}, quiz: null };
const _shuffleArr = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const _readGradeFromStorage = () => {
  try {
    const raw = localStorage.getItem('tk_state');
    if (raw) {
      const s = JSON.parse(raw);
      const g = parseInt(s.grade, 10);
      if (g >= 5 && g <= 8) return g;
    }
  } catch(e) {}
  return 5;
};
const getMissionsForGame = (regionId) => {
  if (_gameOrder.regions[regionId]) return _gameOrder.regions[regionId];
  const grade = _readGradeFromStorage();
  const graded = window.REGIONS_CONTENT_GRADED && window.REGIONS_CONTENT_GRADED[regionId];
  let pool = null;
  if (graded && graded.missionsByGrade && graded.missionsByGrade[grade] && graded.missionsByGrade[grade].length) {
    pool = graded.missionsByGrade[grade];
  } else if (window.REGIONS_CONTENT && window.REGIONS_CONTENT[regionId] && window.REGIONS_CONTENT[regionId].missions) {
    pool = window.REGIONS_CONTENT[regionId].missions;
  }
  if (!pool || !pool.length) return [];
  // Tag each mission with its original index so we can later derive its category.
  const indexed = pool.map((m, i) => ({ ...m, _origIdx: i }));
  const selected = _shuffleArr(indexed).slice(0, 3);
  _gameOrder.regions[regionId] = selected;
  return selected;
};
const getQuizForGame = () => {
  if (_gameOrder.quiz) return _gameOrder.quiz;
  const grade = _readGradeFromStorage();
  let pool = null;
  if (window.FINAL_QUIZ_BY_GRADE && window.FINAL_QUIZ_BY_GRADE[grade] && window.FINAL_QUIZ_BY_GRADE[grade].length) {
    pool = window.FINAL_QUIZ_BY_GRADE[grade];
  } else if (window.FINAL_QUIZ) {
    pool = window.FINAL_QUIZ;
  }
  if (!pool || !pool.length) return [];
  const selected = _shuffleArr(pool).slice(0, 15);
  _gameOrder.quiz = selected;
  return selected;
};
const resetGameOrder = () => { _gameOrder.regions = {}; _gameOrder.quiz = null; };
const resetRegionGameOrder = (regionId) => {
  if (regionId && _gameOrder.regions) { delete _gameOrder.regions[regionId]; }
};
Object.assign(window, { getMissionsForGame, getQuizForGame, resetGameOrder, resetRegionGameOrder });

Object.assign(window, {
  CornerOrnament, Sparkle, CompassRose, TurkeyMap, Badge, TopBar, Confetti, Logo,
  RegionSceneKaradeniz, REGIONS, getRegion, TimerBar, BackpackModal, REGION_FILL_COLORS,
});
