/* Mission.jsx — M4: Mini görev ekranı (router + 5 alt-component).

   Public API:
     window.MissionScreen = ({ regionId, missionIndex,
                               onMissionComplete, onAllMissionsComplete, onBackToMap }) => JSX;

   Veri kaynağı:
     window.REGIONS_CONTENT[regionId].missions[missionIndex]
       - mission.type: 'single-choice' | 'multi-select' | 'drag-match' | 'scenario' | 'map-mark'
       - mission.title, mission.prompt, mission.hint
       - mission.options (single/multi/scenario)
       - mission.correct: number (single/scenario) | number[] (multi)
       - mission.pairs: [{left, right}] (drag-match)
       - mission.targetRegionId, mission.distractors (map-mark)
       - mission.story (scenario)

   Davranış:
     - Üst bar: "← Haritaya Dön", bölge adı + görev başlığı, görev sayacı (1/3)
     - Alt-component selection state'i tutar; "Cevabı Kontrol Et" disabled iken seçim yapılana kadar pasif
     - Doğru: yeşil pulse + sparkle, 800ms sonra onMissionComplete(true, attempts+1, timeMs).
       Eğer son görevse onAllMissionsComplete(); değilse parent nextMission() yapar.
     - Yanlış: shake animasyonu, 600ms sonra reset; ipucu butonu visible olur.
     - "💡 İpucu" butonu: mission.hint metnini sarı kart olarak gösterir.
     - "← Haritaya Dön": onBackToMap(); bu görevi yarım bırakır (kayıt yok).
*/

const { useState: useStateMission, useEffect: useEffectMission, useRef: useRefMission, useMemo: useMemoMission } = React;

/* ====== CSS injection (animasyonlar + reduced-motion saygısı) ====== */
(function injectMissionStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('tk-mission-styles')) return;
  const css = `
@keyframes tk-mission-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
@keyframes tk-mission-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(85,139,47,.6), 0 0 0 0 rgba(85,139,47,.4); }
  60%  { box-shadow: 0 0 0 18px rgba(85,139,47,0), 0 0 28px 6px rgba(85,139,47,.35); }
  100% { box-shadow: 0 0 0 0 rgba(85,139,47,0), 0 0 0 0 rgba(85,139,47,0); }
}
@keyframes tk-sparkle-pop {
  0%   { transform: scale(0) rotate(0deg); opacity: 0; }
  40%  { transform: scale(1.2) rotate(20deg); opacity: 1; }
  100% { transform: scale(1) rotate(360deg); opacity: 0; }
}
.tk-mission-shake { animation: tk-mission-shake 400ms ease-in-out; }
.tk-mission-pulse-correct { animation: tk-mission-pulse 800ms ease-out; border-color: var(--success) !important; }
.tk-sparkle { animation: tk-sparkle-pop 800ms ease-out forwards; }
@media (prefers-reduced-motion: reduce) {
  .tk-mission-shake, .tk-mission-pulse-correct, .tk-sparkle { animation: none !important; }
}
`;
  const style = document.createElement('style');
  style.id = 'tk-mission-styles';
  style.textContent = css;
  document.head.appendChild(style);
})();

/* =====================================================================
   YARDIMCILAR
   ===================================================================== */

const arraysEqualAsSets = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const sa = new Set(a);
  for (const x of b) if (!sa.has(x)) return false;
  return true;
};

/* =====================================================================
   ALT-COMPONENT 1 — SingleChoiceMission
   selection: number (index) | null
   ===================================================================== */
const SingleChoiceMission = ({ mission, selection, setSelection, locked }) => {
  const options = mission.options || [];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  return (
    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {options.map((opt, i) => {
        const isSel = selection === i;
        return (
          <button
            key={i}
            type="button"
            className="card"
            disabled={locked}
            onClick={() => !locked && setSelection(i)}
            aria-pressed={isSel}
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              textAlign: 'left',
              cursor: locked ? 'default' : 'pointer',
              background: isSel ? '#FFF3E5' : 'var(--bg-cream)',
              borderColor: isSel ? 'var(--accent)' : 'var(--rule-soft)',
              borderWidth: 2,
              borderStyle: 'solid',
              boxShadow: isSel ? '0 4px 14px rgba(198,40,40,.18)' : 'var(--shadow-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: 18,
              color: 'var(--ink)',
              padding: '16px 20px',
              transition: 'all .15s ease',
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              border: '2px solid ' + (isSel ? 'var(--accent)' : 'var(--ink-mute)'),
              background: isSel ? 'var(--accent)' : 'transparent',
              color: isSel ? '#FFF7EB' : 'var(--ink-mute)',
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--font-hand)', fontSize: 16, fontWeight: 700,
            }}>{letters[i] || (i + 1)}</div>
            <span style={{ flex: 1 }}>{opt}</span>
            {isSel && (
              <span style={{
                color: 'var(--accent)', fontFamily: 'var(--font-hand)', fontWeight: 700, fontSize: 16
              }}>seçildi</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

/* =====================================================================
   ALT-COMPONENT 2 — MultiSelectMission
   selection: number[]  (sıralı array, ama set olarak karşılaştırılır)
   ===================================================================== */
const MultiSelectMission = ({ mission, selection, setSelection, locked }) => {
  const options = mission.options || [];
  const sel = Array.isArray(selection) ? selection : [];
  const toggle = (i) => {
    if (locked) return;
    const idx = sel.indexOf(i);
    if (idx >= 0) {
      setSelection(sel.filter(x => x !== i));
    } else {
      setSelection([...sel, i]);
    }
  };
  return (
    <div>
      <div style={{
        marginTop: 14, fontFamily: 'var(--font-hand)', fontSize: 16,
        color: 'var(--ink-soft)', textAlign: 'center',
      }}>
        ✓ Birden fazla doğru cevap olabilir
      </div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {options.map((opt, i) => {
          const isSel = sel.indexOf(i) !== -1;
          return (
            <button
              key={i}
              type="button"
              className="card"
              disabled={locked}
              onClick={() => toggle(i)}
              aria-pressed={isSel}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                textAlign: 'left',
                cursor: locked ? 'default' : 'pointer',
                background: isSel ? '#E9F4DC' : 'var(--bg-cream)',
                borderColor: isSel ? 'var(--success)' : 'var(--rule-soft)',
                borderWidth: 2,
                borderStyle: 'solid',
                boxShadow: isSel ? '0 4px 14px rgba(85,139,47,.22)' : 'var(--shadow-sm)',
                fontFamily: 'var(--font-body)', fontSize: 18,
                color: 'var(--ink)', padding: '14px 18px',
                transition: 'all .15s ease',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                border: '2px solid ' + (isSel ? 'var(--success)' : 'var(--ink-mute)'),
                background: isSel ? 'var(--success)' : 'transparent',
                color: '#FFF7EB',
                display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 16,
              }}>
                {isSel ? '✓' : ''}
              </div>
              <span style={{ flex: 1 }}>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* =====================================================================
   ALT-COMPONENT 3 — DragMatchMission
   mission.pairs: [{ left, right }]
   selection: { [leftIndex]: rightValue } — kullanıcının yaptığı eşleştirmeler
   Doğruluk: her left -> doğru right'a eşlenmiş mi?
   HTML5 DnD + tıkla-seç fallback (mobil/erişilebilirlik için).
   ===================================================================== */
const DragMatchMission = ({ mission, selection, setSelection, locked }) => {
  const pairs = mission.pairs || [];
  const leftItems = pairs.map(p => p.left);
  // Sağ taraf seçenekleri: pairs sırasında karıştırılmış (deterministik)
  const rightItems = useMemoMission(() => {
    const arr = pairs.map((p, i) => ({ value: p.right, originalIndex: i }));
    // Basit deterministik karıştırma: i*7 mod n bazında swap.
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (i * 7 + 3) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [pairs.length, JSON.stringify(pairs)]);

  const sel = (selection && typeof selection === 'object' && !Array.isArray(selection)) ? selection : {};
  const [draggedRight, setDraggedRight] = useStateMission(null); // sürüklenen sağ kart değeri
  const [hoveredLeft, setHoveredLeft] = useStateMission(null);
  const [pickedRight, setPickedRight] = useStateMission(null); // tıkla-seç fallback

  // Sağ tarafta hangi değerler hala kullanılabilir?
  const usedRights = new Set(Object.values(sel));

  const dropOnLeft = (leftIndex, rightValue) => {
    if (locked) return;
    if (!rightValue) return;
    // Eğer bu rightValue zaten başka bir left'e atanmışsa, oradan kaldır
    const newSel = { ...sel };
    Object.keys(newSel).forEach(k => {
      if (newSel[k] === rightValue) delete newSel[k];
    });
    newSel[leftIndex] = rightValue;
    setSelection(newSel);
    setDraggedRight(null);
    setHoveredLeft(null);
    setPickedRight(null);
  };

  const removeFromLeft = (leftIndex) => {
    if (locked) return;
    const newSel = { ...sel };
    delete newSel[leftIndex];
    setSelection(newSel);
  };

  return (
    <div>
      <div style={{
        marginTop: 12, fontFamily: 'var(--font-hand)', fontSize: 16,
        color: 'var(--ink-soft)', textAlign: 'center',
      }}>
        ✋ Sağdaki kartları sürükle ya da tıkla, sonra solda bir satıra bırak/tıkla.
      </div>

      <div style={{
        marginTop: 22,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 26,
      }}>
        {/* SOL: drop zone'lar (eşleştirme satırları) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="t-label" style={{ fontSize: 11 }}>Eşleştirme Satırları</div>
          {leftItems.map((leftLabel, li) => {
            const dropped = sel[li];
            const isHover = hoveredLeft === li;
            return (
              <div
                key={li}
                onDragOver={(e) => { if (!locked) { e.preventDefault(); setHoveredLeft(li); } }}
                onDragLeave={() => setHoveredLeft(null)}
                onDrop={(e) => { e.preventDefault(); dropOnLeft(li, draggedRight); }}
                onClick={() => { if (!locked && pickedRight) dropOnLeft(li, pickedRight); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 14,
                  border: '2px ' + (isHover ? 'solid' : 'dashed') + ' ' + (isHover ? 'var(--accent)' : 'var(--rule)'),
                  borderRadius: 12,
                  background: isHover ? '#FFF3E5' : 'var(--bg-cream)',
                  cursor: pickedRight && !locked ? 'pointer' : 'default',
                  minHeight: 64,
                  transition: 'background .15s, border-color .15s',
                }}
              >
                <div style={{
                  flex: '0 0 auto',
                  fontFamily: 'var(--font-hand)', fontSize: 20, fontWeight: 700,
                  color: 'var(--title)', minWidth: 110,
                }}>
                  {leftLabel}
                </div>
                <div style={{
                  flex: 1,
                  fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink)',
                }}>
                  {dropped ? (
                    <span
                      onClick={(e) => { e.stopPropagation(); removeFromLeft(li); }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '6px 12px',
                        background: 'var(--success)', color: '#FFF7EB',
                        borderRadius: 999, fontWeight: 700,
                        cursor: locked ? 'default' : 'pointer',
                      }}
                      title="Kaldırmak için tıkla"
                    >
                      ✓ {dropped} <span style={{ opacity: .8, fontSize: 14 }}>×</span>
                    </span>
                  ) : (
                    <span style={{ color: 'var(--ink-mute)', fontStyle: 'italic' }}>
                      buraya sürükle veya tıkla…
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* SAĞ: sürüklenebilir kartlar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="t-label" style={{ fontSize: 11 }}>Seçenekler</div>
          {rightItems.map((r, idx) => {
            const used = usedRights.has(r.value);
            const isPicked = pickedRight === r.value;
            return (
              <div
                key={idx}
                draggable={!locked && !used}
                onDragStart={() => !used && setDraggedRight(r.value)}
                onDragEnd={() => setDraggedRight(null)}
                onClick={() => {
                  if (locked || used) return;
                  setPickedRight(prev => prev === r.value ? null : r.value);
                }}
                style={{
                  padding: '12px 16px',
                  background: used ? '#E8DEC9' : (isPicked ? '#FFF3E5' : 'var(--bg-cream)'),
                  border: '2px solid ' + (isPicked ? 'var(--accent)' : (used ? 'var(--rule-soft)' : 'var(--ink-mute)')),
                  borderRadius: 12,
                  cursor: used ? 'default' : (locked ? 'default' : 'grab'),
                  fontFamily: 'var(--font-body)', fontSize: 16, color: used ? 'var(--ink-mute)' : 'var(--ink)',
                  textDecoration: used ? 'line-through' : 'none',
                  opacity: used ? 0.6 : 1,
                  transition: 'all .15s ease',
                  userSelect: 'none',
                }}
              >
                <span style={{ marginRight: 8, color: 'var(--ink-mute)' }}>⋮⋮</span>
                {r.value}
                {isPicked && !used && (
                  <span style={{
                    marginLeft: 10, fontFamily: 'var(--font-hand)',
                    color: 'var(--accent)', fontWeight: 700,
                  }}>← şimdi solda bir satıra tıkla</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
   ALT-COMPONENT 4 — ScenarioMission
   Üstte hikaye paragrafı, altta single-choice tarzı seçenekler
   ===================================================================== */
const ScenarioMission = ({ mission, selection, setSelection, locked }) => {
  return (
    <div>
      {(mission.story || mission.scenario) && (
        <div className="card" style={{
          marginTop: 16,
          fontStyle: 'italic',
          background: '#FFF9EE',
          borderColor: 'var(--rule)',
          borderLeftWidth: 4,
          borderLeftColor: 'var(--gold)',
        }}>
          <div className="t-label" style={{ fontSize: 11, marginBottom: 6 }}>📖 Hikâye</div>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
            {mission.story || mission.scenario}
          </p>
        </div>
      )}
      <SingleChoiceMission
        mission={mission}
        selection={selection}
        setSelection={setSelection}
        locked={locked}
      />
    </div>
  );
};

/* =====================================================================
   ALT-COMPONENT 5 — MapMarkMission
   TurkeyMap üzerinde sadece targetRegionId + distractors tıklanabilir
   ===================================================================== */
const MapMarkMission = ({ mission, selection, setSelection, locked }) => {
  // Hedef bölge field'ı: targetRegionId | correctRegion | options[correct]
  const target = mission.targetRegionId
    || mission.correctRegion
    || (Array.isArray(mission.options) && typeof mission.correct === 'number' ? mission.options[mission.correct] : null);

  const distractors = Array.isArray(mission.distractors) ? mission.distractors : [];
  const selectable = useMemoMission(() => {
    const set = new Set(distractors);
    if (target) set.add(target);
    return Array.from(set);
  }, [target, JSON.stringify(distractors)]);

  return (
    <div>
      <div style={{
        marginTop: 12, fontFamily: 'var(--font-hand)', fontSize: 16,
        color: 'var(--ink-soft)', textAlign: 'center',
      }}>
        🗺 Haritada doğru bölgeye tıkla
      </div>
      <div style={{
        marginTop: 18,
        padding: 16,
        borderRadius: 16,
        background: 'var(--bg-cream)',
        border: '1.5px solid var(--rule)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {window.TurkeyMap ? (
          <window.TurkeyMap
            progress={{}}
            hoverable={!locked}
            selectableRegions={selectable}
            highlightRegion={selection}
            onRegionClick={(id) => !locked && setSelection(id)}
          />
        ) : (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-mute)' }}>
            (Harita yüklenemedi)
          </div>
        )}
      </div>
      {selection && (
        <div style={{
          marginTop: 14, textAlign: 'center',
          fontFamily: 'var(--font-hand)', fontSize: 18, color: 'var(--accent)', fontWeight: 700,
        }}>
          Seçildi: <span style={{
            background: '#FFF3E5', padding: '2px 10px', borderRadius: 8,
            border: '1.5px solid var(--accent)',
          }}>
            {(window.REGIONS && window.REGIONS.find(r => r.id === selection) || {}).name || selection}
          </span>
        </div>
      )}
    </div>
  );
};

/* =====================================================================
   ANA EKRAN — MissionScreen (router + akış)
   ===================================================================== */
const MissionScreen = ({ regionId, categoryId, missionIndex = 0, onMissionComplete, onAllMissionsComplete, onBackToMap }) => {
  const REGIONS = window.REGIONS || [];
  const REGIONS_CONTENT = window.REGIONS_CONTENT || {};
  const regionMeta = REGIONS.find(r => r.id === regionId) || {};
  const regionData = REGIONS_CONTENT[regionId] || {};
  // Grade+category-aware: 3 missions from the specific category bucket of the grade pool
  const missionList = (categoryId && window.getMissionsForCategory ? window.getMissionsForCategory(regionId, categoryId) :
    (window.getMissionsForGame ? window.getMissionsForGame(regionId) : null)) ||
    (Array.isArray(regionData.missions) ? regionData.missions : []);
  const mission = missionList[missionIndex] || null;
  const totalMissions = Math.max(missionList.length, 3);
  const isLastMission = missionIndex >= totalMissions - 1;

  const [selection, setSelection] = useStateMission(null);
  const [feedback, setFeedback] = useStateMission(null); // 'correct' | 'wrong' | null
  const [hintShown, setHintShown] = useStateMission(false);
  const [attempts, setAttempts] = useStateMission(0);
  const startTimeRef = useRefMission(Date.now());
  const completedRef = useRefMission(false);

  // Görev değiştiğinde state'i resetle
  useEffectMission(() => {
    setSelection(null);
    setFeedback(null);
    setHintShown(false);
    setAttempts(0);
    startTimeRef.current = Date.now();
    completedRef.current = false;
  }, [regionId, categoryId, missionIndex]);

  // Mission yoksa fallback
  if (!mission) {
    return (
      <div className="paper-cream" style={{
        minHeight: '100vh', display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-body)', padding: 40, textAlign: 'center',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--title)' }}>
            Görev bulunamadı
          </div>
          <div style={{ marginTop: 8, color: 'var(--ink-mute)' }}>
            Bölge: {regionId || '—'} · İndeks: {missionIndex}
          </div>
          <button
            className="btn btn-primary"
            style={{ marginTop: 22 }}
            onClick={() => typeof onBackToMap === 'function' && onBackToMap()}
          >
            ← Haritaya Dön
          </button>
        </div>
      </div>
    );
  }

  // Cevap doğruluğu — selection + mission tipine göre
  const isAnswerCorrect = () => {
    if (selection === null || selection === undefined) return false;
    switch (mission.type) {
      case 'single-choice':
      case 'scenario':
        return selection === mission.correct;
      case 'multi-select':
        return arraysEqualAsSets(selection, mission.correct || []);
      case 'drag-match': {
        const pairs = mission.pairs || [];
        if (!selection || typeof selection !== 'object') return false;
        for (let i = 0; i < pairs.length; i++) {
          if (selection[i] !== pairs[i].right) return false;
        }
        return Object.keys(selection).length === pairs.length;
      }
      case 'map-mark': {
        const target = mission.targetRegionId
          || mission.correctRegion
          || (Array.isArray(mission.options) && typeof mission.correct === 'number' ? mission.options[mission.correct] : null);
        return selection === target;
      }
      default:
        return false;
    }
  };

  // Selection boş mu? "Cevabı Kontrol Et" disabled hesabı
  const hasSelection = (() => {
    if (selection === null || selection === undefined) return false;
    if (Array.isArray(selection)) return selection.length > 0;
    if (typeof selection === 'object') return Object.keys(selection).length > 0;
    return true;
  })();

  const isLocked = feedback === 'correct'; // doğru sonrası başka cevap kabul etme

  const handleCheck = () => {
    if (!hasSelection || isLocked) return;
    const correct = isAnswerCorrect();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (correct) {
      setFeedback('correct');
      if (completedRef.current) return;
      completedRef.current = true;
      const timeMs = Date.now() - startTimeRef.current;
      setTimeout(() => {
        // Derive category from mission's original pool index (cat = floor(origIdx/3))
        // ÖNEMLİ: getCategoriesForRegion() kullan — grade-aware id'ler (cat0..cat4) JourneyMap ile uyumlu olsun.
        const cats = (window.getCategoriesForRegion ? window.getCategoriesForRegion(regionId) :
                      ((window.CATEGORIES_BY_REGION && window.CATEGORIES_BY_REGION[regionId]) || []));
        const origIdx = (mission && typeof mission._origIdx === 'number') ? mission._origIdx : -1;
        const catIdx = origIdx >= 0 ? Math.floor(origIdx / 3) : -1;
        const derivedCatId = (catIdx >= 0 && cats[catIdx]) ? cats[catIdx].id : null;
        if (typeof onMissionComplete === 'function') {
          onMissionComplete(true, newAttempts, timeMs, derivedCatId);
        }
        if (isLastMission && typeof onAllMissionsComplete === 'function') {
          onAllMissionsComplete();
        }
      }, 800);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 600);
    }
  };

  const handleHint = () => setHintShown(true);

  const handleBack = () => {
    if (typeof onBackToMap === 'function') onBackToMap();
  };

  // Render mission router
  const renderSubMission = () => {
    const props = { mission, selection, setSelection, locked: isLocked };
    switch (mission.type) {
      case 'single-choice': return <SingleChoiceMission {...props}/>;
      case 'multi-select':  return <MultiSelectMission {...props}/>;
      case 'drag-match':    return <DragMatchMission {...props}/>;
      case 'scenario':      return <ScenarioMission {...props}/>;
      case 'map-mark':      return <MapMarkMission {...props}/>;
      default:
        return (
          <div style={{ marginTop: 22, padding: 20, color: 'var(--ink-mute)', textAlign: 'center' }}>
            Bilinmeyen görev tipi: <code>{String(mission.type)}</code>
          </div>
        );
    }
  };

  const regionColor = regionMeta.color || 'var(--accent)';
  const missionTypeLabel = ({
    'single-choice': 'Tek Seçim',
    'multi-select':  'Çoklu Seçim',
    'drag-match':    'Eşleştirme',
    'scenario':      'Hikâye Görevi',
    'map-mark':      'Harita Görevi',
  })[mission.type] || 'Mini Görev';

  const missionTitle = (regionData.intro && regionData.intro.missionTitle) || 'Mini Görev';
  const regionBadge = regionMeta.badge || '🎯';

  return (
    <div
      className="paper-cream"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
        color: 'var(--ink)',
        paddingBottom: 80,
      }}
    >
      {/* Üst bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 32px',
        borderBottom: '1.5px dashed var(--rule)',
        background: 'rgba(250,246,236,.7)',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleBack}
            aria-label="Haritaya geri dön"
          >
            ← Haritaya Dön
          </button>
          <div style={{
            fontFamily: 'var(--font-hand)',
            fontSize: 22,
            color: regionColor,
            fontWeight: 700,
          }}>
            {regionBadge} {regionMeta.name || regionId} · {missionTitle}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="t-label" style={{ fontSize: 12 }}>Görev</span>
          {Array.from({ length: totalMissions }).map((_, i) => {
            const active = i === missionIndex;
            const done = i < missionIndex;
            return (
              <div key={i} style={{
                width: 30, height: 30, borderRadius: '50%',
                border: '1.5px solid ' + (active ? 'var(--accent)' : 'var(--ink-mute)'),
                background: active ? 'var(--accent)' : (done ? 'var(--success)' : 'transparent'),
                color: (active || done) ? '#FFF7EB' : 'var(--ink-mute)',
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--font-hand)', fontWeight: 700, fontSize: 14,
              }}>{done ? '✓' : (i + 1)}</div>
            );
          })}
          <span className="t-label" style={{ fontSize: 12 }}>
            {missionIndex + 1} / {totalMissions}
          </span>
        </div>
      </div>

      {/* İçerik gövdesi */}
      <div
        className={feedback === 'wrong' ? 'tk-mission-shake' : ''}
        style={{
          maxWidth: 920, margin: '0 auto', padding: '36px 32px 24px',
          position: 'relative',
        }}
      >
        <div className="t-label" style={{ fontSize: 12, textAlign: 'center' }}>
          Mini Görev — {missionTypeLabel}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 48, lineHeight: 1.05,
          color: 'var(--title)', textAlign: 'center', margin: '6px 0 4px',
        }}>
          {mission.title || mission.question || mission.prompt || 'Görev'}
        </h1>
        {mission.title && (mission.prompt || mission.question) && (
          <div style={{
            textAlign: 'center', fontFamily: 'var(--font-hand)', fontSize: 18,
            color: 'var(--ink-soft)',
          }}>
            {mission.prompt || mission.question}
          </div>
        )}

        {/* Doğru cevap pulse efekti — etrafını saran katman */}
        <div
          className={feedback === 'correct' ? 'tk-mission-pulse-correct' : ''}
          style={{
            marginTop: 8,
            padding: 4,
            borderRadius: 16,
            border: '2px solid transparent',
            transition: 'border-color .25s',
            position: 'relative',
          }}
        >
          {renderSubMission()}

          {/* Sparkle overlay (sadece doğru cevapta) */}
          {feedback === 'correct' && window.Sparkle && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              display: 'flex', justifyContent: 'space-around',
              color: 'var(--warn)',
            }}>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="tk-sparkle"
                  style={{
                    marginTop: 20 + (i % 3) * 30,
                    color: ['#F9A825', '#558B2F', '#C62828', '#FFA726', '#B8862F'][i],
                  }}>
                  <window.Sparkle size={20 + (i % 3) * 6}/>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* İpucu kartı */}
        {hintShown && mission.hint && (
          <div style={{
            marginTop: 18,
            padding: '14px 18px',
            background: '#FFF7D6',
            border: '1.5px solid var(--warn)',
            borderRadius: 12,
            display: 'flex', gap: 12, alignItems: 'flex-start',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: 24, lineHeight: 1 }}>💡</div>
            <div>
              <div className="t-label" style={{ fontSize: 11, color: 'var(--gold)' }}>İpucu</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink)' }}>
                {mission.hint}
              </div>
            </div>
          </div>
        )}

        {/* Yanlış feedback metni */}
        {feedback === 'wrong' && (
          <div style={{
            marginTop: 14, padding: '10px 14px',
            background: 'rgba(198,40,40,.08)', border: '1.5px solid var(--accent)',
            borderRadius: 10, color: 'var(--accent)', fontWeight: 700,
            fontFamily: 'var(--font-hand)', fontSize: 18, textAlign: 'center',
          }}>
            ✕ Henüz değil — tekrar dene!
          </div>
        )}

        {/* Doğru feedback metni */}
        {feedback === 'correct' && (
          <div style={{
            marginTop: 14, padding: '10px 14px',
            background: 'rgba(85,139,47,.10)', border: '1.5px solid var(--success)',
            borderRadius: 10, color: 'var(--success)', fontWeight: 700,
            fontFamily: 'var(--font-hand)', fontSize: 20, textAlign: 'center',
          }}>
            ✓ Harika! Doğru cevap.
          </div>
        )}

        {/* Aksiyon barı */}
        <div style={{
          marginTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 14, flexWrap: 'wrap',
        }}>
          <div>
            {(attempts > 0 || hintShown) && mission.hint && !hintShown && (
              <button className="btn btn-tertiary" onClick={handleHint}>
                💡 Bir ipucu kullan
              </button>
            )}
            {!hintShown && attempts === 0 && mission.hint && (
              <button className="btn btn-tertiary" onClick={handleHint}>
                💡 Bir ipucu kullan
              </button>
            )}
            {hintShown && (
              <span className="t-label" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>
                ✓ İpucu kullanıldı
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {attempts > 0 && feedback !== 'correct' && (
              <span className="t-label" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>
                Deneme: {attempts}
              </span>
            )}
            <button
              className={'btn ' + (hasSelection && !isLocked ? 'btn-primary' : 'btn-disabled') + ' btn-lg'}
              onClick={handleCheck}
              disabled={!hasSelection || isLocked}
              aria-label="Cevabı kontrol et"
            >
              Cevabı Kontrol Et →
            </button>
          </div>
        </div>
      </div>

      {/* Dekoratif sayfa numarası */}
      <div style={{
        position: 'absolute', bottom: 14, right: 24,
        fontFamily: 'var(--font-hand)', color: 'var(--ink-mute)', fontSize: 16,
      }}>
        — sayfa {missionIndex + 1} —
      </div>
    </div>
  );
};

Object.assign(window, { MissionScreen });
