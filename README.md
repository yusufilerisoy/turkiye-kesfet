# 🇹🇷 Türkiye'yi Keşfet — Transfer Paketi

> Bu paket, **Türkiye'yi Keşfet** eğitim oyununun başka bir bilgisayara/ortama taşınması için gerekli tüm dosyaları içerir.

---

## 🚀 Hızlı Başlangıç (En Kolay Yol)

### Yöntem 1: Sadece Çalıştır

Sadece **2 dosya** yeterli: `index.html` + `styles.css`

```bash
# Bu klasörü kopyalayın, sonra:
open index.html
```

`index.html` **self-contained**'dir (~512KB inline) — tüm React komponentleri, 580 soru, 224 ikon, GeoJSON ve mantık tek dosyada. `styles.css` ile birlikte tarayıcıda direkt çalışır.

**Şartlar:**
- Modern tarayıcı (Chrome/Firefox/Safari/Edge — son 2 yıl içinde çıkmış)
- İnternet bağlantısı (sadece harita tile'ları + Google Fonts için)

---

## 📁 Paket İçeriği

```
TurkiyeKesfet-Paket/
├── README.md                    ← Bu dosya (hızlı başlangıç)
├── ARCHITECTURE.md              ← Detaylı mimari (700+ satır)
│
├── index.html                   ← ⭐ ANA DOSYA (self-contained, çift tıkla aç)
├── styles.css                   ← Design tokens + utility class'lar
│
└── src/                         ← Geliştirme kaynakları (modular)
    ├── app.jsx                  ← Ana App komponenti, ekran routing
    ├── state/
    │   ├── router.jsx           ← SCREENS enum
    │   └── progress.jsx         ← useProgress hook + localStorage
    ├── data/
    │   ├── content.jsx          ← Legacy soru havuzu
    │   └── content_graded.jsx   ← 580 soru (4 sınıf × 7 bölge × 15 görev + 4 × 40 quiz)
    ├── lib/
    │   ├── components.jsx       ← TurkeyMap, Badge, BackpackModal, JourneyMap, vs.
    │   ├── regionScenes.jsx     ← 7 bölge için stilize SVG sahneleri
    │   ├── regionTopicIconsGraded.js  ← 224 ikon (4×7×8)
    │   ├── turkeyGeo.js         ← 81 il GeoJSON + bölge eşlemesi
    │   └── turkeyMask.js        ← Eski raster mask (artık kullanılmıyor)
    └── screens/
        ├── Welcome.jsx          ← Karşılama (isim + sınıf seçici)
        ├── Map.jsx              ← Ana harita ekranı
        ├── RegionIntro.jsx      ← Bölge bilgi modalı
        ├── Mission.jsx          ← Mini görev (5 tip)
        ├── BadgeCeremony.jsx    ← Rozet kazanım töreni
        ├── Quiz.jsx             ← Final quiz (15 soru, timer)
        └── Final.jsx            ← Tebrik ekranı
```

> ⚠️ **Önemli:** `src/` altındaki tüm dosyalar **`index.html` içine zaten inline edilmiş** durumda. `src/` sadece **geliştirme/anlama** referansıdır. Çalıştırmak için ekstra setup gerektirmez.

---

## 🎮 Oyun Akışı

1. **Welcome:** Öğrenci adını girer + sınıfını (5/6/7/8) seçer
2. **Ana Harita:** Türkiye haritası — 7 bölge tıklanabilir, kategoriler haritanın altında
3. **Bölge tıkla:** RegionIntro açılır (bölge bilgisi + "Göreve Başla")
4. **Görev:** 3 random soru gelir (mixed flow), doğru cevaplar ait olduğu kategoriye otomatik kredi
5. **Yolculuk Haritam:** Kategori click ile odaklanmış 3 soru (focused flow)
6. **5/5 kategori done** → Bölge "mastered" → Rozet ceremony 🏆
7. **7/7 bölge done** → Final Quiz (15 soru, 15sn timer, 50:50 ipucu)
8. **Final ekranı** → "Coğrafya Ustası!" sertifikası

---

## 📚 İçerik İstatistikleri

| Boyut | Sayı |
|-------|------|
| Toplam soru | **580** (4 sınıf × 7 bölge × 15 görev + 4 × 40 quiz) |
| Mini görev | 420 (sınıf bazlı) |
| Quiz sorusu | 160 (sınıf bazlı) |
| Topic ikon | **224** (4 × 7 × 8) |
| Kazanım kategorisi | **140** (4 × 7 × 5) |
| MEB kazanımı | 48 (4 × 12) |
| Coğrafi sınır | 81 il + 7 bölge |
| Soru tipi | 5 (single, multi, drag, scenario, map-mark) |

---

## 🛠️ Teknik Özet

| | |
|---|---|
| **Stack** | React 18 + Babel-standalone (CDN, build YOK) |
| **Harita** | Leaflet 1.9.4 + leaflet.markercluster + CartoDB tiles |
| **State** | useState + localStorage (`tk_state` anahtarı) |
| **Stil** | CSS değişkenleri + inline (no Tailwind/styled-components) |
| **Fontlar** | Google Fonts (Caveat, Patrick Hand, Quicksand, Source Sans 3) |
| **Çalışma protokolü** | `file://` (çift tıkla aç) veya HTTP server |
| **TypeScript** | YOK (vanilla JS) |
| **Backend** | YOK (tamamen client-side) |

---

## 🧪 Test Senaryoları

Sayfa açıldığında bu adımları izleyerek doğrulayabilirsiniz:

- [ ] Welcome ekranında isim + sınıf seçici görünür
- [ ] "Maceraya Başla" → harita ekranı
- [ ] TopBar'da: 🎒 Çantam | Rozetlerim 0/7 | 🛤️ Yolculuk Haritam | ⚙️ Ayarlar
- [ ] Bir bölgeye (örn. Marmara) tıkla → RegionIntro modalı açılır
- [ ] "Göreve Başla" → 3 random soru
- [ ] Doğru cevap → yeşil pulse + Map'e dön
- [ ] JourneyMap'te (haritanın altı) ilgili kategorinin progress'i %100 dolar
- [ ] Bölgenin haritasında topic ikonu (örn. 🌉 Boğaz Köprüsü) belirir
- [ ] Çantam'a tıkla → BackpackModal: stats + bölge ilerleme + KAZANIMLAR (sınıfa göre)
- [ ] 🛤️ Yolculuk Haritam butonu → tüm 7 bölgenin kategorileri grid
- [ ] ⚙️ Settings → Adımı Değiştir / İlerlememi İndir / Yeniden Başla / Hakkında
- [ ] 5 kategori tamamla → Rozet ceremony 🏆
- [ ] Welcome'a dön (Yeniden Başla) → farklı sınıf seç → kazanımlar/ikonlar/sorular değişir

---

## 🌐 Başka Bir Bilgisayara Taşıma

### Yöntem A: Tüm Klasörü Kopyala
```bash
# Bu klasörü zip'le veya USB ile taşı
zip -r TurkiyeKesfet-Paket.zip TurkiyeKesfet-Paket/
```

### Yöntem B: Sadece Çalışır 2 Dosya
```bash
# Sadece bu 2 dosya yeter:
cp index.html styles.css /başka/lokasyon/
```

### Yöntem C: GitHub / Cloud
- Tüm klasörü GitHub repo'ya yükle
- GitHub Pages ile yayınla (statik site, build gerekmez)

---

## 🔄 Başka Bir Konu/Ders İçin Replikasyon

Bu yapıyı başka bir eğitim uygulamasına dönüştürmek için **`ARCHITECTURE.md`** dosyasındaki:
- **Bölüm 14: Replication Checklist** — adım adım rehber
- **Bölüm 12: Önemli Teknik Detaylar** — sık tuzaklar
- **Bölüm 11: Akış Detayları** — kullanıcı yolculuğu

dökümanlarını referans alın.

Ana değişim noktaları:
1. **GeoJSON** → kendi konunuzun coğrafi/yapısal verisi
2. **REGIONS_CONTENT_GRADED** → kendi soru havuzunuz
3. **CATEGORIES_BY_REGION_GRADED** → kendi kategorileriniz
4. **REGION_TOPIC_ICONS_GRADED** → kendi temalı ikonlarınız
5. **KAZANIMLAR** → kendi kazanım/öğrenme hedefleriniz

Komponent yapısı, state yönetimi, ekran routing aynı kalır.

---

## 📝 Lisans ve Kaynaklar

- **Leaflet**: BSD 2-Clause
- **CartoDB Voyager**: Free tier (yüksek hacim için ücret)
- **OpenStreetMap data**: ODbL
- **Google Fonts**: SIL Open Font License
- **Eğitsel içerik**: MEB Sosyal Bilgiler müfredatı odaklı
- **GeoJSON kaynağı**: github.com/cihadturhan/tr-geojson

---

## 📞 İletişim

Bu projeyle ilgili sorular için **`ARCHITECTURE.md`** içindeki teknik dokümana bakın.

**Son güncelleme:** 2026-05-10
**Versiyon:** v1.0 — Production
