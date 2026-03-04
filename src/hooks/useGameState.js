import { useState, useCallback, useEffect } from "react";

const SCREENS = { SPLASH: "splash", INTRO: "intro", MISSIONS: "missions", GAMEPLAY: "gameplay" };

function loadCompleted() {
  try {
    const raw = localStorage.getItem("zix-completed");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useGameState() {
  const [screen, setScreen] = useState(SCREENS.SPLASH);
  const [lang, setLang] = useState("es");
  const [mission, setMission] = useState(null);
  const [droppedBlocks, setDroppedBlocks] = useState([]);
  const [alienPos, setAlienPos] = useState({ x: 0, y: 0 });
  const [collectedItems, setCollectedItems] = useState([]);
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showResult, setShowResult] = useState(null);
  const [completed, setCompleted] = useState(loadCompleted);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  // Persist completed missions
  useEffect(() => {
    localStorage.setItem("zix-completed", JSON.stringify(completed));
  }, [completed]);

  const addBlock = useCallback((block) => {
    setDroppedBlocks((prev) => {
      if (mission?.maxBlocks && prev.length >= mission.maxBlocks) return prev;
      return [...prev, block];
    });
  }, [mission]);

  const removeBlock = useCallback((index) => {
    setDroppedBlocks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const startMission = useCallback((m, currentLang) => {
    setMission(m);
    setDroppedBlocks([]);
    setAlienPos({ ...m.startPos });
    setCollectedItems([]);
    setShowResult(null);
    setIsRunning(false);
    setCurrentStepIndex(-1);
    setScreen(SCREENS.GAMEPLAY);
  }, []);

  const resetMission = useCallback(() => {
    if (!mission) return;
    setDroppedBlocks([]);
    setAlienPos({ ...mission.startPos });
    setCollectedItems([]);
    setShowResult(null);
    setIsRunning(false);
    setCurrentStepIndex(-1);
  }, [mission]);

  const completeMission = useCallback(() => {
    if (mission) {
      setCompleted((prev) => [...new Set([...prev, mission.id])]);
    }
    setShowResult(null);
    setMission(null);
    setDroppedBlocks([]);
    setScreen(SCREENS.MISSIONS);
  }, [mission]);

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "es" ? "en" : "es"));
  }, []);

  const goToScreen = useCallback((s) => setScreen(s), []);

  return {
    // State
    screen,
    lang,
    mission,
    droppedBlocks,
    alienPos,
    collectedItems,
    isMoving,
    isRunning,
    showResult,
    completed,
    currentStepIndex,
    // Setters (exposed for gameplay animation)
    setAlienPos,
    setCollectedItems,
    setIsMoving,
    setIsRunning,
    setShowResult,
    setCurrentStepIndex,
    setLang,
    // Actions
    addBlock,
    removeBlock,
    startMission,
    resetMission,
    completeMission,
    toggleLang,
    goToScreen,
    SCREENS,
  };
}
