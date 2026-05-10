/* Welcome.jsx — M2: İlk açılış / hoşgeldin ekranı.
   Public API: window.WelcomeScreen = ({ onStart, hasSavedGame }) => JSX;
   - useProgress ile mevcut playerName'i (varsa) input'a default doldurur.
   - "Maceraya Başla" -> setPlayerName(name) + onStart()
   - "Devam Et" sadece hasSavedGame === true ise görünür.
*/
const { useState: useStateWelcome } = React;

const WelcomeScreen = ({ onStart, hasSavedGame, progressInstance }) => {
  const progress = progressInstance || window.useProgress();
  const savedName = (progress.state && progress.state.playerName) || '';
  const savedGrade = (progress.state && progress.state.grade) || 5;
  const [localName, setLocalName] = useStateWelcome(savedName);
  const [grade, setGrade] = useStateWelcome(savedGrade);

  const trimmed = (localName || '').trim();
  const canStart = trimmed.length > 0;

  const handleStart = () => {
    if (!canStart) return;
    // Yeni kimlik tespiti — App'e flag gönder; reset/set işlemlerini App KENDİ progress instance'ında yapsın.
    const nameChanged = savedName && savedName.trim() && savedName.trim() !== trimmed;
    const gradeChanged = savedGrade && savedGrade !== grade;
    const identityChanged = nameChanged || gradeChanged;
    if (typeof onStart === 'function') onStart(trimmed, grade, identityChanged);
  };

  const handleContinue = () => {
    // Devam et: kayıtlı isim zaten var, doğrudan haritaya git.
    if (typeof onStart === 'function') onStart(savedName || trimmed || 'Maceracı');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && canStart) handleStart();
  };

  return (
    <div className="paper" style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-body)',
      color: 'var(--ink)',
      padding: '48px 24px',
    }}>
      {/* Köşe süslemeleri */}
      <window.CornerOrnament className="corner tl"/>
      <window.CornerOrnament className="corner tr"/>
      <window.CornerOrnament className="corner bl"/>
      <window.CornerOrnament className="corner br"/>

      <div style={{
        position: 'relative',
        maxWidth: 980,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div className="float" style={{ marginTop: 8 }}>
          <window.Logo size={240}/>
        </div>

        {/* Başlık */}
        <div style={{ marginTop: 8 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 76,
            lineHeight: 0.9,
            color: 'var(--title)',
            textShadow: '1px 2px 0 rgba(184,134,47,.18)',
            letterSpacing: '1px',
          }}>
            Türkiye'yi Keşfet
          </div>
          <div style={{
            fontFamily: 'var(--font-hand)',
            fontSize: 24,
            color: 'var(--ink-soft)',
            fontStyle: 'italic',
            marginTop: 4,
          }}>
            ✦ Bir Coğrafya Macerası ✦
          </div>
        </div>

        {/* Hikâye / brief kartı */}
        <div className="card deckle" style={{
          maxWidth: 640,
          marginTop: 28,
          position: 'relative',
          background: 'var(--bg-cream)',
          borderColor: 'var(--rule)',
        }}>
          <div style={{
            position: 'absolute',
            top: -14,
            left: 24,
            background: 'var(--accent)',
            color: '#FFF7EB',
            padding: '3px 12px',
            fontFamily: 'var(--font-hand)',
            fontSize: 14,
            letterSpacing: '.15em',
            borderRadius: 6,
            transform: 'rotate(-2deg)',
          }}>
            GÖREV BRİFİ
          </div>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: 'var(--ink)' }}>
            Türkiye Coğrafya Akademisi seni{' '}
            <b style={{ color: 'var(--accent)' }}>"Coğrafya Ustası"</b> adayı olarak seçti.
            7 bölgeyi keşfedip her birinden bir <b>uzmanlık rozeti</b> kazanman gerekiyor!
          </p>
        </div>

        {/* İsim + Sınıf — yan yana */}
        <div style={{
          marginTop: 22,
          width: 560, maxWidth: '100%',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          alignItems: 'flex-end',
        }}>
          <div style={{ flex: '1 1 260px', minWidth: 220 }}>
            <label
              className="t-label"
              htmlFor="player-name-input"
              style={{ display: 'block', fontSize: 12, marginBottom: 6, textAlign: 'left' }}
            >
              Maceracı adın
            </label>
            <input
              id="player-name-input"
              className="input"
              placeholder="örn. Mehmet Ali"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onKeyDown={handleKey}
              aria-label="Maceracı adı"
              autoFocus
            />
          </div>

          <div style={{ flex: '0 1 260px', minWidth: 240 }}>
            <label
              className="t-label"
              style={{ display: 'block', fontSize: 12, marginBottom: 6, textAlign: 'left' }}
            >
              Hangi sınıftasın?
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[5, 6, 7, 8].map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  aria-pressed={grade === g}
                  style={{
                    flex: 1,
                    padding: '10px 6px',
                    borderRadius: 10,
                    border: '2px solid ' + (grade === g ? 'var(--accent-ink)' : 'var(--ink-mute)'),
                    background: grade === g ? 'var(--accent)' : 'var(--bg-cream)',
                    color: grade === g ? '#FFF7EB' : 'var(--title)',
                    fontFamily: 'var(--font-hand)',
                    fontSize: 20,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all .15s',
                    boxShadow: grade === g ? '0 2px 0 var(--accent-ink)' : 'none',
                  }}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA'lar */}
        <div style={{
          marginTop: 22,
          display: 'flex',
          gap: 14,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleStart}
            disabled={!canStart}
            aria-disabled={!canStart}
            title={canStart ? 'Maceraya başla' : 'Önce adını yaz'}
          >
            🎒 Maceraya Başla
          </button>
          {hasSavedGame && (
            <button
              className="btn btn-secondary btn-lg"
              onClick={handleContinue}
              title="Kaldığın yerden devam et"
            >
              📖 Devam Et
            </button>
          )}
        </div>

        <div style={{
          marginTop: 18,
          fontFamily: 'var(--font-hand)',
          fontSize: 16,
          color: 'var(--ink-mute)',
        }}>
          Anadolu'nun her bir bölgesinde seni bir hikâye bekliyor…
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { WelcomeScreen });
