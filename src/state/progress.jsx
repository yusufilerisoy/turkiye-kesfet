/* progress.jsx — useProgress custom hook + localStorage ile kalıcı durum yönetimi */

const STORAGE_KEY = 'tk_state';

const INITIAL_STATE = {
  playerName: '',
  grade: 5,              // 5, 6, 7 veya 8 — Welcome'da seçilir
  startedAt: null,
  regionsProgress: {},   // { [regionId]: { status: 'open'|'done', completedAt, missions: [{attempts, correct, timeMs}] } }
  quizScore: null,       // null veya number
  sessionLog: [],        // {ts, type, payload}
};

const STARTING_OPEN_REGIONS = [
  'marmara', 'karadeniz', 'ege', 'icanadolu',
  'akdeniz', 'doguanadolu', 'guneydogu',
];

/* Tüm 7 bölge başlangıçtan itibaren açıktır — kilitli bölge yoktur. */
const computeUnlocked = (_doneCount) => {
  return new Set(STARTING_OPEN_REGIONS);
};

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...INITIAL_STATE };
    const parsed = JSON.parse(raw);
    return { ...INITIAL_STATE, ...parsed };
  } catch (e) {
    console.warn('tk_state parse hatası:', e);
    return { ...INITIAL_STATE };
  }
};

const saveToStorage = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('tk_state kaydedilemedi:', e);
  }
};

const useProgress = () => {
  const [state, setState] = React.useState(() => loadFromStorage());

  // state değiştikçe localStorage'a yaz
  React.useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const setPlayerName = (name) => {
    setState(prev => ({
      ...prev,
      playerName: name,
      startedAt: prev.startedAt || new Date().toISOString(),
    }));
  };

  const setGrade = (g) => {
    const grade = Math.max(5, Math.min(8, parseInt(g, 10) || 5));
    setState(prev => ({ ...prev, grade }));
    // Grade change invalidates cached random question selections (different pool).
    if (typeof window !== 'undefined' && typeof window.resetGameOrder === 'function') {
      window.resetGameOrder();
    }
  };

  const earnedBadgeCount = () => {
    return Object.values(state.regionsProgress || {})
      .filter(r => r && r.status === 'done').length;
  };

  const isRegionDone = (regionId) => {
    const r = state.regionsProgress && state.regionsProgress[regionId];
    return !!(r && r.status === 'done');
  };

  const isRegionUnlocked = (regionId) => {
    const unlocked = computeUnlocked(earnedBadgeCount());
    return unlocked.has(regionId);
  };

  const getRegionStatus = (regionId) => {
    if (isRegionDone(regionId)) return 'done';
    if (isRegionUnlocked(regionId)) return 'open';
    return 'locked';
  };

  const getProgressMap = () => {
    const allIds = ['marmara', 'karadeniz', 'ege', 'icanadolu', 'akdeniz', 'doguanadolu', 'guneydogu'];
    const map = {};
    allIds.forEach(id => { map[id] = getRegionStatus(id); });
    return map;
  };

  const completeRegion = (regionId) => {
    setState(prev => {
      const existing = (prev.regionsProgress && prev.regionsProgress[regionId]) || { missions: [] };
      if (existing.status === 'done') return prev; // idempotent
      return {
        ...prev,
        regionsProgress: {
          ...prev.regionsProgress,
          [regionId]: {
            ...existing,
            status: 'done',
            completedAt: new Date().toISOString(),
          }
        },
        sessionLog: [
          ...(prev.sessionLog || []),
          { ts: Date.now(), type: 'region_complete', payload: { regionId } }
        ]
      };
    });
  };

  const recordMissionAttempt = (regionId, missionIdx, correct, timeMs) => {
    setState(prev => {
      const existing = (prev.regionsProgress && prev.regionsProgress[regionId]) || { missions: [] };
      const missions = Array.isArray(existing.missions) ? [...existing.missions] : [];
      const cur = missions[missionIdx] || { attempts: 0, correct: false, timeMs: 0 };
      missions[missionIdx] = {
        attempts: (cur.attempts || 0) + 1,
        correct: !!correct || !!cur.correct,
        timeMs: (cur.timeMs || 0) + (timeMs || 0),
      };
      return {
        ...prev,
        regionsProgress: {
          ...prev.regionsProgress,
          [regionId]: {
            ...existing,
            missions,
          }
        },
        sessionLog: [
          ...(prev.sessionLog || []),
          { ts: Date.now(), type: 'mission_attempt', payload: { regionId, missionIdx, correct, timeMs } }
        ]
      };
    });
  };

  const recordQuizAnswer = (qIdx, correct, timeMs) => {
    setState(prev => ({
      ...prev,
      sessionLog: [
        ...(prev.sessionLog || []),
        { ts: Date.now(), type: 'quiz_answer', payload: { qIdx, correct, timeMs } }
      ]
    }));
  };

  const setQuizScore = (score) => {
    setState(prev => ({
      ...prev,
      quizScore: score,
      sessionLog: [
        ...(prev.sessionLog || []),
        { ts: Date.now(), type: 'quiz_complete', payload: { score } }
      ]
    }));
  };

  const recordCategoryAnswer = (regionId, categoryId, correct) => {
    if (!correct) return;
    setState(prev => {
      const rp = prev.regionsProgress || {};
      const region = rp[regionId] || {};
      const cats = region.categories || {};
      const cat = cats[categoryId] || { correctCount: 0, attempts: 0 };
      if (cat.completed) return prev;
      const newCount = Math.min(3, (cat.correctCount || 0) + 1);
      const newCat = {
        ...cat,
        correctCount: newCount,
        attempts: (cat.attempts || 0) + 1,
        completed: newCount >= 3,
      };
      const newCats = { ...cats, [categoryId]: newCat };
      const allCatIds = (window.getCategoriesForRegion ? window.getCategoriesForRegion(regionId) : (window.CATEGORIES_BY_REGION && window.CATEGORIES_BY_REGION[regionId] || [])).map(c => c.id);
      const allDone = allCatIds.length > 0 && allCatIds.every(cid => newCats[cid] && newCats[cid].completed);
      return {
        ...prev,
        regionsProgress: {
          ...rp,
          [regionId]: {
            ...region,
            categories: newCats,
            status: allDone ? 'done' : 'partial',
            completedAt: allDone && !region.completedAt ? new Date().toISOString() : region.completedAt,
          }
        },
        sessionLog: [
          ...(prev.sessionLog || []),
          { ts: Date.now(), type: 'category_answer', payload: { regionId, categoryId, correct } }
        ]
      };
    });
  };

  const recordCategoryMissionAttempt = (regionId, categoryId, missionIdx, correct, timeMs) => {
    setState(prev => {
      const rp = prev.regionsProgress || {};
      const region = rp[regionId] || { missions: [] };
      const cats = region.categories || {};
      const cat = cats[categoryId] || { missions: [] };
      const missions = Array.isArray(cat.missions) ? [...cat.missions] : [];
      const cur = missions[missionIdx] || { attempts: 0, correct: false, timeMs: 0 };
      missions[missionIdx] = {
        attempts: (cur.attempts || 0) + 1,
        correct: !!correct || !!cur.correct,
        timeMs: (cur.timeMs || 0) + (timeMs || 0),
      };
      // 3 mission'da hepsi correct ise category completed
      const allCorrect = missions.length === 3 && missions.every(m => m && m.correct);
      const newCat = { ...cat, missions, completed: allCorrect || cat.completed };
      const newCats = { ...cats, [categoryId]: newCat };
      // Bölge done = 5 kategorinin hepsi completed
      const allCatIds = (window.getCategoriesForRegion ? window.getCategoriesForRegion(regionId) : (window.CATEGORIES_BY_REGION && window.CATEGORIES_BY_REGION[regionId] || [])).map(c => c.id);
      const allDone = allCatIds.length > 0 && allCatIds.every(cid => newCats[cid] && newCats[cid].completed);
      const newRegion = {
        ...region,
        categories: newCats,
        status: allDone ? 'done' : (region.status === 'done' ? 'done' : (Object.values(newCats).some(x => x.completed) ? 'partial' : 'open')),
        completedAt: allDone && !region.completedAt ? new Date().toISOString() : region.completedAt,
      };
      return {
        ...prev,
        regionsProgress: { ...rp, [regionId]: newRegion },
        sessionLog: [
          ...(prev.sessionLog || []),
          { ts: Date.now(), type: 'category_mission_attempt', payload: { regionId, categoryId, missionIdx, correct, timeMs } }
        ]
      };
    });
  };

  const isCategoryDone = (regionId, categoryId) => {
    const r = state.regionsProgress && state.regionsProgress[regionId];
    return !!(r && r.categories && r.categories[categoryId] && r.categories[categoryId].completed);
  };

  const getCategoryProgress = (regionId, categoryId) => {
    const r = state.regionsProgress && state.regionsProgress[regionId];
    const cat = r && r.categories && r.categories[categoryId];
    if (!cat) return { correct: 0, total: 3, completed: false };
    const correct = (typeof cat.correctCount === 'number')
      ? cat.correctCount
      : ((cat.missions || []).filter(m => m && m.correct).length);
    return { correct, total: 3, completed: !!cat.completed };
  };

  const reset = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    setState({ ...INITIAL_STATE });
    // Clear cached random question selections so a fresh game gets fresh shuffles.
    if (typeof window !== 'undefined' && typeof window.resetGameOrder === 'function') {
      window.resetGameOrder();
    }
  };

  const exportJson = () => {
    return JSON.stringify(state, null, 2);
  };

  const hasSavedGame = () => {
    return !!(state.playerName && state.playerName.length > 0);
  };

  return {
    state,
    setPlayerName,
    setGrade,
    isRegionUnlocked,
    isRegionDone,
    getRegionStatus,
    getProgressMap,
    earnedBadgeCount,
    completeRegion,
    recordMissionAttempt,
    recordQuizAnswer,
    setQuizScore,
    reset,
    exportJson,
    hasSavedGame,
    recordCategoryMissionAttempt,
    recordCategoryAnswer,
    isCategoryDone,
    getCategoryProgress,
  };
};

Object.assign(window, { useProgress });
