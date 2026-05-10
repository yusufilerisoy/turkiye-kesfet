# 🇹🇷 Türkiye'yi Keşfet — Mimarı ve İşleyiş Dokümantasyonu

> **Amaç:** Bu dokümantasyonu başka bir uygulamada birebir aynı yapıyı kurabilmek için referans olarak kullanın. Tüm tasarım kararları, veri akışı, komponent ilişkileri ve özellikler burada.

---

## 1. PROJE ÖZETİ

**Tip:** Eğitsel oyun (Türkiye coğrafyası)
**Hedef kitle:** Ortaokul 5-8. sınıf öğrencileri
**Pedagojik temel:** Tasarım Temelli Araştırma (DBR), Gee (2003), Prensky (2001), Bloom Taksonomisi
**MEB müfredatı:** Sosyal Bilgiler dersi Türkiye coğrafi bölgeleri kazanımları

**Çekirdek mekanik:**
- 7 coğrafi bölge × 5 kategori (kazanım grubu) × 3 soru = bölge başına 15 soru
- Her sınıfa özel soru havuzları, kategoriler, ikonlar
- Mixed flow (rastgele 3 soru) + Focused flow (kategoriye özel 3 soru)
- Tüm 5 kategori tamamlanınca bölge "mastered" + rozet kazanılır

---

## 2. TEKNİK STACK

| Katman | Seçim | Gerekçe |
|--------|-------|---------|
| **UI Framework** | React 18 (CDN: `unpkg.com/react@18.3.1`) | Ekosisitem, hook'lar, declarative rendering |
| **Transpiler** | Babel-standalone (CDN) | Build adımı YOK; tarayıcıda derleme |
| **Harita** | Leaflet 1.9.4 + leaflet.markercluster 1.5.3 (CDN) | Gerçek coğrafi harita, vector polygon, marker clustering |
| **Tile sağlayıcı** | CartoDB Voyager Light | Açık ton, label-light, ücretsiz |
| **State** | `useState` + localStorage | Backend yok, persist localStorage'da |
| **Bundling** | YOK — tek inline `index.html` (`file://` ile çalışır) | Dağıtım kolaylığı, CORS sorununu önler |
| **Tipler** | Vanilla JS (TypeScript YOK) | Babel-standalone hız |
| **Stil** | CSS değişkenleri + inline style | Design tokens + bileşen-özel stil |
| **Fontlar** | Google Fonts (Caveat, Patrick Hand, Quicksand, Source Sans 3) | El yazısı + okunabilir gövde |

### Önemli Kural: BUILD STEP YOK
- Tüm `.jsx` içerikleri tek `index.html` içinde inline `<script type="text/babel">` blokları
- `Object.assign(window, {...})` paterni ile global scope'a erişim
- Dosyaları `<script src="...">` ile yüklemek `file://` protokolünde CORS'a takılır → inline ediyoruz

---

## 3. DOSYA YAPISI

```
turkiye-kesfet/
├── index.html                 ← TEK GİRİŞ NOKTASI (~510KB inline)
├── styles.css                 ← Design tokens + utility class'lar
├── README.md
├── ARCHITECTURE.md            ← Bu dosya
├── assets/
│   └── turkey-map.png         ← Eski (kullanılmıyor; legacy)
└── src/                       ← Modüler kaynak (geliştirme için)
    ├── app.jsx                ← Ana App, ekran routing'i
    ├── state/
    │   ├── router.jsx         ← SCREENS enum
    │   └── progress.jsx       ← useProgress custom hook + localStorage
    ├── data/
    │   ├── content.jsx        ← Legacy soru havuzu (grade-bağımsız)
    │   └── content_graded.jsx ← Sınıf bazlı 580 soru (4×7×15 + 4×40 quiz)
    ├── lib/
    │   ├── components.jsx     ← TurkeyMap, Badge, TopBar, BackpackModal,
    │   │                         JourneyMap, JourneyBar, AllJourneyModal,
    │   │                         CATEGORIES_BY_REGION_GRADED, KAZANIMLAR,
    │   │                         REGION_TOPIC_ICONS_GRADED, TimerBar, Confetti, ...
    │   ├── regionScenes.jsx   ← 7 bölge için stilize SVG sahneleri
    │   ├── turkeyGeo.js       ← 81 il GeoJSON + bölge eşlemesi
    │   ├── turkeyMask.js      ← Eski raster mask (artık kullanılmıyor)
    │   └── regionTopicIconsGraded.js  ← 224 ikon (4×7×8)
    └── screens/
        ├── Welcome.jsx        ← Karşılama + isim/sınıf seçici
        ├── Map.jsx            ← Ana harita ekranı
        ├── RegionIntro.jsx    ← Bölge bilgi modal'ı
        ├── Mission.jsx        ← Mini görev (5 tip içerir)
        ├── BadgeCeremony.jsx  ← Rozet kazanım töreni
        ├── Quiz.jsx           ← Final quiz (15 soru)
        └── Final.jsx          ← Tebrik ekranı
```

> **Önemli:** `index.html` `src/` altındaki tüm içeriği **inline** içerir. `src/` dosyaları sadece geliştirme/referans amaçlıdır.

---

## 4. EXTERNAL CDN DEPENDENCIES

`<head>` içinde yüklenen kütüphaneler:

```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&family=Quicksand:wght@400;500;600;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet"/>

<!-- Leaflet (harita motoru) -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>

<!-- React 18 + Babel-standalone -->
<script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

**Tile servisi:** `https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png` (subdomains: a, b, c, d)

---

## 5. STATE MİMARİSİ

### 5.1 localStorage Şeması

```js
localStorage.tk_state = {
  playerName: "Defne",
  grade: 5,                                  // 5 | 6 | 7 | 8
  startedAt: "2025-05-09T19:30:00.000Z",     // ISO timestamp
  regionsProgress: {
    [regionId]: {
      status: 'open' | 'partial' | 'done',
      categories: {
        [categoryId]: {                       // categoryId = "cat0"..."cat4"
          correctCount: 0..3,
          attempts: number,
          completed: boolean
        }
      },
      missions: [                              // legacy mission tracking (DBR logging)
        { attempts, correct, timeMs }
      ],
      completedAt: "ISO date" (when status='done')
    }
  },
  quizScore: null | number,                  // 0-15
  sessionLog: [                               // tüm event'ler timestamp'li
    { ts: 1234567890, type: 'category_answer',
      payload: { regionId, categoryId, correct } }
  ]
}
```

### 5.2 useProgress Custom Hook

`src/state/progress.jsx` içinde tanımlı. Public API:

```js
const progress = useProgress();
// Properties:
progress.state                         // okuma için raw state

// Setters:
progress.setPlayerName(name)
progress.setGrade(g)                  // 5-8 arası, _gameOrder cache'i temizler
progress.completeRegion(regionId)
progress.recordMissionAttempt(regionId, missionIdx, correct, timeMs)
progress.recordCategoryAnswer(regionId, categoryId, correct)
progress.recordQuizAnswer(qIdx, correct, timeMs)
progress.setQuizScore(score)
progress.reset()                       // localStorage temizler + cache temizler

// Getters:
progress.isRegionUnlocked(regionId)
progress.isRegionDone(regionId)
progress.getRegionStatus(regionId)     // 'open' | 'done' | 'locked'
progress.getProgressMap()              // {regionId: status} TurkeyMap için
progress.earnedBadgeCount()            // tamamen done bölge sayısı
progress.isCategoryDone(regionId, categoryId)
progress.getCategoryProgress(regionId, categoryId)  // {correct, total, completed}
progress.exportJson()                  // JSON string (öğretmen için DBR data)
progress.hasSavedGame()
```

**Tek doğruluk kaynağı kuralı:** App seviyesinde **TEK** `useProgress()` instance'ı çağrılır. Tüm alt komponentlere `progressInstance` prop'u olarak geçer. Her komponent kendi `useProgress()` çağırırsa **ayrı state instance** oluşur — değişiklikler senkronize OLMAZ. Bu kuralı unutmayın!

### 5.3 Window-Level Globals (`Object.assign(window, {...})`)

| Global | İçerik | Tanımlandığı yer |
|--------|--------|------------------|
| `SCREENS` | Ekran enum (`WELCOME`, `MAP`, `REGION_INTRO`, `MISSION`, `BADGE`, `QUIZ`, `FINAL`) | `state/router.jsx` |
| `useProgress` | Custom hook | `state/progress.jsx` |
| `REGIONS` | 7 bölge meta (id, name, color, badge emoji) | `lib/components.jsx` |
| `REGION_FILL_COLORS` | Renk paleti `{regionId: hex}` | `lib/components.jsx` |
| `REGION_CENTERS` | Bölge merkez koordinatları `{regionId: [lat, lng]}` | `lib/components.jsx` |
| `REGION_DISPLAY_NAMES` | Bölge isimleri Türkçe | `lib/components.jsx` |
| `TURKEY_GEO` | 81 il GeoJSON FeatureCollection + region property | `lib/turkeyGeo.js` |
| `REGIONS_CONTENT` | Legacy soru havuzu (grade-bağımsız) | `data/content.jsx` |
| `REGIONS_CONTENT_GRADED` | Sınıf bazlı 580 soru | `data/content_graded.jsx` |
| `FINAL_QUIZ` | Legacy quiz | `data/content.jsx` |
| `FINAL_QUIZ_BY_GRADE` | Sınıfa göre 40 quiz/grade | `data/content_graded.jsx` |
| `CATEGORIES_BY_REGION` | Legacy kategoriler (5 cat/region) | `lib/components.jsx` |
| `CATEGORIES_BY_REGION_GRADED` | Sınıfa göre kategoriler (4×7×5 = 140) | `lib/components.jsx` |
| `KAZANIMLAR` | MEB kazanımları `{grade: [...]}` | `lib/components.jsx` |
| `REGION_TOPIC_ICONS` | Legacy ikonlar (12/region) | `lib/components.jsx` |
| `REGION_TOPIC_ICONS_GRADED` | Sınıfa göre ikonlar (4×7×8 = 224) | `lib/regionTopicIconsGraded.js` |
| `getRegion(id)` | Region meta + content birleştirir | `lib/components.jsx` |
| `getCategoriesForRegion(regionId)` | Grade-aware kategoriler | `lib/components.jsx` |
| `getTopicIconsForRegion(regionId)` | Grade-aware ikonlar | `lib/components.jsx` |
| `getMissionsForGame(regionId)` | Mixed flow: random 3 görev (cache'lenir) | `lib/components.jsx` |
| `getMissionsForCategory(regionId, catId)` | Focused flow: o kategorinin 3 görevi | `lib/components.jsx` |
| `getQuizForGame()` | Random 15 quiz | `lib/components.jsx` |
| `resetGameOrder()` | Tüm cache'i temizler | `lib/components.jsx` |
| `resetRegionGameOrder(regionId)` | Tek bölgenin cache'ini temizler | `lib/components.jsx` |

---

## 6. EKRAN ROUTING

`App` component (içinde `useState` ile `screen` tutar) bir switch/case ile aktif ekrana göre render eder:

```
WELCOME ──→ MAP ──→ REGION_INTRO ──→ MISSION ──→ MAP (kategori bitti)
              │           │                      │
              │           │                      └─→ BADGE (5/5 cat done) ──→ MAP
              │           │
              │           └─→ MISSION (focused flow: kategori click)
              │
              └─→ QUIZ (7/7 region done) ──→ FINAL ──→ WELCOME (yeniden oyna)
```

App state:
```js
const [screen, setScreen] = useState(SCREENS.WELCOME);
const [activeRegion, setActiveRegion] = useState(null);
const [activeCategory, setActiveCategory] = useState(null);
const [missionIndex, setMissionIndex] = useState(0);
```

Navigate helper'ları:
- `goToWelcome()`, `goToMap()`, `goToRegion(id)`, `goToMission(index)`,
  `goToCategoryMission(catId)`, `goToBadge()`, `goToQuiz()`, `goToFinal()`

`handleStart(name, grade, isNewIdentity)`: yeni kimlik ise `progress.reset()` + `resetGameOrder()` çağırır, sonra setPlayerName + setGrade + goToMap.

---

## 7. KOMPONENT ENVANTERİ

### 7.1 Ekran Komponentleri (`src/screens/`)

| Komponent | Sorumluluk |
|-----------|-----------|
| **`WelcomeScreen`** | İsim girişi + 5/6/7/8 sınıf butonları + "Maceraya Başla"/"Devam Et" |
| **`MapScreen`** | TopBar + headline + TurkeyMap + JourneyMap + AllJourneyModal handler |
| **`RegionIntroScreen`** | Modal: bölge sahne SVG'si + intro story + 4 fact + "Göreve Başla" butonu |
| **`MissionScreen`** | 5 mission tipi router; üst progress (1/3, 2/3, 3/3); ipucu; doğru/yanlış feedback |
| **`BadgeCeremonyScreen`** | Konfeti + glow + büyük rozet + övgü metni; mount'ta `completeRegion` |
| **`QuizScreen`** | 15 soru, 15 sn timer, 50:50 hint, atla, skor takip |
| **`FinalScreen`** | 7 rozet çelengi + mega rozet + 3 metrik (rozet/quiz/süre) + Yeniden Oyna |

### 7.2 Lib Komponentleri (`src/lib/components.jsx`)

| Komponent | Sorumluluk |
|-----------|-----------|
| **`TurkeyMap`** | Leaflet harita + 81 il GeoJSON polygon (renkli) + topic icon marker'ları + cluster |
| **`Badge`** | Yuvarlak rozet (region color + emoji veya `?`); `inner` prop'u ile içerik override edilebilir |
| **`TopBar`** | Çantam | Rozetlerim mini badges | Yolculuk Haritam butonu | Settings menu (⚙️) |
| **`JourneyBar`** | Eski yatay 7 düğüm step indicator (artık kullanılmıyor) |
| **`JourneyMap`** | Haritanın altında: tek bölgenin yatay 5 kategori bar'ı |
| **`AllJourneyModal`** | Sağ üst butonla açılır: tüm 7 bölgenin kategorileri grid |
| **`BackpackModal`** | Çantam'a tıklayınca açılır: oyuncu bilgisi + stats + bölge ilerleme + kazanımlar |
| **`Confetti`**, **`Sparkle`** | Rozet/doğru cevap animasyon partikülleri |
| **`Logo`**, **`CompassRose`**, **`CornerOrnament`** | Welcome ekranı dekoratif elementler |
| **`TimerBar`** | Quiz için yatay sayaç çubuğu (geri sayım) |

### 7.3 Bölge Sahneleri (`src/lib/regionScenes.jsx`)

7 farklı stilize SVG sahne — her bölgenin atmosferini gösterir:
- `RegionSceneKaradeniz`, `RegionSceneAkdeniz`, `RegionSceneEge`, `RegionSceneIcAnadolu`,
  `RegionSceneMarmara`, `RegionSceneDoguAnadolu`, `RegionSceneGuneydogu`
- Master: `RegionScene region={regionId}` switch-based render

---

## 8. HARİTA SİSTEMİ DETAYI

### 8.1 TurkeyMap Komponent

**Render:**
```jsx
<div ref={containerRef}/>  ← Leaflet bu div'e mount
```

**useEffect (mount):**
1. `L.map(containerRef.current, options)` ile harita oluştur
2. CartoDB tile layer ekle
3. `L.geoJSON(window.TURKEY_GEO, { style: computeStyle, onEachFeature })` ile 81 il polygon'ı ekle
4. `fitBounds` ile Türkiye'ye zoom (asimetrik padding: top=50, others=4 → harita biraz aşağı)
5. `setZoom(map.getZoom() + 0.1)` ile minik bonus zoom
6. `refreshStatusMarkers` (tamamlanan bölgelerin status icon'ları)
7. `refreshTopicMarkers` (topic icons + cluster)

**useEffect (her render):** Style + markers refresh.

**Styling per province polygon:**
```js
computeStyle(feature) {
  const status = progress[region];           // open | done | locked
  const isHL = highlightRegion === region || hovered === region;
  
  if (status === 'done') {
    return { weight: 0.9, color: 'rgba(40,30,25,0.55)', fillOpacity: 0.6 };
    // Pencil-like outline (slight)
  }
  if (status === 'locked') { /* faded */ }
  return { weight: 0.3 (open) or 0.9 (hover), fillColor: regionColor };
}
```

**Topic icon clustering:**
- `L.markerClusterGroup({ maxClusterRadius: 18, zoomToBoundsOnClick: false })`
- Custom `iconCreateFunction` → renkli sayı badge
- Custom `clusterclick` event → popup ile ikon listesi (emoji+isim+şehir+desc)

### 8.2 GeoJSON İşlemi

`turkeyGeo.js` içinde `TURKEY_GEO`:
```js
{
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "İstanbul",
        region: "marmara"     // ← İl→Bölge eşlemesi (Python'da hesaplandı)
      },
      geometry: { type: "MultiPolygon", coordinates: [...] }
    },
    ...81 il
  ]
}
```

**Üretim:** Python `shapely` ile `cihadturhan/tr-geojson`'dan il sınırları indirildi, koordinatlar 3 ondalığa yuvarlandı, region property eklendi.

### 8.3 Topic Icons (224 ikon)

`REGION_TOPIC_ICONS_GRADED[grade][regionId]` = 8 ikon array:
```js
{ emoji: "🌉", label: "Boğaz Köprüsü", city: "İstanbul",
  lat: 41.04, lng: 29.03,
  desc: "Asya ve Avrupa'yı birbirine bağlayan ünlü asma köprü..." }
```

**Açılış mantığı:** Her bölgenin 5 kategorisi var. Kategori başına 3 doğru = kategori complete. Toplam 5 kategori × 3 = 15 doğru = bölge done. İkonlar sayıya göre proporsiyonel açılır:
- 0 doğru → 0 ikon
- 1 doğru → 3 ikon
- 2 doğru → 5 ikon
- ... (Math.ceil(8 * correctRatio))

---

## 9. SORU İÇERİK SİSTEMİ

### 9.1 REGIONS_CONTENT_GRADED Yapısı

```js
{
  marmara: {
    intro: {
      missionTitle: "Şehir Kaşifi",
      story: "Boğaz'ın iki yakası arasında köprüler...",
      facts: [
        { icon: "🏙️", label: "En büyük şehir", value: "İstanbul" },
        { icon: "🏭", label: "Sanayi", value: "Gelişmiştir" },
        ...
      ],
      estimatedMin: "4–6"
    },
    missionsByGrade: {
      5: [ /* 15 mission */ ],
      6: [ /* 15 mission */ ],
      7: [ /* 15 mission */ ],
      8: [ /* 15 mission */ ]
    }
  },
  // ... 6 bölge daha
}
```

**Toplam:** 7 bölge × 4 sınıf × 15 görev = **420 görev** + 4 sınıf × 40 quiz = **160 quiz** = **580 soru**

### 9.2 Mission (Görev) Tipleri

5 tip var, her birinin formatı farklı:

```js
// 1. single-choice
{ type: "single-choice", question: "...", options: ["A","B","C","D"],
  correct: 2, hint: "..." }

// 2. multi-select
{ type: "multi-select", question: "...", options: [...],
  correct: [0, 2], hint: "..." }

// 3. drag-match
{ type: "drag-match", question: "...",
  pairs: [{left: "İstanbul", right: "Marmara"}, ...],
  hint: "..." }

// 4. scenario
{ type: "scenario", scenario: "Bir gemi...", question: "...",
  options: [...], correct: 0, hint: "..." }

// 5. map-mark
{ type: "map-mark", question: "...",
  targetRegionId: "marmara", distractors: ["ege", "icanadolu"],
  hint: "..." }
```

Mission her görevde otomatik `_origIdx` ekler (havuzdaki orijinal indeks). Bu sayede mixed flow'da hangi kategoriye ait olduğu hesaplanır: `catIdx = floor(_origIdx / 3)`.

### 9.3 Quiz Soru Formatı

```js
{ q: "...", options: [...3 seçenek], correct: 0..2 }
```

---

## 10. KATEGORI VE KAZANIM SİSTEMİ

### 10.1 CATEGORIES_BY_REGION_GRADED (140 kategori)

```js
{
  5: {
    marmara: [
      { id: "cat0", label: "Bölge Tanıma", emoji: "🗺️" },
      { id: "cat1", label: "İklim", emoji: "🌤️" },
      { id: "cat2", label: "Önemli Şehirler", emoji: "🏙️" },
      { id: "cat3", label: "Boğazlar", emoji: "⚓" },
      { id: "cat4", label: "Yöresel Kültür", emoji: "🎭" }
    ],
    ...6 bölge daha
  },
  6: {...},  // Fiziki coğrafya temalı
  7: {...},  // Tarih+Ekonomi temalı
  8: {...}   // Sürdürülebilirlik temalı
}
```

**Stable ID kuralı:** ID'ler `cat0..cat4` (positional). Sınıf değişse de progress aynı id'lere yazılır. Sınıf değişimi zaten `reset()` tetiklediği için cross-grade veri karışması olmaz.

**Sınıf temaları:**
- **5:** Tanıma — ana ürün/şehir/iklim/sembol/kültür
- **6:** Fiziki — dağ/akarsu/göl/plato/maden
- **7:** Tarih+Ekonomi — UNESCO/sanayi/turizm/ulaşım/kültür
- **8:** Sürdürülebilirlik — afet/yenilenebilir/iklim değ./sürdürülebilir

### 10.2 KAZANIMLAR (MEB Kodları)

`KAZANIMLAR[grade]` = ~12 kazanım/grade. Format:
```js
{ code: "SB.5.5.1",
  text: "Türkiye'nin 7 coğrafi bölgesini tanır.",
  region: "all" | "marmara" | "karadeniz" | ... }
```

**Tamamlanma logic'i:**
- `region: "all"` → 5+ bölge done ise tamamlandı
- spesifik region → o bölge done ise tamamlandı

BackpackModal bu kazanımları "tamamlananlar" / "tamamlanacaklar" olarak gösterir.

---

## 11. AKIŞ DETAYLARI

### 11.1 Welcome Akışı

1. App mount → screen=WELCOME
2. Kullanıcı isim girer + sınıf seçer
3. "Maceraya Başla" → `WelcomeScreen.handleStart`:
   - `nameChanged` = savedName !== trimmed
   - `gradeChanged` = savedGrade !== grade
   - `identityChanged = nameChanged || gradeChanged`
   - `onStart(trimmed, grade, identityChanged)` → App.handleStart
4. App.handleStart:
   - `if (isNewIdentity) progress.reset() + resetGameOrder()`
   - `progress.setPlayerName(name)`
   - `progress.setGrade(grade)`
   - `goToMap()`

### 11.2 Map Akışı (Mixed Flow)

1. Map'te bölgeye tıkla → `goToRegion(id)` → screen=REGION_INTRO
2. RegionIntro modal'ı açılır
3. "Göreve Başla" → `goToMission(0)` → screen=MISSION
4. Mission `getMissionsForGame(regionId)` ile 3 random soru getirir
5. Her doğru cevap → `onMissionComplete(true, attempts, timeMs, derivedCatId)`:
   - `derivedCatId = cats[floor(_origIdx/3)].id` (cat0..cat4)
   - `progress.recordCategoryAnswer(activeRegion, derivedCatId, true)`
6. 3. mission bitti → `onAllMissionsComplete()`:
   - `resetRegionGameOrder(activeRegion)` ← cache temizle ki sonraki tur farklı sorular gelsin
   - 5/5 cat done? → `goToBadge()` (badge ceremony)
   - Değilse → `goToMap()` ← RegionIntro değil! Direkt haritaya

### 11.3 Map Akışı (Focused Flow)

1. JourneyMap'te (haritanın altı) bir kategori kartına tıkla
2. `onCategorySelect(rid, catId)` → App: `setActiveRegion + setActiveCategory + setScreen(MISSION)`
3. Mission `getMissionsForCategory(regionId, catId)` ile o kategorinin 3 sorusu
4. Aynı flow — `recordCategoryAnswer` ile kayıt
5. 3. mission → goToBadge (5/5 ise) veya goToMap

### 11.4 AllJourneyModal Akışı

1. TopBar'da 🛤️ Yolculuk Haritam butonuna tıkla
2. Modal açılır: 7 bölge × 5 kategori grid
3. Bir kategori kartına tıkla → `onCategorySelect(rid, catId)` → focused flow

### 11.5 BackpackModal (Çantam) Akışı

1. TopBar'da Çantam'a tıkla
2. Modal açılır:
   - Oyuncu bilgisi (isim + tarih + süre)
   - Genel stats (rozet, görev, doğruluk, quiz)
   - Bölge bölge ilerleme (her bölge için status)
   - **Kazanımlarım** (sınıfa göre KAZANIMLAR; tamamlanan/tamamlanacak)
   - Motivasyon mesajı (rozet sayısına göre)

### 11.6 Settings Menu (⚙️)

4 seçenek:
- ✏️ **Adımı Değiştir** — `prompt()` ile yeni isim, `setPlayerName`
- 📥 **İlerlememi İndir (JSON)** — `exportJson()` → blob download
- ℹ️ **Hakkında** — `alert` ile proje bilgisi
- 🔄 **Yeniden Başla** — `confirm` → `reset()` + `window.location.reload()`

---

## 12. ÖNEMLİ TEKNİK DETAYLAR

### 12.1 Babel-standalone Inline Pattern

```html
<script type="text/babel" data-presets="react">
const SCREENS = { WELCOME: 'welcome', ... };
Object.assign(window, { SCREENS });
</script>
```

`data-presets="react"` ile JSX preset belirtilir. Babel runtime'da derler.

### 12.2 Multiple useState Instance Tuzağı

```jsx
// ❌ YANLIŞ — ayrı state instance'ları
const App = () => {
  const progress = useProgress();
  return <ChildA progress={progress.getProgressMap()}/>;
};
const ChildA = () => {
  const progress = useProgress();  // BAŞKA bir instance!
  // App'in state'inden HABERSIZ
};

// ✅ DOĞRU — App'in instance'ını prop olarak paylaş
const App = () => {
  const progress = useProgress();
  return <ChildA progressInstance={progress}/>;
};
const ChildA = ({ progressInstance }) => {
  const progress = progressInstance || useProgress();
};
```

Bu paterni TÜM ekran komponentleri için uygula.

### 12.3 Game Order Cache

`_gameOrder.regions[regionId]` = cached random selection (3 görev). Sebep:
- Mid-mission map'e dön → tekrar gel: aynı sorular (UX tutarlılığı)
- Tam tur biti (3 done): `resetRegionGameOrder(regionId)` ile temizle (sonraki tur farklı sorular)
- Sınıf değişti: tüm cache temizle (`resetGameOrder()`)
- Identity değişti: aynısı

### 12.4 file:// Protokol Uyumluluğu

`<script src="local.js">` çalışır ama `<script type="text/babel" src="local.jsx">` çalışmaz (Babel `fetch` kullanır → CORS). Bu yüzden TÜM jsx içeriği `index.html` içine inline edilir.

### 12.5 CSS Tokens (`styles.css`)

Tüm renk ve tipografi `:root` üzerinden CSS değişkeni:
```css
:root {
  --bg-paper: #F5F0E1;
  --bg-cream: #FAF6EC;
  --ink: #3E2723;
  --title: #5D2E2E;
  --accent: #C62828;
  --success: #558B2F;
  --r-marmara: #1976D2;
  --r-karadeniz: #2E7D32;
  /* ... */
  --font-display: 'Caveat', cursive;
  --font-hand: 'Patrick Hand', cursive;
  --font-body: 'Quicksand', sans-serif;
}
```

Componentler `var(--xx)` ile referans verir → tek noktadan tema yönetimi.

---

## 13. PEDAGOJİK TASARIM PRENSİPLERİ

| Prensip | Uygulama |
|---------|----------|
| **Bloom Taksonomisi** | Mission tipleri katmanlı: tanıma (single-choice) → anlama (multi-select) → uygulama (scenario, map-mark) |
| **Hikaye + Bağlam** | Her bölgenin RegionIntro'sunda narrative + facts kart |
| **Anında geri bildirim** | Doğru: yeşil pulse + sparkle; Yanlış: shake + ipucu |
| **Görsel ödül** | Topic icons + rozetler + JourneyMap fill animasyonu |
| **Çoklu öğrenme döngüsü** | Mixed flow (random) + Focused flow (kategori) → öğrenci tercih eder |
| **Veri toplama (DBR)** | sessionLog'a tüm event'ler timestamp ile yazılır; öğretmen JSON ile dışa aktarır |
| **Ölçülebilir kazanım** | KAZANIMLAR ekranı MEB koduyla birlikte tamamlanma durumu |
| **Sınıf seviyesi adaptasyon** | Aynı yapı 4 farklı zorluk/tema seviyesinde içerik (5-6-7-8) |

---

## 14. REPLICATION CHECKLIST

Başka bir uygulamada aynı yapıyı kurmak için:

### Adım 1: Stack Kurulumu
- [ ] `index.html` dosyası oluştur
- [ ] `<head>` içine Google Fonts + Leaflet + Leaflet.markercluster + React 18 + Babel CDN
- [ ] `styles.css` dosyası — design token'ları + utility class'lar

### Adım 2: Veri Hazırla
- [ ] **GeoJSON:** Konunun coğrafi/yapısal birimlerini içeren GeoJSON (örn. il sınırları)
- [ ] **İçerik (questions):** Her birim × her seviye × N soru havuzu
- [ ] **Kategoriler:** Her birim için 5 kategori (her seviyeye özel)
- [ ] **Kazanımlar:** Müfredat kazanımları + birim eşlemesi
- [ ] **Topic icons:** Her birim × her seviye × 8 ikon (emoji+lat/lng+açıklama)

### Adım 3: State
- [ ] localStorage anahtarı + initial state
- [ ] `useProgress` custom hook (setters + getters)
- [ ] Categories tracking + `recordCategoryAnswer`

### Adım 4: Komponentler
- [ ] `MainMap` (Leaflet + GeoJSON + clustering + dynamic icons)
- [ ] `JourneyMap` (single unit category bars)
- [ ] `AllJourneyModal` (all units grid)
- [ ] `BackpackModal` (player stats + kazanımlar)
- [ ] `Mission` (5 question types)
- [ ] `Welcome` (name + level selector)
- [ ] `BadgeCeremony`, `Quiz`, `Final`

### Adım 5: Akış
- [ ] App routing (state-based switch/case)
- [ ] Identity change reset logic (Welcome → App.handleStart)
- [ ] Mission flow: mixed (random) + focused (category)
- [ ] Cache invalidation (`_gameOrder.regions`)
- [ ] Single useProgress instance pattern (prop drilling)

### Adım 6: Test
- [ ] `file://` ile direkt aç
- [ ] Konsol temiz olmalı
- [ ] Tek tek tüm akışları test et
- [ ] Different identity → reset doğru tetikleniyor mu?
- [ ] Mission complete → JourneyMap güncelleniyor mu?

---

## 15. BİLİNEN MİMARİ KARARLAR

### "Neden modülsüz vanilla JS+Babel?"
- File:// dağıtım, build pipeline'sız sınıf ortamı kurulumu
- Webpack/Vite gibi araçlar setup eşiğini yükseltir
- Babel-standalone yeterince hızlı (modern bilgisayarda <1s ilk yük)

### "Neden Leaflet + Leaflet.markercluster?"
- Açık kaynak, ücretsiz, popüler
- Vector polygon + raster tile birlikte
- Custom marker (DivIcon) ile emoji+CSS animation kolay
- Cluster plugin standardı

### "Neden CartoDB Voyager Light?"
- Açık ton (kazanım ikonlarıyla kontrast)
- Label-light (harita kalabalık olmaz)
- HTTPS + ücretsiz + güvenilir

### "Neden grade-aware her şey?"
- MEB Sosyal Bilgiler müfredatı 5-8 sınıflarda kademeli derinleşir
- Aynı bölge farklı sınıfta farklı temayla işlenir
- Ortaokul boyunca aynı uygulamayı kullanmak için seviye adaptasyonu şart

### "Neden Mixed + Focused dual flow?"
- Mixed: hızlı tarama, çeşitlilik (DBR'ın varyans ihtiyacı)
- Focused: özelleşmiş öğrenme (eksik kazanım için drill-down)
- Öğrenci tercihi → motivation up

---

## 16. SON NOTLAR

**Toplam İçerik:**
- 580 soru (4×7×15 + 4×40)
- 224 ikon (4×7×8)
- 140 kategori (4×7×5)
- 48 kazanım (4×12)
- 81 il polygon
- 7 bölge sahne SVG'si

**Toplam Kod:** `index.html` ~510KB (tüm inline)

**Çalıştırma:** `open index.html` — Mac, Windows, Linux fark etmez. İnternet bağlantısı sadece tile yüklemek için.

**Lisans:** Eğitim amaçlı; tile servisi (CartoDB) ücretsiz kullanım kotası içinde.

---

**Hazırlayan:** Türkiye'yi Keşfet projesi
**Son güncelleme:** 2026-05-10
**Yazar Notu:** Bu dokümantasyon, projeyi başka bir uygulamaya transfer etmek için referans niteliğindedir. Sorular için kaynak kodun ilgili bölümüne bakınız.
