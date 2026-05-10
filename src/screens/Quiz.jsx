/* Quiz.jsx — M5: Final aşaması — Hızlı Bilgi Yarışması (15 soru, 15sn timer)
   Public API:
     window.QuizScreen = ({ onComplete }) => JSX
     onComplete(score, totalTimeMs) — 15. soru bitince çağrılır.
*/

const { useState: useStateQuiz, useEffect: useEffectQuiz, useMemo: useMemoQuiz, useRef: useRefQuiz } = React;

const QUESTION_SECONDS = 15;
const FEEDBACK_MS = 800;

const QuizScreen = ({ onComplete }) => {
  const progress = window.useProgress ? window.useProgress() : null;
  const questions = (window.getQuizForGame ? window.getQuizForGame() : null) || (window.FINAL_QUIZ || []);
  const total = questions.length;

  const [qIdx, setQIdx] = useStateQuiz(0);
  const [score, setScore] = useStateQuiz(0);
  const [wrong, setWrong] = useStateQuiz(0);
  // feedback: null | { correct: bool, picked: number | null }
  const [feedback, setFeedback] = useStateQuiz(null);
  // hidden options (50:50 sonrası)
  const [hiddenOptions, setHiddenOptions] = useStateQuiz([]);
  const [fiftyUsed, setFiftyUsed] = useStateQuiz(false);

  const startedAtRef = useRefQuiz(Date.now());
  const questionStartedAtRef = useRefQuiz(Date.now());
  const advanceTimerRef = useRefQuiz(null);
  const completedRef = useRefQuiz(false);

  // Soru değişince timer state'lerini reset et
  useEffectQuiz(() => {
    questionStartedAtRef.current = Date.now();
    setHiddenOptions([]);
    setFeedback(null);
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
    };
  }, [qIdx]);

  const TimerBar = window.TimerBar;
  const Confetti = window.Confetti;

  const current = questions[qIdx];

  const finishQuiz = (finalScore) => {
    if (completedRef.current) return;
    completedRef.current = true;
    const totalTimeMs = Date.now() - startedAtRef.current;
    if (progress && typeof progress.setQuizScore === "function") {
      progress.setQuizScore(finalScore);
    }
    if (typeof onComplete === "function") onComplete(finalScore, totalTimeMs);
  };

  // Sonraki soruya geç (veya bitir)
  const goNext = (deltaScore = 0) => {
    setScore(prevScore => {
      const newScore = prevScore + deltaScore;
      if (qIdx + 1 >= total) {
        // Son soru bitti
        setTimeout(() => finishQuiz(newScore), 0);
      }
      return newScore;
    });
    if (qIdx + 1 < total) {
      setQIdx(idx => idx + 1);
    }
  };

  const handleAnswer = (optIdx) => {
    if (feedback !== null) return; // çoklu tıklamayı engelle
    const correct = optIdx === current.correct;
    const timeMs = Date.now() - questionStartedAtRef.current;

    if (progress && typeof progress.recordQuizAnswer === "function") {
      progress.recordQuizAnswer(qIdx, correct, timeMs);
    }

    setFeedback({ correct, picked: optIdx });
    if (!correct) setWrong(w => w + 1);

    advanceTimerRef.current = setTimeout(() => {
      goNext(correct ? 1 : 0);
    }, FEEDBACK_MS);
  };

  const handleTimerExpire = () => {
    if (feedback !== null) return;
    const timeMs = Date.now() - questionStartedAtRef.current;
    if (progress && typeof progress.recordQuizAnswer === "function") {
      progress.recordQuizAnswer(qIdx, false, timeMs);
    }
    setFeedback({ correct: false, picked: null });
    setWrong(w => w + 1);
    advanceTimerRef.current = setTimeout(() => {
      goNext(0);
    }, FEEDBACK_MS);
  };

  const handleSkip = () => {
    if (feedback !== null) return;
    const timeMs = Date.now() - questionStartedAtRef.current;
    if (progress && typeof progress.recordQuizAnswer === "function") {
      progress.recordQuizAnswer(qIdx, false, timeMs);
    }
    setWrong(w => w + 1);
    goNext(0);
  };

  const handleFifty = () => {
    if (fiftyUsed || feedback !== null || !current) return;
    // doğru indeksi DIŞINDAKİ rastgele 2 seçeneği sakla
    const wrongs = current.options
      .map((_, i) => i)
      .filter(i => i !== current.correct);
    // shuffle
    const shuffled = [...wrongs].sort(() => Math.random() - 0.5);
    const toHide = shuffled.slice(0, Math.min(2, shuffled.length));
    setHiddenOptions(toHide);
    setFiftyUsed(true);
  };

  if (!current) {
    return (
      <div className="paper-cream" style={{
        minHeight: "100vh", display: "grid", placeItems: "center",
        fontFamily: "var(--font-body)", color: "var(--ink)",
      }}>
        <div style={{ textAlign: "center", padding: 32 }}>
          <div className="t-label">Quiz</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 56, color: "var(--title)", marginTop: 6 }}>
            Soru yüklenemedi
          </div>
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 20, color: "var(--ink-soft)", marginTop: 8 }}>
            FINAL_QUIZ verisi bulunamadı.
          </div>
        </div>
      </div>
    );
  }

  // Feedback flash arkaplan rengi
  const feedbackBg = feedback === null
    ? "transparent"
    : feedback.correct
      ? "rgba(85,139,47,.18)"
      : "rgba(198,40,40,.18)";

  // Bölge renkleri (üç seçenek için döngüsel)
  const optionColors = [
    "var(--r-karadeniz)",
    "var(--r-doguanadolu)",
    "var(--r-icanadolu)",
    "var(--r-akdeniz)",
    "var(--r-marmara)",
  ];

  return (
    <div className="paper-cream" style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      fontFamily: "var(--font-body)", color: "var(--ink)",
      transition: "background 200ms ease",
    }}>
      {/* Feedback flash */}
      <div style={{
        position: "absolute", inset: 0,
        background: feedbackBg,
        pointerEvents: "none",
        transition: "background 150ms ease",
        zIndex: 1,
      }}/>

      {/* Doğru cevap konfetisi */}
      {feedback && feedback.correct && Confetti && (
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
          <Confetti count={20}/>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 2, padding: "28px 40px 40px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Üst başlık + sayaçlar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="t-label" style={{ fontSize: 12 }}>Final Aşaması · Hızlı Bilgi Yarışması</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 48, color: "var(--title)", lineHeight: 1 }}>
              Hızlı Bilgi Yarışması
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <div className="card" style={{ padding: "8px 14px" }}>
              <div className="t-label" style={{ fontSize: 10 }}>Soru</div>
              <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, fontWeight: 700, color: "var(--title)" }}>
                {qIdx + 1} / {total}
              </div>
            </div>
            <div className="card" style={{ padding: "8px 14px", display: "flex", gap: 14 }}>
              <div>
                <div className="t-label" style={{ fontSize: 10 }}>Doğru</div>
                <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--success)", fontWeight: 700 }}>
                  ✓ {score}
                </div>
              </div>
              <div style={{ width: 1, background: "var(--rule)" }}/>
              <div>
                <div className="t-label" style={{ fontSize: 10 }}>Yanlış</div>
                <div style={{ fontFamily: "var(--font-hand)", fontSize: 22, color: "var(--accent)", fontWeight: 700 }}>
                  ✕ {wrong}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Süre çubuğu */}
        <div style={{ marginTop: 20 }}>
          {TimerBar && (
            <TimerBar
              key={qIdx}
              seconds={QUESTION_SECONDS}
              paused={feedback !== null}
              onExpire={handleTimerExpire}
            />
          )}
        </div>

        {/* Soru kartı */}
        <div className="card deckle" style={{
          marginTop: 32, padding: "44px 40px", textAlign: "center",
          background: "var(--bg-paper)",
        }}>
          <div className="t-label" style={{ fontSize: 11 }}>Coğrafya Sorusu</div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 44, lineHeight: 1.1,
            color: "var(--title)", marginTop: 6,
            maxWidth: 880, marginLeft: "auto", marginRight: "auto",
          }}>
            {current.q}
          </div>

          {/* Seçenekler */}
          <div style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(current.options.length, 3)}, 1fr)`,
            gap: 14,
            maxWidth: 1000, marginLeft: "auto", marginRight: "auto",
          }}>
            {current.options.map((optText, i) => {
              const isHidden = hiddenOptions.indexOf(i) !== -1;
              const isPicked = feedback && feedback.picked === i;
              const isCorrectAnswer = feedback && i === current.correct;
              const showCorrectGlow = feedback !== null && isCorrectAnswer;
              const showWrongGlow = feedback && isPicked && !feedback.correct;

              const color = optionColors[i % optionColors.length];

              const borderColor = showCorrectGlow
                ? "var(--success)"
                : showWrongGlow
                  ? "var(--accent)"
                  : color;

              const bg = showCorrectGlow
                ? "rgba(85,139,47,.12)"
                : showWrongGlow
                  ? "rgba(198,40,40,.12)"
                  : "var(--bg-cream)";

              return (
                <button
                  key={i}
                  className="card"
                  onClick={() => handleAnswer(i)}
                  disabled={feedback !== null || isHidden}
                  aria-label={`Seçenek ${["A","B","C","D","E"][i]}: ${optText}`}
                  style={{
                    cursor: (feedback !== null || isHidden) ? "default" : "pointer",
                    padding: "20px 16px",
                    background: bg,
                    borderColor: borderColor,
                    borderWidth: 2,
                    textAlign: "center",
                    visibility: isHidden ? "hidden" : "visible",
                    opacity: isHidden ? 0 : 1,
                    transition: "all 200ms ease",
                    boxShadow: showCorrectGlow
                      ? "0 0 0 3px rgba(85,139,47,.25), var(--shadow-md)"
                      : showWrongGlow
                        ? "0 0 0 3px rgba(198,40,40,.25), var(--shadow-md)"
                        : "var(--shadow-sm)",
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", margin: "0 auto 8px",
                    background: showCorrectGlow ? "var(--success)" : (showWrongGlow ? "var(--accent)" : color),
                    color: "#FFF7EB",
                    display: "grid", placeItems: "center",
                    fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700,
                  }}>
                    {showCorrectGlow ? "✓" : (showWrongGlow ? "✕" : ["A", "B", "C", "D", "E"][i])}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-hand)", fontSize: 22,
                    color: "var(--ink)", fontWeight: 700,
                  }}>
                    {optText}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* İpucu / atla */}
        <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <button
            className="btn btn-tertiary"
            onClick={handleFifty}
            disabled={fiftyUsed || feedback !== null}
            aria-label="50:50 ipucu"
            style={{ opacity: (fiftyUsed || feedback !== null) ? 0.5 : 1, cursor: (fiftyUsed || feedback !== null) ? "not-allowed" : "pointer" }}
          >
            💡 50:50 ipucu ({fiftyUsed ? "0" : "1"} hak kaldı)
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleSkip}
            disabled={feedback !== null}
            aria-label="Soruyu Atla"
            style={{ opacity: feedback !== null ? 0.5 : 1, cursor: feedback !== null ? "not-allowed" : "pointer" }}
          >
            Soruyu Atla →
          </button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { QuizScreen });
