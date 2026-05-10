/* RegionIntro.jsx — Bölge tanıtım modal ekranı (M3a)
   Public API:
     window.RegionIntroScreen = ({ regionId, onStartMission, onClose }) => JSX

   Design referansı: src/screens/_design-reference.jsx::RegionIntroScreen
   - Arka planda saydam Türkiye haritası
   - Üstte dinamik <RegionScene region={regionId}/>
   - Bölge bilgileri: getRegion(regionId).intro.* + facts grid
   - Bölge rengi şeridi: var(--r-${regionId})
*/

const RegionIntroScreen = ({ regionId, onStartMission, onClose }) => {
  // Güvenlik: regionId yoksa varsayılan
  const safeId = regionId || 'karadeniz';

  // getRegion window'da tanımlı; yoksa düzgün şekilde null fallback
  const region = (window.getRegion && window.getRegion(safeId)) || {};
  const intro = region.intro || {};
  const facts = Array.isArray(intro.facts) ? intro.facts : [];

  // window'dan komponentleri al (M1/M3b dosyaları yüklenmiş olmalı)
  const TurkeyMap = window.TurkeyMap;
  const Badge = window.Badge;
  const RegionScene = window.RegionScene;
  const REGIONS = window.REGIONS || [];

  // Bölge sırası (3. bölge gibi etiket için)
  const idx = REGIONS.findIndex(r => r.id === safeId);
  const orderLabel = idx >= 0 ? `${idx + 1}. Bölge — Görev Açılıyor` : 'Görev Açılıyor';

  // Bölge rengi (CSS değişkeni)
  const regionColor = `var(--r-${safeId})`;

  // Bölge adı: "X Bölgesi"
  const regionDisplayName = (region.name || '') + ' Bölgesi';

  // Görev başlığı (rozet emoji + isim)
  const missionTitle = intro.missionTitle || 'Bölge Görevi';
  const badgeEmoji = region.badge || '🌟';

  // Hikâye paragrafı
  const story = intro.story || '';

  // Tahmini süre
  const estimatedMin = intro.estimatedMin || '4–6';

  return (
    <div style={{
      position: 'fixed', inset: 0,
      fontFamily: 'var(--font-body)', color: 'var(--ink)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      zIndex: 1000,
    }} className="paper">
      {/* Arkadaki saydam harita */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.32, padding: 80, pointerEvents: 'none' }}>
        {TurkeyMap && (
          <TurkeyMap
            progress={{ [safeId]: 'open' }}
            hoverable={false}
            decorative
            highlightRegion={safeId}
          />
        )}
      </div>

      {/* Koyu overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(62,39,35,.55)',
        pointerEvents: 'none',
      }}/>

      {/* Modal kart */}
      <div className="paper-cream deckle"
           role="dialog"
           aria-modal="true"
           aria-labelledby="region-intro-title"
           style={{
             position: 'relative',
             maxWidth: 880,
             width: '100%',
             maxHeight: 'calc(100vh - 32px)',
             borderRadius: 22,
             overflow: 'hidden',
             border: '1.5px solid var(--rule)',
             boxShadow: '0 20px 60px rgba(62,39,35,.4)',
             zIndex: 1,
             display: 'flex',
             flexDirection: 'column',
           }}>
        {/* Banner — bölge sahnesi (fixed top) */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {RegionScene
            ? <RegionScene region={safeId}/>
            : <div style={{ height: 180, background: regionColor }}/>
          }
          <button
            onClick={onClose}
            aria-label="Kapat"
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--bg-cream)',
              border: '1.5px solid var(--ink-mute)',
              fontSize: 18, cursor: 'pointer', color: 'var(--ink)',
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--font-body)', fontWeight: 700,
            }}>
            ✕
          </button>
          {/* Bölge rengi şeridi */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            height: 6, background: regionColor,
          }}/>
        </div>

        {/* İçerik (scrollable if too tall) */}
        <div style={{ padding: '22px 32px 26px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            {Badge && <Badge region={safeId} size={72} label={null}/>}
            <div style={{ flex: 1, minWidth: 220 }}>
              <div className="t-label" style={{ fontSize: 11 }}>{orderLabel}</div>
              <div id="region-intro-title" style={{
                fontFamily: 'var(--font-display)', fontSize: 52,
                color: 'var(--title)', lineHeight: 1,
              }}>
                {regionDisplayName}
              </div>
              <div style={{
                fontFamily: 'var(--font-hand)', fontSize: 22,
                color: regionColor, fontWeight: 700,
              }}>
                {badgeEmoji} Görev: {missionTitle}
              </div>
            </div>
          </div>

          {/* Hikâye kartı */}
          {story && (
            <div className="card" style={{
              marginTop: 22, fontStyle: 'italic',
              borderColor: 'var(--rule)',
            }}>
              <p style={{ margin: 0, fontSize: 17, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                "{story}"
              </p>
            </div>
          )}

          {/* Bilgi kartları (4 adet, 2x2 grid) */}
          {facts.length > 0 && (
            <div style={{
              marginTop: 22,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 12,
            }}>
              {facts.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px',
                  background: 'var(--bg-paper)',
                  border: '1.5px dashed var(--rule)',
                  borderRadius: 12,
                }}>
                  <div style={{ fontSize: 26, lineHeight: 1 }}>{f.icon}</div>
                  <div>
                    <div className="t-label" style={{ fontSize: 11 }}>{f.label}</div>
                    <div style={{
                      fontFamily: 'var(--font-hand)', fontSize: 19,
                      color: 'var(--ink)', fontWeight: 700,
                    }}>
                      {f.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Alt aksiyon barı */}
                      <div style={{
            marginTop: 26,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: 14, flexWrap: 'wrap',
          }}>
            <div className="t-label" style={{ fontSize: 11 }}>
              Tahmini süre · {estimatedMin} dk · 3 mini görev
            </div>
            <button
              onClick={() => onStartMission && onStartMission()}
              className="btn btn-lg"
              style={{
                background: regionColor,
                color: '#FFF7EB',
                borderColor: 'rgba(0,0,0,.25)',
                boxShadow: '0 2px 0 rgba(0,0,0,.25), 0 8px 18px rgba(0,0,0,.22)',
                fontWeight: 700,
              }}>
              ⚡ Göreve Başla
            </button>
          </div>
                  </button>
                );
              })}
            </div>
            <div style={{
              marginTop: 12, fontSize: 11, color: 'var(--ink-mute)', textAlign: 'center',
              fontFamily: 'var(--font-hand)',
            }}>
              Her kategoride 3 soru · Her birini tamamlayarak rozeti kazan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { RegionIntroScreen });
