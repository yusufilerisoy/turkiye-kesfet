/* Map.jsx — M2: Hazine haritası ekranı.
   Public API: window.MapScreen = ({ onRegionClick, onAllComplete }) => JSX;
   - useProgress.getProgressMap() ile bölge statüleri.
   - TurkeyMap'e onRegionClick prop'u ile bağlanır (kilitli bölgeler tıklanmaz — TurkeyMap içsel kontrol eder).
   - "Sıra X'de" başlığı: ilk açık ama tamamlanmamış bölge.
   - Sağdaki teaser metni: bölgeye özgü.
   - Rozet kuşağı progress'e göre dinamik (REGIONS sırası).
   - 7 rozet tamamlanırsa onAllComplete tetiklenir.
*/
const { useEffect: useEffectMap, useMemo: useMemoMap, useState: useStateMap } = React;

/* Bölgeye özgü teaser metinleri (görev: data tablosu).
   REGIONS_CONTENT zaten bu teaser'ları içeriyor — fallback olarak kullan;
   yoksa lokal tabloya düş. */
const MAP_TEASERS = {
  marmara:    "🌊 Boğazlar, köprüler ve sanayi şehirleri seni bekliyor",
  karadeniz:  "🌧️ Yağmurlu ormanlar ve çay tarlaları seni bekliyor",
  ege:        "🌿 Zeytinlikler ve antik kıyıların büyüsü",
  icanadolu:  "🌾 Geniş bozkırlar ve başak tarlaları seni bekliyor",
  akdeniz:    "☀️ Mavi deniz, narenciye bahçeleri ve antik kıyılar",
  doguanadolu:"⛰️ Karlı sıradağlar ve Türkiye'nin çatısı seni çağırıyor",
  guneydogu:  "🔥 Pamuk tarlaları, GAP ve sıcak güneş",
};

const teaserFor = (regionId) => {
  if (!regionId) return '';
  const rc = (window.REGIONS_CONTENT && window.REGIONS_CONTENT[regionId]) || null;
  if (rc && rc.teaser) return rc.teaser;
  return MAP_TEASERS[regionId] || '';
};

const MapScreen = ({ progressInstance, onRegionClick, onCategorySelect, onAllComplete, playerName: playerNameProp, earned: earnedProp, progress: progressMapProp, regionsProgress: regionsProgressProp, selectedRegion: selectedRegionProp }) => {
  // App'in progress instance'ı varsa onu kullan (tek doğruluk kaynağı).
  // Yoksa lokal fallback (legacy / standalone use için).
  const progress = progressInstance || window.useProgress();
  const progressMap = progressMapProp || progress.getProgressMap();
  const earned = (typeof earnedProp === 'number') ? earnedProp : progress.earnedBadgeCount();
  const playerName = playerNameProp || (progress.state && progress.state.playerName) || 'Maceracı';
  const REGIONS = window.REGIONS || [];

  // Sıra hangi bölgede? — REGIONS sırasında, status === 'open' olan ilk bölge.
  const nextRegion = useMemoMap(() => {
    return REGIONS.find(r => progressMap[r.id] === 'open') || null;
  }, [REGIONS, JSON.stringify(progressMap)]);

  // 7 rozet tamamlandığında onAllComplete tetikle.
  useEffectMap(() => {
    if (earned === 7 && typeof onAllComplete === 'function') {
      onAllComplete();
    }
  }, [earned, onAllComplete]);

  const handleRegionClick = (regionId) => {
    const status = progressMap[regionId];
    if (status === 'locked') return;
    setSelectedRegion(regionId);
    if (typeof onRegionClick === 'function') onRegionClick(regionId);
  };

  // === Settings menu handlers ===
  const handleChangeName = () => {
    const current = progress.state && progress.state.playerName || '';
    const newName = window.prompt('Yeni adın:', current);
    if (newName !== null && newName.trim()) {
      progress.setPlayerName(newName.trim());
    }
  };

  const handleExport = () => {
    const json = progress.exportJson ? progress.exportJson() : JSON.stringify(progress.state || {}, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (progress.state && progress.state.playerName || 'oyuncu').replace(/[^\w-]/g, '_');
    a.href = url;
    a.download = `turkiye-kesfet-${safeName}-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const handleAbout = () => {
    window.alert(
      "🇹🇷 Türkiye'yi Keşfet\n" +
      "Bir Coğrafya Macerası\n\n" +
      "Ortaokul (5–7. sınıf) öğrencileri için Türkiye'nin 7 coğrafi bölgesini öğreten oyun-tabanlı öğrenme uygulaması.\n\n" +
      "📚 Pedagojik temel: Tasarım Temelli Araştırma (DBR), Gee (2003), Prensky (2001)\n" +
      "🗺️ Harita: OpenStreetMap & CartoDB\n" +
      "📊 81 il · 7 bölge · 21 mini görev · 15 quiz sorusu\n\n" +
      "Eğitim için sevgiyle geliştirildi 💛"
    );
  };

  const handleReset = () => {
    if (!window.confirm('Tüm ilerlemeyi sıfırlamak istiyor musun?\n\nKazandığın rozetler ve quiz skoru silinecek. Bu işlem geri alınamaz.')) return;
    if (progress.reset) progress.reset();
    window.location.reload();
  };

  // === Backpack modal ===
  const [backpackOpen, setBackpackOpen] = useStateMap(false);
  const [allJourneyOpen, setAllJourneyOpen] = useStateMap(false);
  // selectedRegion: App'tan gelen prop'u öncelikli kullan; lokal state sadece ilk render fallback'i
  const [localSelectedRegion, setLocalSelectedRegion] = useStateMap(selectedRegionProp || 'marmara');
  useEffectMap(() => {
    if (selectedRegionProp) setLocalSelectedRegion(selectedRegionProp);
  }, [selectedRegionProp]);
  const selectedRegion = selectedRegionProp || localSelectedRegion;
  const setSelectedRegion = setLocalSelectedRegion;
  // regionsProgress: App'tan gelen prop'u kullan (yeni kayıtlar burada)
  const regionsProgress = regionsProgressProp || (progress.state && progress.state.regionsProgress) || {};

  const headlineTitle = nextRegion
    ? `Sıra ${nextRegion.name}'de`
    : 'Tüm açık bölgeleri keşfettin!';

  const headlineTeaser = nextRegion
    ? teaserFor(nextRegion.id)
    : (earned === 7
        ? '🏆 Final sınavına hazır mısın?'
        : '✨ Yeni bölgelerin açılması için bölgeleri tamamlamaya devam et');

  return (
    <div className="paper" style={{
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-body)',
      color: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <window.TopBar
        name={playerName}
        earned={earned}
        total={7}
        onChangeName={handleChangeName}
        onExport={handleExport}
        onAbout={handleAbout}
        onReset={handleReset}
        onChantamClick={() => setBackpackOpen(true)}
        onJourneyClick={() => setAllJourneyOpen(true)}
        progressMap={progressMap}
      />
      {allJourneyOpen && window.AllJourneyModal && (
        <window.AllJourneyModal
          regionsProgress={regionsProgress}
          onClose={() => setAllJourneyOpen(false)}
          onCategorySelect={(rid, catId) => {
            setAllJourneyOpen(false);
            setSelectedRegion(rid);
            if (typeof onCategorySelect === 'function') onCategorySelect(rid, catId);
          }}
        />
      )}
      {backpackOpen && window.BackpackModal && (
        <window.BackpackModal progress={progress} onClose={() => setBackpackOpen(false)}/>
      )}

      {/* Header (flex-shrink) */}
      <div style={{ padding: '10px 56px 0', flexShrink: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}>
          <div>
            <div className="t-label" style={{ fontSize: 12 }}>Hazine Haritası</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36,
              color: 'var(--title)',
              lineHeight: 1,
            }}>
              {headlineTitle}
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-hand)',
            fontSize: 18,
            color: 'var(--ink-soft)',
            maxWidth: 480,
            textAlign: 'right',
          }}>
            {headlineTeaser}
          </div>
        </div>
      </div>

      {/* Map (flex 1 — fills remaining vertical space) */}
      <div style={{
        padding: '8px 56px 6px',
        flex: 1,
        minHeight: 0,
        display: 'flex',
      }}>
        <div style={{
          flex: 1,
          minHeight: 0,
          padding: 8,
          borderRadius: 16,
          background: 'var(--bg-cream)',
          border: '1.5px solid var(--rule)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
        }}>
          <window.TurkeyMap
            progress={progressMap}
            onRegionClick={handleRegionClick}
            height="100%"
          />
        </div>
      </div>

      {/* Yolculuk Haritam — kategori bazlı ilerleme (haritanın altında) */}
      {window.JourneyMap && (
        <window.JourneyMap
          regionId={selectedRegion}
          regionsProgress={regionsProgress}
          onCategorySelect={(rid, catId) => {
            setSelectedRegion(rid);
            if (typeof onCategorySelect === 'function') onCategorySelect(rid, catId);
          }}
        />
      )}
    </div>
  );
};

Object.assign(window, { MapScreen });
