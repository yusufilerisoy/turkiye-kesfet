/* BadgeCeremony.jsx — M5: Bölge tamamlanınca rozet töreni
   Public API:
     window.BadgeCeremonyScreen = ({ regionId, onContinue, onCompleteRegion, earnedCount, totalCount }) => JSX

   M6 fix: useProgress her komponentte ayrı state instance üretir; BadgeCeremony
   kendi instance'ında completeRegion çağırırsa App'in state'i stale kalır ve
   Map'e dönüldüğünde rozet sayısı güncellenmez. Çözüm: App, onCompleteRegion
   callback'i geçer; BadgeCeremony onu çağırarak App state'ini günceller.
   earnedCount/totalCount prop'ları da App authority olduğu için tercih edilir.
*/

const { useState: useStateBadge, useEffect: useEffectBadge, useMemo: useMemoBadge } = React;

/* Bölgeye özel kısa övgü metni */
const PRAISE_TEXTS = {
  karadeniz: "Karadeniz'in tüm sırlarını çözdün! Ormanların derinlikleri, çay tarlalarının kokusu artık senin günlüğüne yazılı.",
  akdeniz: "Akdeniz seninle daha sıcak! Mavi sularda yelken açtın, narenciye kokusunu içine çektin — iklimin sırrı artık sende.",
  ege: "Ege'nin zeytin yapraklarını okudun! Antik kıyıların ve bereketli ovaların hikâyesini günlüğüne yazdın.",
  icanadolu: "İç Anadolu'nun bozkırlarını fethettin! Geniş ufukları, bereketli ovaları ve sarı başakları artık senin haritanda.",
  marmara: "Marmara'nın kapılarını açtın! İki kıtanın kavşağında, boğazın iki yakasında bir maceracı olarak iz bıraktın.",
  doguanadolu: "Doğu Anadolu'nun zirvesindesin! Karlı dağların ve geniş yaylaların gözcüsü oldun.",
  guneydogu: "Güneydoğu'nun sıcak güneşi sana selâm gönderiyor! Pamuk tarlalarında, GAP'ın suladığı topraklarda iz bıraktın.",
};

const BadgeCeremonyScreen = ({ regionId, onContinue, onCompleteRegion, earnedCount, totalCount }) => {
  const progress = window.useProgress();
  const region = window.getRegion(regionId) || {};
  const completedRef = React.useRef(false);

  // Mount'ta region'ı done olarak işaretle. App üzerinden yapılır ki state
  // tek bir kaynaktan (App'in useProgress instance'ı) güncellensin.
  useEffectBadge(() => {
    if (!regionId) return;
    if (completedRef.current) return;
    completedRef.current = true;
    if (typeof onCompleteRegion === 'function') {
      onCompleteRegion(regionId);
    } else if (!progress.isRegionDone(regionId)) {
      // Geriye dönük uyum (App callback geçmediyse)
      progress.completeRegion(regionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionId]);

  // App'ten gelen prop authority — yoksa kendi instance'ından oku.
  const earned = (typeof earnedCount === 'number') ? earnedCount : progress.earnedBadgeCount();
  const total = (typeof totalCount === 'number') ? totalCount : 7;
  const remaining = Math.max(0, total - earned);
  const isAllDone = earned >= total;

  const missionTitle = (region.intro && region.intro.missionTitle) || "Bölge Uzmanı";
  const regionName = region.name || "Bölge";
  const regionColorVar = `var(--r-${regionId})`;
  const praise = PRAISE_TEXTS[regionId] || `${regionName}'in tüm sırlarını çözdün! Bu bölgenin hikâyesi artık senin günlüğüne yazılı.`;

  const Confetti = window.Confetti;
  const Badge = window.Badge;
  const TurkeyMap = window.TurkeyMap;

  // Saydam arkaplan haritası için: tamamlanan bölgeleri 'done' yap
  const bgProgress = useMemoBadge(() => progress.getProgressMap(), [progress.state]);

  return (
    <div className="paper" style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      fontFamily: "var(--font-body)", color: "var(--ink)",
    }}>
      {/* Arkadaki saydam harita */}
      <div style={{ position: "absolute", inset: 0, opacity: .25, padding: 60 }}>
        {TurkeyMap && <TurkeyMap progress={bgProgress} hoverable={false} decorative/>}
      </div>
      {/* Koyu overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(62,39,35,.78)" }}/>

      {/* Konfeti */}
      {Confetti && <Confetti count={56}/>}

      {/* İçerik */}
      <div style={{
        position: "relative", zIndex: 2,
        minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "40px 24px",
      }}>
        {/* Rozet + glow + çelenk */}
        <div style={{ position: "relative" }}>
          {/* Glow */}
          <div style={{
            position: "absolute", inset: -40, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,210,120,.45), transparent 60%)",
            pointerEvents: "none",
          }}/>
          <div className="float">
            {Badge && <Badge region={regionId} size={200} big label={null}/>}
          </div>
          {/* Defne çelenk */}
          <svg width="320" height="60" viewBox="0 0 320 60" style={{ marginTop: -10 }}>
            <path d="M30 30 Q160 60 290 30" fill="none" stroke="#B8862F" strokeWidth="2"/>
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse key={i}
                cx={30 + i * 22} cy={30 + Math.sin(i) * 6}
                rx="6" ry="3"
                fill="#7CB342"
                transform={`rotate(${i * 20} ${30 + i * 22} ${30})`}/>
            ))}
          </svg>
        </div>

        {/* Başlık */}
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 96, lineHeight: 0.9,
          color: "#FFE6B5", marginTop: 24,
          textShadow: "2px 4px 0 rgba(62,39,35,.5)",
        }}>
          Tebrikler!
        </div>

        {/* Yeni unvan */}
        <div style={{
          fontFamily: "var(--font-hand)", fontSize: 32, color: "#FAF1D6", marginTop: 4,
          maxWidth: 760,
        }}>
          Yeni Unvan:{" "}
          <span style={{
            color: regionColorVar, background: "#FAF1D6",
            padding: "2px 14px", borderRadius: 8, display: "inline-block",
          }}>
            🌿 {missionTitle}
          </span>
        </div>

        {/* Övgü metni */}
        <div style={{
          fontFamily: "var(--font-body)", fontSize: 19, color: "#F1E0B8",
          marginTop: 18, maxWidth: 600, lineHeight: 1.5,
        }}>
          {praise}
        </div>

        {/* Aksiyonlar */}
        <div style={{ marginTop: 36, display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onContinue && onContinue()}
            aria-label="Haritaya Dön"
          >
            🗺 Haritaya Dön
          </button>
          <button
            className="btn btn-secondary btn-lg btn-disabled"
            disabled
            title="Yakında!"
            aria-label="Günlüğüme Bak (Yakında)"
            style={{ background: "rgba(250,246,236,.85)", cursor: "not-allowed" }}
          >
            📓 Günlüğüme Bak
          </button>
        </div>

        {/* Alt sayaç */}
        <div style={{
          marginTop: 18, color: "#E1D2AA",
          fontFamily: "var(--font-hand)", fontSize: 18,
        }}>
          {isAllDone
            ? "✦ Tüm rozetleri topladın! Final aşaması açılıyor… ✦"
            : `${earned} / ${total} rozet kazanıldı · ${remaining} bölge daha kaldı`
          }
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { BadgeCeremonyScreen });
