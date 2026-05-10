/* app.jsx — Ana App komponenti, ekran routing'i (state-based) */

const { useState, useEffect, useMemo } = React;

/* ========== Geçici "Yakında..." placeholder (henüz tanımlanmamış screen'ler için) ========== */
const ComingSoonPlaceholder = ({ screenName, info }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '40px 24px', textAlign: 'center',
    background: 'var(--bg-paper)',
    fontFamily: 'var(--font-body)',
  }}>
    <div style={{
      fontFamily: 'var(--font-display)', fontSize: 56, color: 'var(--title)', marginBottom: 8
    }}>
      Yakında...
    </div>
    <div style={{ fontFamily: 'var(--font-hand)', fontSize: 22, color: 'var(--ink-soft)' }}>
      {screenName} ekranı henüz hazır değil
    </div>
    {info && (
      <div style={{ marginTop: 16, color: 'var(--ink-mute)', fontSize: 14, maxWidth: 480 }}>
        {info}
      </div>
    )}
  </div>
);

/* ========== Geçici Welcome placeholder (eğer WelcomeScreen tanımlı değilse) ========== */
const WelcomePlaceholder = ({ onStart, hasSavedGame, playerName }) => {
  const [name, setName] = useState(playerName || '');
  return (
    <div className="paper" style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      fontFamily: 'var(--font-body)', color: 'var(--ink)',
      padding: '48px 24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      {window.CornerOrnament && <window.CornerOrnament className="corner tl"/>}
      {window.CornerOrnament && <window.CornerOrnament className="corner tr"/>}
      {window.CornerOrnament && <window.CornerOrnament className="corner bl"/>}
      {window.CornerOrnament && <window.CornerOrnament className="corner br"/>}

      <div className="float" style={{ marginTop: 8 }}>
        {window.Logo && <window.Logo size={200}/>}
      </div>

      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 64, lineHeight: 0.9,
        color: 'var(--title)', textShadow: '1px 2px 0 rgba(184,134,47,.18)',
        marginTop: 8, textAlign: 'center',
      }}>
        Türkiye'yi Keşfet
      </div>
      <div style={{
        fontFamily: 'var(--font-hand)', fontSize: 22, color: 'var(--ink-soft)',
        fontStyle: 'italic', marginTop: 4
      }}>
        ✦ Bir Coğrafya Macerası ✦
      </div>

      <div className="card deckle" style={{
        maxWidth: 560, marginTop: 24, position: 'relative',
        background: 'var(--bg-cream)',
        borderColor: 'var(--rule)',
      }}>
        <div style={{
          position: 'absolute', top: -14, left: 24,
          background: 'var(--accent)', color: '#FFF7EB',
          padding: '3px 12px', fontFamily: 'var(--font-hand)', fontSize: 14,
          letterSpacing: '.15em', borderRadius: 6, transform: 'rotate(-2deg)',
        }}>
          GÖREV BRİFİ
        </div>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--ink)' }}>
          Türkiye Coğrafya Akademisi seni <b style={{color: 'var(--accent)'}}>"Coğrafya Ustası"</b> adayı olarak seçti.
          7 bölgeyi keşfedip her birinden bir <b>uzmanlık rozeti</b> kazanman gerekiyor!
        </p>
      </div>

      <div style={{ marginTop: 22, width: 360, maxWidth: '100%' }}>
        <label className="t-label" style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>
          Maceracı adın
        </label>
        <input
          className="input"
          placeholder="örn. Mehmet Ali"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => onStart(name.trim() || 'Maceracı')}
          disabled={!name.trim()}
        >
          🎒 Maceraya Başla
        </button>
        {hasSavedGame && (
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => onStart(playerName || name.trim() || 'Maceracı')}
          >
            📖 Devam Et
          </button>
        )}
      </div>

      <div style={{ marginTop: 16, fontFamily: 'var(--font-hand)', fontSize: 15, color: 'var(--ink-mute)' }}>
        Anadolu'nun her bir bölgesinde seni bir hikâye bekliyor…
      </div>

      <div style={{
        marginTop: 24, padding: '8px 14px', background: 'rgba(184,134,47,.08)',
        border: '1px dashed var(--rule)', borderRadius: 8,
        fontSize: 12, color: 'var(--ink-mute)', maxWidth: 480, textAlign: 'center'
      }}>
        <b>M1 Altyapı modülü aktif.</b> Map / RegionIntro / Mission / Badge / Quiz / Final ekranları sonraki modüllerde eklenecek.
      </div>
    </div>
  );
};

/* ========== Ana App ========== */
const App = () => {
  const progress = window.useProgress();
  const [screen, setScreen] = useState(window.SCREENS.WELCOME);
  const [activeRegion, setActiveRegion] = useState(null);
  const [missionIndex, setMissionIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);

  // Navigate helper'ları
  const goToWelcome = () => setScreen(window.SCREENS.WELCOME);
  const goToMap = () => setScreen(window.SCREENS.MAP);
  const goToRegion = (id) => {
    setActiveRegion(id);
    setActiveCategory(null);
    setScreen(window.SCREENS.REGION_INTRO);
  };
  const goToCategoryMission = (categoryId) => {
    setActiveCategory(categoryId);
    setMissionIndex(0);
    setScreen(window.SCREENS.MISSION);
  };
  const goToMission = (index = 0) => {
    setMissionIndex(index);
    setScreen(window.SCREENS.MISSION);
  };
  const nextMission = () => setMissionIndex(prev => prev + 1);
  const goToBadge = () => setScreen(window.SCREENS.BADGE);
  const goToQuiz = () => setScreen(window.SCREENS.QUIZ);
  const goToFinal = () => setScreen(window.SCREENS.FINAL);

  const handleStart = (name, grade, isNewIdentity) => {
    if (isNewIdentity && progress.reset) {
      progress.reset();
      if (typeof window !== 'undefined' && typeof window.resetGameOrder === 'function') {
        window.resetGameOrder();
      }
    }
    progress.setPlayerName(name);
    if (typeof grade === 'number' && progress.setGrade) {
      progress.setGrade(grade);
    }
    goToMap();
  };

  // Welcome ekranını otomatik atla — eğer kayıtlı oyun varsa Welcome'da kalsın (devam et opsiyonu için)
  // Şimdilik bu mantık kullanılmıyor; WELCOME'da kalır.

  // Şu anlık her ekran için tanımlı olan veya placeholder olarak gösterir
  const renderScreen = () => {
    switch (screen) {
      case window.SCREENS.WELCOME: {
        if (window.WelcomeScreen) {
          return (
            <window.WelcomeScreen
              progressInstance={progress}
              onStart={handleStart}
              hasSavedGame={progress.hasSavedGame()}
              playerName={progress.state.playerName}
            />
          );
        }
        // M1: kendi placeholder'ımız (interaktif — isim girip Map'e geçer)
        return (
          <WelcomePlaceholder
            onStart={handleStart}
            hasSavedGame={progress.hasSavedGame()}
            playerName={progress.state.playerName}
          />
        );
      }

      case window.SCREENS.MAP: {
        if (window.MapScreen) {
          return (
            <window.MapScreen
              progressInstance={progress}
              progress={progress.getProgressMap()}
              playerName={progress.state.playerName}
              earned={progress.earnedBadgeCount()}
              regionsProgress={progress.state.regionsProgress || {}}
              selectedRegion={activeRegion || 'marmara'}
              onRegionClick={goToRegion}
              onCategorySelect={(rid, catId) => {
                setActiveRegion(rid);
                setActiveCategory(catId);
                setMissionIndex(0);
                setScreen(window.SCREENS.MISSION);
              }}
              onAllComplete={goToQuiz}
            />
          );
        }
        return <ComingSoonPlaceholder screenName="Harita (Map)" info="M2'de geliştirilecek." />;
      }

      case window.SCREENS.REGION_INTRO: {
        if (window.RegionIntroScreen) {
          return (
            <window.RegionIntroScreen
              regionId={activeRegion}
              onStartMission={(categoryId) => categoryId ? goToCategoryMission(categoryId) : goToMission(0)}
              onClose={goToMap}
            />
          );
        }
        return <ComingSoonPlaceholder screenName="Bölge Tanıtımı" info="M3a'da geliştirilecek." />;
      }

      case window.SCREENS.MISSION: {
        if (window.MissionScreen) {
          return (
            <window.MissionScreen
              regionId={activeRegion}
              categoryId={activeCategory}
              missionIndex={missionIndex}
              onMissionComplete={(correct, attempts, timeMs, derivedCatId) => {
                // 1) Eski moduldeki gibi mission attempt kaydı (DBR loglar için)
                progress.recordMissionAttempt(activeRegion, missionIndex, correct, timeMs);
                // 2) Yeni: doğru cevap ise kategoriye kredi ver (mixed flow için _origIdx ile türetilen, focused flow için activeCategory)
                if (correct) {
                  const targetCat = derivedCatId || activeCategory;
                  if (targetCat && progress.recordCategoryAnswer) {
                    progress.recordCategoryAnswer(activeRegion, targetCat, true);
                  }
                }
                nextMission();
              }}
              onAllMissionsComplete={() => {
                // 3 görev bitti — o bölgenin random cache'ini temizle ki sonraki tur farklı sorular gelsin
                if (typeof window.resetRegionGameOrder === 'function') {
                  window.resetRegionGameOrder(activeRegion);
                }
                // Bölgede tüm kategoriler done mu? Eğer öyleyse badge ceremony
                const allCats = (window.getCategoriesForRegion ? window.getCategoriesForRegion(activeRegion) :
                  ((window.CATEGORIES_BY_REGION && window.CATEGORIES_BY_REGION[activeRegion]) || []));
                const allDone = allCats.length > 0 && allCats.every(c => progress.isCategoryDone && progress.isCategoryDone(activeRegion, c.id));
                if (allDone) {
                  goToBadge();
                } else {
                  // Kategori/tur bitti — focused mod'daysak RegionIntro yerine direkt Map'e dön (yolculuk haritasından devam etsin)
                  // Mixed mod'daysak da Map'e dön — RegionIntro'da "Göreve Başla" tekrar tıklamak için
                  setActiveCategory(null);
                  goToMap();
                }
              }}
              onBackToMap={goToMap}
            />
          );
        }
        return <ComingSoonPlaceholder screenName="Mini Görev" info="M4'te geliştirilecek." />;
      }

      case window.SCREENS.BADGE: {
        if (window.BadgeCeremonyScreen) {
          return (
            <window.BadgeCeremonyScreen
              regionId={activeRegion}
              earnedCount={progress.earnedBadgeCount()}
              totalCount={7}
              onContinue={goToMap}
              onCompleteRegion={(rid) => progress.completeRegion(rid)}
            />
          );
        }
        return <ComingSoonPlaceholder screenName="Rozet Töreni" info="M5'te geliştirilecek." />;
      }

      case window.SCREENS.QUIZ: {
        if (window.QuizScreen) {
          return (
            <window.QuizScreen
              questions={window.FINAL_QUIZ}
              onComplete={(score, timeMs) => {
                progress.setQuizScore(score);
                goToFinal();
              }}
            />
          );
        }
        return <ComingSoonPlaceholder screenName="Final Quiz" info="M5'te geliştirilecek." />;
      }

      case window.SCREENS.FINAL: {
        if (window.FinalScreen) {
          return (
            <window.FinalScreen
              playerName={progress.state.playerName}
              quizScore={progress.state.quizScore}
              startedAt={progress.state.startedAt}
              onPlayAgain={() => { progress.reset(); goToWelcome(); }}
              onShare={() => {
                try {
                  const json = progress.exportJson();
                  alert('Sonuçlar (kopyala):\n\n' + json);
                } catch (e) { console.warn(e); }
              }}
            />
          );
        }
        return <ComingSoonPlaceholder screenName="Final" info="M5'te geliştirilecek." />;
      }

      default:
        return <ComingSoonPlaceholder screenName="Bilinmeyen ekran" />;
    }
  };

  return renderScreen();
};

// Render
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
