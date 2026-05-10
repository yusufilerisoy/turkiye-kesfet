/* Final.jsx — M5: Tüm bölgeler ve quiz tamamlanınca final ekranı
   Public API:
     window.FinalScreen = ({ onPlayAgain }) => JSX
*/

const { useState: useStateFinal, useEffect: useEffectFinal, useMemo: useMemoFinal } = React;

const FinalScreen = ({ onPlayAgain }) => {
  const progress = window.useProgress();
  const Confetti = window.Confetti;
  const Badge = window.Badge;
  const CornerOrnament = window.CornerOrnament;
  const REGIONS = window.REGIONS || [];

  const playerName = (progress && progress.state && progress.state.playerName) || "Maceracı";
  const quizScore = (progress && progress.state && typeof progress.state.quizScore === "number")
    ? progress.state.quizScore : 0;

  const totalMinutes = useMemoFinal(() => {
    const startedAt = progress && progress.state && progress.state.startedAt;
    if (!startedAt) return 0;
    const startMs = new Date(startedAt).getTime();
    if (isNaN(startMs)) return 0;
    const diffMs = Date.now() - startMs;
    return Math.max(1, Math.round(diffMs / 60000));
  }, [progress.state.startedAt]);

  const handlePlayAgain = () => {
    if (progress && typeof progress.reset === "function") progress.reset();
    if (typeof onPlayAgain === "function") onPlayAgain();
  };

  const handleShare = async () => {
    const shareText = `🇹🇷 Türkiye'yi Keşfet — ${playerName}\n` +
                      `7/7 bölge tamamlandı · Quiz: ${quizScore}/15 · Süre: ${totalMinutes} dk\n` +
                      `Coğrafya Ustası unvanını kazandım!`;
    try {
      if (navigator && typeof navigator.share === "function") {
        await navigator.share({
          title: "Türkiye'yi Keşfet — Sonuçlarım",
          text: shareText,
        });
        return;
      }
    } catch (e) {
      // share iptal edilmiş veya başarısız — alert'e düş
    }
    try {
      const json = (progress && typeof progress.exportJson === "function")
        ? progress.exportJson() : shareText;
      alert("Sonuçlarım:\n\n" + shareText + "\n\n— Detay (kopyala) —\n" + json);
    } catch (e) {
      alert(shareText);
    }
  };

  const handlePrintCertificate = () => {
    try { window.print(); } catch (e) { console.warn(e); }
  };

  return (
    <div className="paper" style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      fontFamily: "var(--font-body)", color: "var(--ink)",
    }}>
      {/* Konfeti */}
      {Confetti && <Confetti count={40}/>}

      {/* Köşe altın süslemeler */}
      {CornerOrnament && <CornerOrnament className="corner tl"/>}
      {CornerOrnament && <CornerOrnament className="corner tr"/>}
      {CornerOrnament && <CornerOrnament className="corner bl"/>}
      {CornerOrnament && <CornerOrnament className="corner br"/>}

      <div style={{
        position: "relative", zIndex: 2,
        padding: "60px 40px 40px", textAlign: "center",
        maxWidth: 1100, margin: "0 auto",
      }}>
        <div className="t-label" style={{ fontSize: 13, letterSpacing: ".2em" }}>
          ✦ Türkiye Coğrafya Akademisi ✦
        </div>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 86, lineHeight: 0.95,
          color: "var(--title)", marginTop: 6,
          textShadow: "2px 3px 0 rgba(184,134,47,.2)",
        }}>
          🇹🇷 Coğrafya Ustası!
        </div>
        <div style={{
          fontFamily: "var(--font-hand)", fontSize: 24,
          color: "var(--ink-soft)", marginTop: 4, fontStyle: "italic",
        }}>
          "{playerName}, Anadolu'nun tüm bölgelerini fethettin."
        </div>

        {/* Mega rozet + 7 rozet çelengi */}
        <div style={{ position: "relative", height: 360, marginTop: 24 }}>
          {/* 7 rozet çember halinde */}
          {REGIONS.map((r, i) => {
            const angle = (i * 360 / 7 - 90) * Math.PI / 180;
            const x = Math.cos(angle) * 180;
            const y = Math.sin(angle) * 130;
            return (
              <div key={r.id} className="float" style={{
                position: "absolute", left: "50%", top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                animationDelay: `${i * 0.2}s`,
              }}>
                {Badge && <Badge region={r.id} size={80} label={r.name}/>}
              </div>
            );
          })}

          {/* Mega rozet ortada */}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
            <div style={{
              width: 180, height: 180, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #FAE6A8, #B8862F 60%, #8B6724 100%)",
              border: "4px solid #5D2E2E",
              boxShadow: "0 8px 28px rgba(62,39,35,.4), inset 0 0 0 8px rgba(250,241,214,.5)",
              display: "grid", placeItems: "center",
              position: "relative",
            }}>
              <div style={{ fontSize: 64 }}>🇹🇷</div>
              <div style={{
                position: "absolute", bottom: -14, left: "50%", transform: "translateX(-50%)",
                background: "var(--accent)", color: "#FFF7EB",
                padding: "4px 16px", borderRadius: 999,
                fontFamily: "var(--font-hand)", fontSize: 16, fontWeight: 700, letterSpacing: ".1em",
                border: "2px solid #FAF1D6",
                whiteSpace: "nowrap",
              }}>
                USTA
              </div>
              <div className="shimmer" style={{
                position: "absolute", inset: -20, borderRadius: "50%",
                boxShadow: "0 0 60px 10px rgba(255,200,90,.5)",
                pointerEvents: "none",
              }}/>
            </div>
          </div>
        </div>

        {/* Sonuç kartı (3 metrik) */}
        <div className="card paper-cream" style={{
          maxWidth: 720, margin: "0 auto", borderColor: "var(--gold)", borderWidth: 2,
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, padding: "20px 28px",
        }}>
          <div>
            <div className="t-label" style={{ fontSize: 11 }}>Bölge</div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 36,
              color: "var(--success)", lineHeight: 1,
            }}>7 / 7</div>
          </div>
          <div style={{ borderLeft: "1.5px dashed var(--rule)", borderRight: "1.5px dashed var(--rule)" }}>
            <div className="t-label" style={{ fontSize: 11 }}>Quiz Skoru</div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 36,
              color: "var(--accent)", lineHeight: 1,
            }}>{quizScore} / 15</div>
          </div>
          <div>
            <div className="t-label" style={{ fontSize: 11 }}>Süre</div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 36,
              color: "var(--title)", lineHeight: 1,
            }}>{totalMinutes} dk</div>
          </div>
        </div>

        {/* Aksiyonlar */}
        <div style={{ marginTop: 26, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handlePlayAgain}
            aria-label="Yeniden Oyna"
          >
            🔄 Yeniden Oyna
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={handleShare}
            aria-label="Sonuçları Paylaş"
          >
            📤 Sonuçları Paylaş
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={handlePrintCertificate}
            aria-label="Sertifikamı İndir"
          >
            📜 Sertifikamı İndir
          </button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { FinalScreen });
